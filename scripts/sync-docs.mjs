import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://developers.llamaindex.ai';
const DOCS_ROOT = '/python/framework/';
const MODEL = process.env.OLLAMA_TRANSLATION_MODEL || 'gemma4:e2b';
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434/api/generate';
const MAX_CHUNK = 4200;
const TRANSLATION_CONCURRENCY = Math.max(1, Number(process.env.OLLAMA_TRANSLATION_CONCURRENCY || 2) || 2);
const PIPELINE_VERSION = 4;
let completedTranslationChunks = 0;
const LIMIT_ARG = process.argv.find((arg) => arg.startsWith('--limit='));
const PAGE_LIMIT = LIMIT_ARG ? Number(LIMIT_ARG.split('=')[1]) : Infinity;
const EXCLUDE_ARG = process.argv.find((arg) => arg.startsWith('--exclude='));
const EXCLUDED_ROUTES = new Set(EXCLUDE_ARG ? EXCLUDE_ARG.slice('--exclude='.length).split(',') : []);

const termWhitelist = [
  'LlamaIndex Framework', 'LlamaIndex', 'LlamaParse', 'LlamaAgents', 'LlamaCloud', 'LiteParse',
  'ExtractBench', 'ParseBench', 'OpenAI', 'Anthropic', 'Amazon Bedrock', 'Bedrock', 'Azure',
  'AWS', 'Cohere', 'Hugging Face', 'LangChain', 'Pydantic', 'Pinecone', 'Weaviate', 'Milvus',
  'Qdrant', 'Chroma', 'FAISS', 'Elasticsearch', 'Neo4j', 'PostgreSQL', 'MongoDB', 'Redis',
  'Cassandra', 'BigQuery', 'Ollama', 'Gemini', 'MCP', 'LLM', 'LLMs', 'RAG', 'API', 'SDK',
  'VectorStoreIndex', 'VectorStore', 'SimpleDirectoryReader', 'ServiceContext', 'Settings',
  'Document', 'Documents', 'Node', 'Nodes', 'Agent', 'Agents', 'Workflow', 'Workflows',
  'Retriever', 'QueryEngine', 'OpenAIEmbedding', 'CallbackManager', 'TypeScript', 'JavaScript', 'agentic application',
  'Python', 'FastAPI', 'Jupyter', 'Docker', 'SQL', 'JSON', 'CSV', 'PDF', 'Markdown', 'HTTP',
];

const SYSTEM_PROMPT = `You are a careful technical documentation translator. Translate English into natural Traditional Chinese used in Taiwan.
Keep product names, library and provider names, API/type/function/property names, identifiers, acronyms, and every placeholder exactly as written. Translate ordinary explanatory prose and headings. Prefer Taiwan usage such as「資料」、「安裝」、「物件」、「向量」. Keep technical terms in English when translating them would sound forced.
Write concise, natural prose as a Taiwanese technical writer. Avoid literal English calques and awkward synonyms. Do not add English glosses in parentheses unless they already exist in the source. For terms that would sound forced in Chinese, leave them in English.
Preserve all Markdown structure, heading levels, list markers, table rows, link labels, line breaks, and punctuation. Every LLXKEEP marker is opaque: copy it exactly once and in the same position. Do not add, remove, summarize, or explain content. Output only the translated text.`;

const zhLabelMap = {
  getting_started: '開始使用', understanding: '學習', use_cases: '使用案例', module_guides: '元件指南',
  community: '開源社群', integrations: '整合', embeddings: 'Embeddings', llm: 'LLM',
  retrievers: 'Retrievers', vector_stores: 'Vector Stores', evaluating: '評估', indexing: '索引',
  loading: '資料載入', storing: '資料儲存', querying: '查詢', observing: '可觀測性',
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchText(url, attempts = 4) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { 'user-agent': 'LlamaIndex-Framework-zh-TW-local-copy/1.0' },
        signal: AbortSignal.timeout(60000),
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText} — ${url}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      await sleep(500 * (attempt + 1));
    }
  }
  throw lastError;
}

function parseSitemap(xml) {
  const urls = [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/g)].map((match) => match[1].trim());
  const routes = new Map();
  for (const rawUrl of urls) {
    const pathname = new URL(rawUrl).pathname;
    if (pathname !== DOCS_ROOT && !pathname.startsWith(DOCS_ROOT)) continue;
    const route = canonicalRoute(pathname);
    if (!routes.has(route)) routes.set(route, { sourceUrl: rawUrl, route });
  }
  return [...routes.values()];
}

function canonicalRoute(pathname) {
  const decoded = decodeURIComponent(pathname).replace(/\/index\.md$/, '/').replace(/\.md$/, '/');
  return decoded.endsWith('/') ? decoded : `${decoded}/`;
}

function parseTree(tree) {
  const routes = new Map();
  const folderLabels = new Map();
  const folders = [];
  const stack = [];
  let order = 0;
  for (const line of tree.split(/\r?\n/)) {
    const match = line.match(/^([│\s]*)(?:├──|└──)\s*(.*)$/);
    if (!match) continue;
    const depth = Math.floor(match[1].length / 4);
    stack.length = depth;
    const text = match[2].trim();
    const folderMatch = text.match(/^(?!\.\/)([^/]+)\/(?:\s+—\s+([^()]+))?/);
    if (folderMatch) {
      const name = folderMatch[1].trim();
      const sourceLabel = folderMatch[2]?.trim() || name.replaceAll('_', ' ');
      stack.push(name);
      const folderRoute = `${DOCS_ROOT}${stack.join('/')}/`;
      folderLabels.set(folderRoute, sourceLabel);
      folders.push({ route: folderRoute, sourceLabel });
      continue;
    }
    const indexMatch = text.match(/^\.\/\s+—\s+(.+)$/);
    const slug = indexMatch ? '' : text.split(/\s+—\s+/)[0].trim();
    const route = `${DOCS_ROOT}${[...stack, slug].filter(Boolean).join('/')}${stack.length || slug ? '/' : ''}`;
    routes.set(canonicalRoute(route), order++);
  }
  return { routes, folderLabels, folders };
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\s*\n([\s\S]*?)\n---\s*(?:\n|$)/);
  if (!match) return { title: '', description: '', body: markdown };
  const meta = match[1];
  const read = (key) => {
    const value = meta.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'))?.[1]?.trim() || '';
    return value.replace(/^(['"])(.*)\1$/, '$2');
  };
  return { title: read('title'), description: read('description'), body: markdown.slice(match[0].length) };
}

function cleanTitle(value, route) {
  const title = value
    .replace(/\s*\|\s*Developer Documentation.*$/i, '')
    .replace(/,\s*by the makers of LlamaParse$/i, '')
    .trim();
  if (title) return title;
  const last = route.replace(/\/$/, '').split('/').at(-1) || 'Framework';
  return last.replaceAll('_', ' ').replaceAll('-', ' ');
}

function slugId(value) {
  let text = value
    .replace(/<[^>]+>/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .replace(/&amp;/g, 'and')
    .trim()
    .toLocaleLowerCase();
  try { text = text.normalize('NFKD'); } catch {}
  return text
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function extractHeadings(source, translated) {
  const get = (text) => {
    const result = [];
    const lines = text.split(/\r?\n/);
    let inFence = false;
    let fenceChar = '';
    const used = new Map();
    for (const line of lines) {
      const fence = line.match(/^\s{0,3}(`{3,}|~{3,})/);
      if (fence) {
        if (!inFence) { inFence = true; fenceChar = fence[1][0]; }
        else if (fence[1][0] === fenceChar) inFence = false;
        continue;
      }
      if (inFence) continue;
      const heading = line.match(/^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/);
      if (!heading) continue;
      const level = heading[1].length;
      const textValue = heading[2].replace(/\s+\{#[^}]+\}\s*$/, '').trim();
      const explicit = heading[2].match(/\{#([^}]+)\}/)?.[1];
      const base = explicit || slugId(textValue) || `section-${result.length + 1}`;
      const count = used.get(base) || 0;
      used.set(base, count + 1);
      result.push({ level, id: count ? `${base}-${count}` : base, sourceText: textValue });
    }
    return result;
  };
  const sourceHeadings = get(source);
  const translatedHeadings = get(translated);
  return translatedHeadings.map((heading, index) => ({
    level: heading.level,
    id: sourceHeadings[index]?.id || heading.id,
    text: stripMarkdownInline(heading.sourceText),
  }));
}

function stripMarkdownInline(text = '') {
  return text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[`*_~]/g, '').trim();
}

function splitLines(text) {
  return text.match(/[^\n]*\n|[^\n]+$/g) || [];
}

function createTokenStore() {
  const values = new Map();
  let index = 0;
  return {
    values,
    mask(value) {
      const token = `LLXKEEP${String(index++).padStart(5, '0')}TOKEN`;
      values.set(token, value);
      return token;
    },
  };
}

function maskFencedCode(text, store) {
  const lines = splitLines(text);
  let output = '';
  for (let index = 0; index < lines.length; index += 1) {
    const open = lines[index].match(/^\s{0,3}(`{3,}|~{3,})/);
    if (!open) { output += lines[index]; continue; }
    const fence = open[1][0];
    let end = index + 1;
    while (end < lines.length && !new RegExp(`^\\s{0,3}${fence}{${open[1].length},}\\s*$`).test(lines[end].replace(/\n$/, ''))) end += 1;
    if (end >= lines.length) end = lines.length - 1;
    output += store.mask(lines.slice(index, end + 1).join(''));
    index = end;
  }
  return output;
}

function maskMathAndHtml(text, store) {
  let output = text;
  output = output.replace(/^\$\$[\s\S]*?^\$\$\s*$/gm, (value) => store.mask(value));
  output = output.replace(/<!--[\s\S]*?-->/g, (value) => store.mask(value));
  output = output.replace(/<\/?[A-Za-z][^>]*>/g, (value) => store.mask(value));
  return output;
}

function maskInlineCodeAndUrls(text, store) {
  let output = text.replace(/(`+)[^`\n]*?\1/g, (value) => store.mask(value));
  output = output.replace(/(\]\()([^\)\n]+)(\))/g, (_whole, before, href, after) => `${before}${store.mask(href)}${after}`);
  output = output.replace(/<https?:\/\/[^>\s]+>/gi, (value) => store.mask(value));
  output = output.replace(/https?:\/\/[^\s)\]>]+/gi, (value) => store.mask(value));
  return output;
}

function maskKnownTerms(text, store) {
  let output = text;
  const terms = [...termWhitelist].sort((a, b) => b.length - a.length);
  for (const term of terms) {
    const pattern = new RegExp(`(?<![A-Za-z0-9_])${escapeRegExp(term)}(?![A-Za-z0-9_])`, 'gi');
    output = output.replace(pattern, (value) => store.mask(value));
  }
  return output;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function chunkText(text, maxChars = MAX_CHUNK) {
  const chunks = [];
  let current = '';
  for (const line of splitLines(text)) {
    if (line.length > maxChars) {
      if (current) { chunks.push(current); current = ''; }
      let rest = line;
      while (rest.length > maxChars) {
        let cut = rest.lastIndexOf(' ', maxChars);
        if (cut < maxChars * 0.55) cut = maxChars;
        const tokenStart = rest.lastIndexOf('LLXKEEP', cut);
        if (tokenStart >= 0) {
          const tokenEnd = rest.indexOf('TOKEN', tokenStart) + 'TOKEN'.length;
          if (tokenEnd > cut && tokenStart < cut) cut = tokenStart;
        }
        chunks.push(rest.slice(0, cut));
        rest = rest.slice(cut);
      }
      current = rest;
      continue;
    }
    if (current.length && current.length + line.length > maxChars) {
      chunks.push(current);
      current = '';
    }
    current += line;
  }
  if (current) chunks.push(current);
  return chunks;
}

async function callLocalModel(text, extraInstruction = '') {
  if (!/[A-Za-z]/.test(text)) return text;
  const payload = {
    model: MODEL,
    prompt: `${SYSTEM_PROMPT}\n${extraInstruction}\n\nTranslate this text:\n${text}`,
    stream: false,
    think: false,
    options: { temperature: 0.1, num_ctx: 8192, num_predict: 8192 },
  };
  let lastError;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    try {
      const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(180000),
      });
      if (!response.ok) {
        const error = new Error(`Ollama ${response.status}: ${await response.text()}`);
        error.status = response.status;
        throw error;
      }
      const data = await response.json();
      if (!data.response) throw new Error('Ollama returned an empty translation');
      return data.response.replace(/^```(?:text|markdown)?\s*|\s*```$/g, '');
    } catch (error) {
      lastError = error;
      await sleep(error.status === 429 ? Math.min(30000, 2000 * 2 ** attempt) : 700 * (attempt + 1));
    }
  }
  throw lastError;
}

function preservesPlaceholders(source, translated) {
  const expected = [...source.matchAll(/LLXKEEP\d{5}TOKEN/g)].map((match) => match[0]);
  const actual = [...translated.matchAll(/LLXKEEP\d{5}TOKEN/g)].map((match) => match[0]);
  return expected.length === actual.length && new Set(expected).size === new Set(actual).size && expected.every((token) => actual.includes(token));
}

async function translateChunk(chunk) {
  const keepBoundaryWhitespace = (value) => {
    if (!chunk.trim()) return chunk;
    return (chunk.match(/^\s*/)?.[0] || '') + value.trim() + (chunk.match(/\s*$/)?.[0] || '');
  };
  const cacheKey = createHash('sha256').update(`${PIPELINE_VERSION}\0${MODEL}\0${SYSTEM_PROMPT}\0${chunk}`).digest('hex');
  const cacheFile = path.join(ROOT, '.translation-cache', `${cacheKey}.txt`);
  try {
    const cached = await readFile(cacheFile, 'utf8');
      if (preservesPlaceholders(chunk, cached) && preservesFences(chunk, cached)) return keepBoundaryWhitespace(cached);
  } catch {}
  const save = async (value) => {
    await mkdir(path.dirname(cacheFile), { recursive: true });
    await writeFile(cacheFile, value);
    completedTranslationChunks += 1;
    if (completedTranslationChunks % 10 === 0) console.log(`  completed ${completedTranslationChunks} translation chunks (saved checkpoints)`);
      return keepBoundaryWhitespace(value);
  };
  let translated = await callLocalModel(chunk);
  if (preservesPlaceholders(chunk, translated) && preservesFences(chunk, translated)) return save(translated);
  translated = await callLocalModel(chunk, 'On this retry, copy every LLXKEEP marker exactly once. Do not add, remove, or change Markdown code fences. Translate only the surrounding prose.');
  if (preservesPlaceholders(chunk, translated) && preservesFences(chunk, translated)) return save(translated);
  if (!preservesPlaceholders(chunk, translated)) markerFallbackChunks += 1;
  if (!preservesFences(chunk, translated)) fenceFallbackChunks += 1;
  console.warn('  kept one chunk in English because the local model changed protected Markdown structure');
  return chunk;
}

function preservesFences(source, translated) {
  return JSON.stringify(extractFences(source)) === JSON.stringify(extractFences(translated));
}

function restoreTokens(text, store) {
  let output = text;
  for (const [token, value] of [...store.values.entries()].reverse()) {
    const count = output.split(token).length - 1;
    if (count !== 1) throw new Error(`Placeholder ${token} appeared ${count} times in translation`);
    output = output.replace(token, value);
  }
  return output;
}

async function translateText(value) {
  if (!value || !/[A-Za-z]/.test(value)) return value;
  const store = createTokenStore();
  let masked = maskKnownTerms(value, store);
  const chunks = chunkText(masked, 1800);
  const translated = await mapLimit(chunks, Math.min(TRANSLATION_CONCURRENCY, chunks.length), translateChunk);
  return restoreTokens(translated.join(''), store).trim();
}

function extractDestination(raw) {
  const trimmed = raw.trim();
  const match = trimmed.match(/^(<[^>]+>|[^\s]+)([\s\S]*)$/);
  if (!match) return { url: trimmed, suffix: '' };
  const url = match[1].startsWith('<') ? match[1].slice(1, -1) : match[1];
  return { url, suffix: match[2] };
}

function rewriteUrl(rawUrl, sourceUrl) {
  try {
    const resolved = new URL(rawUrl, sourceUrl);
    if (resolved.hostname === 'developers.llamaindex.ai' && resolved.pathname.startsWith(DOCS_ROOT)) {
      let route = resolved.pathname.replace(/\/index\.md$/, '/').replace(/\.md$/, '/');
      if (!route.endsWith('/')) route += '/';
      return `${route}${resolved.search}${resolved.hash}`;
    }
    return resolved.toString();
  } catch {
    return rawUrl;
  }
}

const assetCache = new Map();
let markerFallbackChunks = 0;
let fenceFallbackChunks = 0;
let codeFenceFallbackPages = 0;
async function localizeAsset(rawUrl, sourceUrl) {
  let absolute;
  try {
    absolute = new URL(rawUrl.replace(/\\([&()])/g, '$1'), sourceUrl).toString();
  } catch {
    return null;
  }
  if (!/^https?:\/\//i.test(absolute)) return null;
  if (assetCache.has(absolute)) return assetCache.get(absolute);
  try {
    const response = await fetch(absolute, { signal: AbortSignal.timeout(60000) });
    if (!response.ok) throw new Error(`${response.status}`);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) throw new Error(`not an image: ${contentType}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    let extension = path.extname(new URL(absolute).pathname).toLowerCase();
    if (!/^\.(png|jpe?g|gif|svg|webp|avif|bmp)$/.test(extension)) {
      const subtype = contentType.split('/')[1]?.split(';')[0] || 'png';
      extension = subtype === 'jpeg' ? '.jpg' : `.${subtype.replace('svg+xml', 'svg')}`;
    }
    const hash = createHash('sha1').update(absolute).digest('hex').slice(0, 12);
    const filename = `${hash}${extension}`;
    await mkdir(path.join(ROOT, 'public/assets'), { recursive: true });
    await writeFile(path.join(ROOT, 'public/assets', filename), bytes);
    const localPath = `/assets/${filename}`;
    assetCache.set(absolute, localPath);
    return localPath;
  } catch (error) {
    assetCache.set(absolute, null);
    console.warn(`  asset unavailable: ${absolute} (${error.message})`);
    return null;
  }
}

async function rewriteMarkdownLinks(markdown, sourceUrl) {
  const replacements = new Map();
  const failedImages = new Set();
  const matches = [...markdown.matchAll(/(!?\[[^\]]*\]\()([^\)\n]+)(\))/g)];
  for (const match of matches) {
    if (replacements.has(match[2])) continue;
    const { url, suffix } = extractDestination(match[2]);
    const isImage = match[1].startsWith('!');
    let replacement;
    if (isImage) {
      const localized = await localizeAsset(url, sourceUrl);
      replacement = localized;
      if (!localized) failedImages.add(match[0]);
    } else {
      replacement = rewriteUrl(url, sourceUrl);
    }
    replacements.set(match[2], `${replacement}${suffix}`);
  }
  let output = markdown.replace(/(!?\[[^\]]*\]\()([^\)\n]+)(\))/g, (whole, before, href, after) => {
    if (failedImages.has(whole)) return whole.match(/^!\[([^\]]*)\]\(/)?.[1] || '';
    return `${before}${replacements.get(href) || href}${after}`;
  });

  const htmlSrcs = [...output.matchAll(/\bsrc=(['"])(.*?)\1/g)];
  for (const match of htmlSrcs) {
    const url = match[2];
    if (replacements.has(url)) continue;
    replacements.set(url, await localizeAsset(url, sourceUrl));
  }
  output = output.replace(/\bsrc=(['"])(.*?)\1/g, (_whole, quote, url) => {
    const replacement = replacements.get(url);
    return replacement ? `src=${quote}${replacement}${quote}` : '';
  });
  return output;
}

function protectMarkdown(markdown, store = createTokenStore(), codeAlreadyMasked = false) {
  let masked = codeAlreadyMasked ? markdown : maskFencedCode(markdown, store);
  masked = maskMathAndHtml(masked, store);
  masked = maskInlineCodeAndUrls(masked, store);
  masked = maskKnownTerms(masked, store);
  return { masked, store };
}

async function translateMarkdown(markdown, store = createTokenStore(), codeAlreadyMasked = false, expectedFences = extractFences(markdown), fallbackMarkdown = markdown) {
  const { masked } = protectMarkdown(markdown, store, codeAlreadyMasked);
  const chunks = chunkText(masked);
  const translated = await mapLimit(chunks, Math.min(TRANSLATION_CONCURRENCY, chunks.length), translateChunk);
  const restored = restoreTokens(translated.join(''), store);
  const actual = extractFences(restored);
  if (JSON.stringify(expectedFences) !== JSON.stringify(actual)) {
    codeFenceFallbackPages += 1;
    console.warn('  restored original Markdown for this page after a code fence mismatch');
    return fallbackMarkdown;
  }
  return restored;
}

function extractFences(markdown) {
  const lines = splitLines(markdown);
  const blocks = [];
  for (let index = 0; index < lines.length; index += 1) {
    const open = lines[index].match(/^\s{0,3}(`{3,}|~{3,})/);
    if (!open) continue;
    let end = index + 1;
    while (end < lines.length && !new RegExp(`^\\s{0,3}${open[1][0]}{${open[1].length},}\\s*$`).test(lines[end].replace(/\n$/, ''))) end += 1;
    if (end >= lines.length) end = lines.length - 1;
    blocks.push(lines.slice(index, end + 1).join(''));
    index = end;
  }
  return blocks;
}

function buildHeadings(sourceBody, translatedBody) {
  return extractHeadings(sourceBody, translatedBody);
}

function plainSearchText(markdown) {
  return markdown
    .replace(/^---[\s\S]*?---\s*/m, '')
    .replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[>#*_~|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function pageId(route) {
  const value = route.slice(DOCS_ROOT.length).replace(/\/$/, '') || 'index';
  return value.split('/').map((segment) => encodeURIComponent(segment)).join('/');
}

async function mapLimit(items, limit, callback) {
  const output = new Array(items.length);
  let nextIndex = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const index = nextIndex++;
      if (index >= items.length) break;
      output[index] = await callback(items[index], index);
    }
  });
  await Promise.all(workers);
  return output;
}

async function main() {
  const sitemap = await fetchText(`${ORIGIN}/sitemap.xml`);
  const allPages = parseSitemap(sitemap);
  const treeJson = await fetch(`${ORIGIN}/api/list?path=%2Fpython%2Fframework%2F&depth=10`).then(async (response) => {
    if (!response.ok) throw new Error(`Unable to load published documentation tree: ${response.status}`);
    return response.json();
  });
  const treeInfo = parseTree(treeJson.tree || '');
  await mkdir(path.join(ROOT, 'source/snapshots'), { recursive: true });
  await writeFile(path.join(ROOT, 'source/snapshots/sitemap.xml'), sitemap);
  await writeFile(path.join(ROOT, 'source/snapshots/framework-tree.json'), JSON.stringify(treeJson, null, 2));
  const selected = allPages.filter((page) => !EXCLUDED_ROUTES.has(page.route)).map((page, index) => ({
    ...page,
    order: treeInfo.routes.get(page.route) ?? 100000 + index,
  })).sort((a, b) => a.order - b.order).slice(0, PAGE_LIMIT);

  await mkdir(path.join(ROOT, 'source/en'), { recursive: true });
  await mkdir(path.join(ROOT, 'source/zh-TW'), { recursive: true });
  await mkdir(path.join(ROOT, 'public/content/pages'), { recursive: true });

  console.log(`Published sitemap: ${allPages.length} Framework pages; API tree reports ${(treeJson.tree.match(/\(\d+ pages\)/)?.[0] || 'an uncounted tree')}.`);
  console.log(`Downloading and translating ${selected.length} pages with Ollama model ${MODEL}.`);
  if (EXCLUDED_ROUTES.size) console.log(`Smoke-test exclusions: ${[...EXCLUDED_ROUTES].join(', ')}`);

  const downloadFailures = [];
  const sourcePages = await mapLimit(selected, 8, async (page, index) => {
    const mdUrl = `${page.sourceUrl.replace(/\/$/, '')}/index.md`;
    try {
      const raw = await fetchText(mdUrl);
      const file = path.join(ROOT, 'source/en', `${pageId(page.route)}.md`);
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(file, raw, 'utf8');
      if ((index + 1) % 25 === 0 || index + 1 === selected.length) console.log(`  fetched ${index + 1}/${selected.length}`);
      return { ...page, raw };
    } catch (error) {
      downloadFailures.push({ route: page.route, error: error.message });
      return { ...page, raw: '' };
    }
  });

  const validPages = sourcePages.filter((page) => page.raw);
  const translations = [];
  const translationFailures = [];
  for (let index = 0; index < validPages.length; index += 1) {
    const page = validPages[index];
    console.log(`  translating ${index + 1}/${validPages.length}: ${page.route}`);
    try {
      const output = path.join(ROOT, 'public/content/pages', `${pageId(page.route)}.json`);
      const sourceHash = createHash('sha256').update(page.raw).digest('hex');
      try {
        const cached = JSON.parse(await readFile(output, 'utf8'));
        if (cached.pipelineVersion === PIPELINE_VERSION && cached.sourceHash === sourceHash) {
          const { body: rawBody } = parseFrontmatter(page.raw);
          const translatedSource = path.join(ROOT, 'source/zh-TW', `${pageId(page.route)}.md`);
          await mkdir(path.dirname(translatedSource), { recursive: true });
          await writeFile(translatedSource, `---\ntitle: ${JSON.stringify(cached.title)}\n${cached.description ? `description: ${JSON.stringify(cached.description)}\n` : ''}---\n\n${cached.markdown}`, 'utf8');
          translations.push({
            ...page,
            id: pageId(page.route),
            title: cached.title,
            sourceTitle: cached.sourceTitle,
            description: cached.description,
            contentUrl: `/content/pages/${pageId(page.route)}.json`,
            searchText: plainSearchText(cached.markdown),
            sourceText: plainSearchText(rawBody),
            headings: cached.headings || [],
          });
          console.log(`  reused ${index + 1}/${validPages.length}: ${page.route}`);
          continue;
        }
      } catch {}
      const { title: rawTitle, description: rawDescription, body: rawBody } = parseFrontmatter(page.raw);
      const sourceTitle = cleanTitle(rawTitle, page.route);
      const title = await translateText(sourceTitle);
      const description = rawDescription ? await translateText(rawDescription) : '';
      const codeStore = createTokenStore();
      const expectedFences = extractFences(rawBody);
      const codeMaskedBody = maskFencedCode(rawBody, codeStore);
      const rewrittenBody = await rewriteMarkdownLinks(codeMaskedBody, page.sourceUrl);
      const fallbackBody = restoreTokens(rewrittenBody, codeStore);
      const markdown = await translateMarkdown(rewrittenBody, codeStore, true, expectedFences, fallbackBody);
      const headings = buildHeadings(rawBody, markdown);
      const content = {
        route: page.route,
        sourceUrl: page.sourceUrl,
        title,
        sourceTitle,
        description,
        markdown,
        headings,
      };
      await mkdir(path.dirname(output), { recursive: true });
      await writeFile(output, JSON.stringify({ ...content, pipelineVersion: PIPELINE_VERSION, sourceHash }), 'utf8');
      const translatedSource = path.join(ROOT, 'source/zh-TW', `${pageId(page.route)}.md`);
      await mkdir(path.dirname(translatedSource), { recursive: true });
      await writeFile(translatedSource, `---\ntitle: ${JSON.stringify(title)}\n${description ? `description: ${JSON.stringify(description)}\n` : ''}---\n\n${markdown}`, 'utf8');
      translations.push({
        ...page,
        id: pageId(page.route),
        title,
        sourceTitle,
        description,
        contentUrl: `/content/pages/${pageId(page.route)}.json`,
        searchText: plainSearchText(markdown),
        sourceText: plainSearchText(rawBody),
        headings,
      });
    } catch (error) {
      translationFailures.push({ route: page.route, error: error.message });
      console.error(`  translation failed: ${page.route}: ${error.message}`);
    }
    if ((index + 1) % 10 === 0 || index + 1 === validPages.length) console.log(`  translated ${index + 1}/${validPages.length}`);
  }

  const folderLabels = {};
  const uniqueLabels = [...new Set([...treeInfo.folders.map((item) => item.sourceLabel), ...Object.keys(zhLabelMap)])];
  const folderTranslationCache = new Map();
  for (const label of uniqueLabels) {
    folderTranslationCache.set(label, await translateText(label));
  }
  for (const [route, sourceLabel] of treeInfo.folderLabels) {
    const pageAtFolder = translations.find((page) => page.route === route);
    folderLabels[route.slice(DOCS_ROOT.length).replace(/\/$/, '')] = pageAtFolder?.title || folderTranslationCache.get(sourceLabel) || sourceLabel;
  }
  for (const [slug, translatedLabel] of Object.entries(zhLabelMap)) {
    if (!folderLabels[slug]) folderLabels[slug] = translatedLabel;
  }

  const orderedPages = translations.sort((a, b) => a.order - b.order);
  const manifest = {
    title: 'LlamaIndex Framework 繁體中文文件',
    sourceRoot: `${ORIGIN}${DOCS_ROOT}`,
    locale: 'zh-TW',
    pageCount: orderedPages.length,
    capturedAt: new Date().toISOString(),
    folderLabels,
    pages: orderedPages.map(({ raw, searchText, sourceText, headings, ...page }) => page),
  };
  await writeFile(path.join(ROOT, 'public/content/manifest.json'), JSON.stringify(manifest), 'utf8');
  const search = orderedPages.map((page) => ({
    route: page.route,
    title: page.title,
    sourceTitle: page.sourceTitle,
    text: page.searchText,
    sourceText: page.sourceText,
    snippet: page.searchText.slice(0, 220),
  }));
  await writeFile(path.join(ROOT, 'public/content/search-index.json'), JSON.stringify(search), 'utf8');

  const report = {
    capturedAt: new Date().toISOString(),
    publishedSitemapPages: allPages.length,
    apiTreePages: Number(treeJson.tree.match(/\((\d+) pages\)/)?.[1] || 0),
    fetchedPages: validPages.length,
    translatedPages: translations.length,
    unresolvedAssets: [...assetCache.entries()].filter(([, value]) => !value).map(([url]) => url),
    markerFallbackChunks,
    fenceFallbackChunks,
    codeFenceFallbackPages,
    downloadFailures,
    translationFailures,
  };
  await writeFile(path.join(ROOT, 'sync-report.json'), JSON.stringify(report, null, 2), 'utf8');
  console.log(`Done: ${translations.length}/${selected.length} pages translated; ${assetCache.size} image assets checked.`);
  if (downloadFailures.length || translationFailures.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
