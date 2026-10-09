import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS_ROOT = '/python/framework/';
const MODEL = process.env.OLLAMA_TRANSLATION_MODEL || 'gemma4:e2b';
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434/api/generate';
const REPAIR_CONCURRENCY = Math.max(1, Number(process.env.OLLAMA_TRANSLATION_CONCURRENCY || 1));
let cacheWriteQueue = Promise.resolve();
const CACHE_VERSION = 1;
const TOKEN_RE = /TRFIX\d{5}END/g;
const HAN_RE = /\p{Script=Han}/u;
const COMMON_ENGLISH = new Set(`a an and are as at be been being but by can could did do does doing for from had has have he her here hers him his how i if in into is it its just may might more most must my no nor not of on once only or other our out over same she should so some such than that the their them then there these they this those through to too under up us very was we were what when where which while who why will with would you your`.split(/\s+/));
const SENTENCE_START_WORDS = new Set(`a an and as at but by for if in it no of on or so the then this those to we when where while who why you`.split(/\s+/));
const ORDINARY_TITLECASE_WORDS = new Set(`about after all also another any application applications agent agents around analyzing analysis basic before build building call can chatbot chatbots common complete configure connector connectors context cost costs creating custom data database databases deployment discover document documents do docs each easy embedding embeddings example examples existing expenses extraction extracting find first following framework frameworks full get getting guide guidelines how index indexes indexing installation integration integrations introduction key keys latency learn list local loading limits make making management material model models monitor monitoring more multimodal new next notebook notebooks now one other overview page perform pipeline pipelines prompt prompts query queries rate read reader readers reading reference repo repository response responses retrieval search searching section sections see set setting settings simple start starting step storage store stores supplementary take terminal text their there these they thing this those through tracking tracing throughout to token tokens tools tutorial tutorials understand understanding use usage using vector vectors view what when where why window windows work workflow workflows working`.split(/\s+/));
const TECH_TERMS = [
  'LlamaIndex Framework', 'LlamaIndex', 'LlamaParse', 'LlamaAgents', 'LlamaCloud', 'LiteParse',
  'ExtractBench', 'ParseBench', 'OpenAI', 'Anthropic', 'Amazon Bedrock Titan embeddings', 'Amazon Bedrock', 'Bedrock', 'Azure',
  'AWS', 'Cohere', 'Hugging Face', 'LangChain', 'Pydantic', 'Pinecone', 'Weaviate', 'Milvus',
  'Qdrant', 'Chroma', 'FAISS', 'Elasticsearch', 'Neo4j', 'PostgreSQL', 'MongoDB', 'Redis',
  'Cassandra', 'BigQuery', 'Ollama', 'Gemini', 'MCP', 'LLM', 'LLMs', 'RAG', 'API', 'SDK',
  'VectorStoreIndex', 'VectorStore', 'SimpleDirectoryReader', 'ServiceContext', 'Settings',
  'Document', 'Documents', 'Node', 'Nodes', 'Agent', 'Agents', 'Workflow', 'Workflows',
  'Retriever', 'QueryEngine', 'OpenAIEmbedding', 'CallbackManager', 'TypeScript', 'JavaScript',
  'Python', 'FastAPI', 'Jupyter', 'Docker', 'SQL', 'JSON', 'CSV', 'PDF', 'Markdown', 'HTTP',
  'PyPI', 'GitHub', 'GitLab', 'Discord', 'Streamlit', 'CopilotKit', 'SECinsights.ai',
  'LiteLLM', 'HuggingFace', 'SentenceTransformers', 'Databricks', 'Snowflake', 'Postgres',
  'MySQL', 'SQLite', 'Weaviate', 'Qdrant', 'ChromaDB', 'FAISS', 'Redis', 'Kubernetes',
  'OpenTelemetry', 'Weights & Biases', 'Langfuse', 'Phoenix', 'Arize', 'Pandas', 'NumPy',
  'JupyterLab', 'LlamaCloud', 'LlamaHub', 'llama-index', 'llama-index-core', 'GitHub Actions',
  'Tonic Validate', 'Tonic', 'LM Format Enforcer', 'RAGs', 'create-llama', 'TruLens', 'UpTrain', 'GraphSignal',
  'Llama Index', 'HuggingFace Inference Providers', 'Inference Providers', 'MonsterAPI', 'Monster Deploy', 'vLLM', 'Tinyllama', 'Mixtral', 'Phi-2',
  'Matryoshka Representation Learning', 'matryoshka',
  'vector store', 'vector stores', 'query engine', 'query engines', 'chat engine', 'chat engines',
  'response synthesizer', 'node parser', 'document parser', 'data connector', 'data connectors',
  'embedding model', 'embedding models', 'RAG pipeline', 'RAG pipelines', 'RAG application',
  'retrieval-augmented generation', 'context augmentation', 'agentic OCR', 'human-in-the-loop',
  'Aleph Alpha', 'Anyscale', 'Baseten', 'CohereAI', 'Cloudflare', 'DashScope', 'Fireworks',
  'Google GenAI', 'Google PaLM', 'Heroku', 'Isaacus', 'Jina', 'JinaAI', 'LLMRails',
  'MistralAI', 'Mixedbread', 'ModelScope', 'Nebius', 'Netmind', 'Nomic', 'NVIDIA', 'Oracle Cloud Infrastructure',
  'Alibaba Cloud OpenSearch Vector Search Edition', 'Alibaba Cloud OpenSearch Vector Service', 'Alibaba Cloud OpenSearch Vector Store',
  'Upstage', 'VoyageAI', 'OpenVINO', 'Premai', 'Cerebras', 'Clarifai', 'Apertis', 'Llama Packs',
  'Google', 'Microsoft', 'Meta', 'Facebook', 'Apple', 'Amazon', 'IBM', 'Intel', 'AMD', 'Groq', 'Mistral',
  'Fireworks AI', 'Together AI', 'Generative AI', 'Oracle Cloud Infrastructure Generative AI', 'NIM', 'NIMs',
  'Django', 'ASGI', 'Colbert V2', 'ColBERT', 'Colab', 'Microsoft Word', 'Hangul Word Processor', 'VideoDB',
  'Elastic Cloud', 'Oracle Database', 'Paul Graham',
];
const SHORT_LABELS = new Map(Object.entries({
  introduction: '簡介',
  here: '此處',
  docs: '文件',
  changelog: '更新紀錄',
  'new features': '新增功能',
  'bug fixes': '錯誤修正',
  'bug fixes / nits': '錯誤與細節修正',
  'llm-as-reranker': 'LLM 作為 reranker',
  'breaking changes': '重大變更',
  documentation: '文件',
  'terminal window': '終端機視窗',
  tip: '提示',
  note: '注意',
  warning: '警告',
  caution: '注意',
  important: '重要',
  resources: '資源',
  'external sources': '外部來源',
  'getting started': '開始使用',
  installation: '安裝',
  overview: '概觀',
  examples: '範例',
  example: '範例',
  usage: '使用方式',
  setup: '設定',
  streaming: '串流',
  customization: '自訂',
  conclusion: '結語',
  requirements: '需求',
  references: '參考資料',
  limitations: '限制',
  summary: '摘要',
  parameters: '參數',
  configuration: '設定',
  evaluation: '評估',
  installation: '安裝',
  indexing: '建立索引',
  loading: '資料載入',
  querying: '查詢',
  storing: '資料儲存',
  visualization: '視覺化',
  prerequisites: '先決條件',
  'table of contents': '目錄',
  'quick start': '快速入門',
  quickstart: '快速入門',
  'starter tutorial': '入門教學',
  'integrations page': '整合頁面',
  'integration page': '整合頁面',
  'local-models tutorial': '本地模型教學',
  'chat engines': '聊天引擎',
  'component guides': '元件指南',
  'use cases': '使用案例',
  'configuration options': '設定選項',
  'next steps': '後續步驟',
  querying: '查詢',
  indexing: '索引',
  loading: '載入',
  storing: '儲存',
  usage: '用法',
  setup: '設定',
  tools: '工具',
  annotations: '註解',
  objects: '物件',
  requirements: '需求',
  limitations: '限制',
  output: '輸出',
  input: '輸入',
  conclusion: '結論',
}));

const SYSTEM_PROMPT = `You are translating technical documentation from English into natural Traditional Chinese used in Taiwan.\n\
Translate ordinary explanatory prose. Keep product names, proper names, library and provider names, API/type/function/property names, identifiers, acronyms, and every TRFIX marker exactly as written. Keep technical terms in English when translating them would sound forced. Prefer Taiwan usage such as「資料」、「安裝」、「物件」、「向量」. Do not add explanations or English glosses. Preserve the exact order and spelling of all TRFIX markers. Return only the translated text.`;

function printHelp() {
  console.log(`Usage:\n  node scripts/repair-translations.mjs --dry-run [--route=/python/framework/...]\n  node scripts/repair-translations.mjs --route=/python/framework/...\n  node scripts/repair-translations.mjs --all\n\n` +
    `--dry-run lists eligible English prose and never calls Ollama or writes files.\n` +
      `--route= repairs one route only. --all repairs all eligible routes. A repair mode is required.\n` +
      `--exclude= accepts comma-separated routes to skip during a batch.\n` +
    `Ollama must be available at ${OLLAMA_URL} with model ${MODEL}.`);
}

function parseArgs(argv) {
  const result = { dryRun: false, all: false, route: '', exclude: [] };
  for (const arg of argv) {
    if (arg === '--help' || arg === '-h') result.help = true;
    else if (arg === '--dry-run') result.dryRun = true;
    else if (arg === '--all') result.all = true;
      else if (arg.startsWith('--route=')) result.route = arg.slice('--route='.length).trim();
      else if (arg.startsWith('--exclude=')) result.exclude = arg.slice('--exclude='.length).split(',').filter(Boolean).map(cleanRoute);
    else throw new Error(`Unknown option: ${arg}`);
  }
  if (result.help) return result;
  if (result.all && result.route) throw new Error('Use either --all or --route, not both.');
  if (!result.dryRun && !result.all && !result.route) throw new Error('Choose --dry-run, --route=..., or --all.');
  return result;
}

function cleanRoute(route) {
  if (!route) return '';
  let value = route.trim();
  if (!value.startsWith('/')) value = `${DOCS_ROOT}${value.replace(/^\/+/, '')}`;
  if (!value.startsWith(DOCS_ROOT)) throw new Error(`Route must be inside ${DOCS_ROOT}: ${route}`);
  if (!value.endsWith('/')) value += '/';
  return value;
}

function routeId(route) {
  const suffix = route.slice(DOCS_ROOT.length).replace(/\/$/, '') || 'index';
  return suffix.split('/').map((part) => encodeURIComponent(decodeURIComponent(part))).join('/');
}

function sourcePathForRoute(route) {
  return path.join(ROOT, 'source', 'en', `${routeId(route)}.md`);
}

function translatedSourcePathForRoute(route) {
  return path.join(ROOT, 'source', 'zh-TW', `${routeId(route)}.md`);
}

function contentPathForRoute(route) {
  return path.join(ROOT, 'public', 'content', 'pages', `${routeId(route)}.json`);
}

async function walkJsonFiles(folder) {
  const result = [];
  let entries;
  try { entries = await readdir(folder, { withFileTypes: true }); } catch { return result; }
  for (const entry of entries) {
    const full = path.join(folder, entry.name);
    if (entry.isDirectory()) result.push(...await walkJsonFiles(full));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.json')) result.push(full);
  }
  return result;
}

async function loadPages() {
  const files = await walkJsonFiles(path.join(ROOT, 'public', 'content', 'pages'));
  const pages = [];
  for (const file of files) {
    let page;
    try { page = JSON.parse(await readFile(file, 'utf8')); } catch { continue; }
    if (typeof page.route !== 'string' || !page.route.startsWith(DOCS_ROOT) || typeof page.markdown !== 'string') continue;
    const sourceFile = sourcePathForRoute(page.route);
    let source;
    try { source = await readFile(sourceFile, 'utf8'); } catch { continue; }
    const { body: sourceBody, metadata: sourceMetadata } = parseFrontmatter(source);
    pages.push({ file, page, route: page.route, sourceFile, sourceBody, sourceMetadata });
  }
  return pages.sort((a, b) => a.route.localeCompare(b.route));
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/);
  if (!match) return { metadata: {}, body: markdown, prefix: '' };
  const metadata = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (m) metadata[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
  return { metadata, body: markdown.slice(match[0].length), prefix: match[0] };
}

function lineRecords(text) {
  const result = [];
  let offset = 0;
  while (offset < text.length) {
    const end = text.indexOf('\n', offset);
    if (end < 0) {
      result.push({ start: offset, end: text.length, raw: text.slice(offset), text: text.slice(offset) });
      offset = text.length;
    } else {
      const lineEnd = end + 1;
      const raw = text.slice(offset, lineEnd);
      result.push({ start: offset, end: lineEnd, raw, text: raw.replace(/\r?\n$/, '') });
      offset = lineEnd;
    }
  }
  if (!text.length) return [];
  return result;
}

function markdownBlocks(text) {
  const lines = lineRecords(text);
  const blocks = [];
  let start = -1;
  let end = -1;
  for (const line of lines) {
    if (!line.text.trim()) {
      if (start >= 0) {
        blocks.push({ start, end, text: text.slice(start, end) });
        start = -1;
      }
      continue;
    }
    if (start < 0) start = line.start;
    end = line.end;
  }
  if (start >= 0) blocks.push({ start, end, text: text.slice(start, end) });
  return blocks;
}

function isExplanatoryBoundary(line) {
  const value = line.trim().replace(/^(?:[-+*]|\d+[.)])\s+/, '');
  return /^(?:to\s+(?:use|install|configure|run|create|query|retrieve|start|continue)\b|the following (?:code|example|steps)\b|in this (?:example|section|guide)\b|this (?:example|section|guide)\b|for more (?:information|details)\b|let['’]s\b|next steps\b)/i.test(value);
}

function retrievalOutputRanges(text) {
  const lines = lineRecords(text);
  const ranges = [];
  let rangeStart = -1;
  let hasTextField = false;
  let fenceChar = '';
  let fenceLength = 0;
  const closeRange = (at) => {
    if (rangeStart >= 0 && at > rangeStart) ranges.push({ start: rangeStart, end: at });
    rangeStart = -1;
    hasTextField = false;
  };

  for (const line of lines) {
    const fence = line.text.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (fence) {
      if (!fenceChar) {
        closeRange(line.start);
        fenceChar = fence[1][0];
        fenceLength = fence[1].length;
      } else if (fence[1][0] === fenceChar && fence[1].length >= fenceLength) {
        fenceChar = '';
        fenceLength = 0;
      }
      continue;
    }
    if (fenceChar) continue;

    if (/^\s{0,3}#{1,6}\s+/.test(line.text)) {
      closeRange(line.start);
      continue;
    }
    const nearbyText = text.slice(line.start, Math.min(text.length, line.start + 800)).replace(/\\\r?\n/g, ' ');
    const idValue = nearbyText.match(/\bNode\s+ID\s*:\s*(?:\*\*|__)?\s*([^\s\\]+)/i)?.[1]?.replace(/[*_`<>]/g, '');
    const hasSimilarity = /\bSimilarity\s*:\s*(?:\*\*|__)?\s*(?:\d+(?:\.\d+)?|\.\d+|none|null|nan)(?:e[+-]?\d+)?/i.test(nearbyText);
    const hasText = /\bText\s*:/i.test(nearbyText);
    const nodeId = /\bNode\s+ID\s*:/i.test(line.text) && Boolean(idValue) && hasSimilarity && hasText;
    if (nodeId) {
      if (rangeStart < 0) rangeStart = line.start;
      hasTextField = /\bText\s*:/i.test(line.text);
      continue;
    }
    if (rangeStart < 0) continue;
    if (/\bText\s*:\s*(?:\*\*|__)?/i.test(line.text)) {
      hasTextField = true;
      continue;
    }
    if (/\bSimilarity\s*:\s*(?:\*\*|__)?\s*(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?/i.test(line.text)) continue;
    if (hasTextField && line.text.trim() && isExplanatoryBoundary(line.text)) {
      closeRange(line.start);
    }
  }
  closeRange(text.length);
  return ranges;
}

function tableSeparatorRow(line) {
  const trimmed = line.trim();
  if (!trimmed.includes('|')) return false;
  const cells = trimmed.replace(/^\|/, '').replace(/\|$/, '').split('|');
  return cells.length > 0 && cells.every((cell) => /^\s*:?-+:?\s*$/.test(cell));
}

function markdownTableHeaderRows(text) {
  const lines = lineRecords(text);
  const headers = [];
  for (let index = 1; index < lines.length; index += 1) {
    if (!tableSeparatorRow(lines[index].text)) continue;
    const header = lines[index - 1];
    if (header.text.includes('|')) headers.push(header);
  }
  return headers;
}

function isTranslatableTableHeader(row) {
  const labels = new Set('name names model models type types language languages format formats size sizes dimension dimensions quantization context contexts'.split(/\s+/));
  const prose = visibleProse(maskMarkdown(row).masked).toLowerCase();
  const words = prose.match(/[a-z]+/g) || [];
  return words.some((word) => labels.has(word));
}

function isDataFrameFieldHeader(row) {
  const unescape = (cell) => cell.replace(/\\([\\`*_{}\[\]()#+.!|>-])/g, '$1').replace(/[`*_~]/g, '').trim();
  const cells = row.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(unescape);
  if (cells.length < 4 || cells[0] !== '') return false;
  const fields = cells.slice(1);
  if (!fields.every((cell) => /^(?:[A-Za-z_][A-Za-z0-9_]*|\.{3}|…)$/.test(cell))) return false;
  const dataframeIdentifiers = new Set('restaurant_id attributes cuisine dogsallowed embedding awards metacritic rated fullplot'.split(/\s+/));
  return fields.some((cell) => dataframeIdentifiers.has(cell.toLowerCase()));
}

function isInsideFence(lines, at) {
  let fenceChar = '';
  let fenceLength = 0;
  for (let i = 0; i <= at; i += 1) {
    const fence = lines[i].match(/^\s{0,3}(`{3,}|~{3,})/);
    if (!fence) continue;
    if (!fenceChar) {
      fenceChar = fence[1][0];
      fenceLength = fence[1].length;
    } else if (fence[1][0] === fenceChar && fence[1].length >= fenceLength) {
      fenceChar = '';
      fenceLength = 0;
    }
  }
  return Boolean(fenceChar);
}

function containsFence(text) {
  return /(^|\n)\s{0,3}(`{3,}|~{3,})/.test(text);
}

function codeLikeBlock(text) {
  const rows = text.split(/\r?\n/).filter((line) => line.trim());
  if (!rows.length) return true;
  if (markdownTableHeaderRows(text).length) return false;
  const codeProbe = text.replace(/\\([\\`*_{}\[\]()#+.!|>-])/g, '$1');
  if (/^[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)+\/?$/.test(codeProbe.trim())) return true;
  const callOnly = rows.every((line) => /^(?:(?:print|display|pprint|console\.(?:log|info|warn|error)|logger\.(?:debug|info|warning|error))\s*\(.*\)\s*;?\s*)+$/i.test(line.replace(/\\([\\`*_{}\[\]()#+.!|>-])/g, '$1').trim()));
  if (callOnly) return true;
  const singleLineCode = rows.length === 1 ? rows[0].replace(/\\([\\`*_{}\[\]()#+.!|>-])/g, '$1').trim() : '';
  // Some notebook cells were flattened into one unfenced line containing several calls and an assignment.
  // Requiring multiple calls plus an assignment avoids treating prose that merely mentions one call as code.
  const flattenedCalls = singleLineCode.match(/\b[A-Za-z_$][A-Za-z0-9_$]*(?:\.[A-Za-z_$][A-Za-z0-9_$]*)*\s*\(/g) || [];
  const flattenedAssignments = singleLineCode.match(/\b[A-Za-z_$][A-Za-z0-9_$]*\s*(?<![=!<>])=(?![=>])\s*[^=]/g) || [];
  if (flattenedCalls.length >= 2 && flattenedAssignments.length >= 1 && /[{}()[\]=]/.test(singleLineCode)) return true;
  // Preserve old Markdown anchor definitions such as `(custom-node-postprocessor)=`.
  if (rows.length === 1 && /^\([A-Za-z0-9][A-Za-z0-9-]*\)=\s*$/.test(singleLineCode)) return true;
  if (rows.some((line) => /^\s*(?:>>>|\.\.\.|\$\s|In\s*\[\d*\]|Out\s*\[\d*\])/.test(line))) return true;
  if (rows.some((line) => {
    const heading = line.match(/^\s{0,3}#{1,6}\s+(.+)$/)?.[1];
    return (heading && /[=\\{};]/.test(heading)) || /^--?[a-z][a-z0-9-]*\d[a-z0-9-]*$/i.test(line.trim());
  })) return true;
  const assignments = [...codeProbe.matchAll(/(?:^|[\s,;])(?:--)?[A-Za-z_$][A-Za-z0-9_$-]*\s*(?<![=!<>])=(?![=>])\s*(?:"[^"\r\n]*"|'[^'\r\n]*'|“[^”\r\n]*”|[^\s,;]+)/gm)];
  if (assignments.length >= 2 || rows.some((line) => /^\s*(?:[-+*]\s+)?[A-Za-z_$][A-Za-z0-9_$-]*\s*(?<![=!<>])=(?![=>])/.test(line.replace(/\\([\\`*_{}\[\]()#+.!|>-])/g, '$1')))) return true;
  const controlFlowCode = rows.some((line) => {
    const normalized = line.replace(/\\([\\`*_{}\[\]()#+.!|>-])/g, '$1').trim();
    return /^(?:if|elif|for|while|with)\b.+:\s*(?:[A-Za-z_$][A-Za-z0-9_$.]*\s*\(|[A-Za-z_$][A-Za-z0-9_$]*\s*=)/i.test(normalized);
  });
  if (controlFlowCode) return true;
  const codeStart = /^(?:\s*)(?:import\s+\w|from\s+\S+\s+import\s|def\s+\w+\s*\(|class\s+\w+\s*[:({]|async\s+def\s+|(?:const|let|var)\s+\w+\s*=|function\s+\w+\s*\(|return\s+\w|SELECT\s+.+\s+FROM\s|\{\s*['"]?\w+['"]?\s*:)/i;
  if (rows.filter((line) => codeStart.test(line)).length >= Math.max(1, Math.ceil(rows.length * 0.4))) return true;
  const nonProseLines = rows.filter((line) => {
    const words = line.trim().split(/\s+/).length;
    const symbols = (line.match(/[{};=<>()[\]]/g) || []).length;
    return words <= 5 && symbols >= 3;
  });
  return nonProseLines.length >= Math.max(2, Math.ceil(rows.length * 0.6));
}

function createTokenStore() {
  const values = new Map();
  let next = 0;
  return {
    values,
    mask(value) {
      const token = `TRFIX${String(next++).padStart(5, '0')}END`;
      values.set(token, value);
      return token;
    },
  };
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function maskKnownTerms(text, store) {
  let output = text;
  const terms = [...new Set(TECH_TERMS)].sort((a, b) => b.length - a.length);
  for (const term of terms) {
    const pattern = new RegExp(`(?<![A-Za-z0-9_])${escapeRegExp(term)}(?![A-Za-z0-9_])`, 'gi');
    output = output.replace(pattern, (match) => store.mask(match));
  }
  return output;
}

function maskIdentifiers(text, store) {
  let output = text;
  const patterns = [
    /\b[A-Za-z_$][A-Za-z0-9_$]*(?:\.[A-Za-z_$][A-Za-z0-9_$]*)+\b/g,
    /\b[A-Za-z_$][A-Za-z0-9_$]*\s*(?=\()/g,
    /\b[A-Z]{2,}(?:[A-Z][a-z][A-Za-z0-9]*)+\b/g,
    /\b[A-Z]{2,}(?:_[A-Z0-9]+)*\b/g,
    /\b[A-Z]\d+[A-Za-z0-9]*\b/g,
    /\b[A-Za-z][A-Za-z0-9]*(?:-[A-Za-z0-9]+)*-\d+(?:\.\d+)?\b/g,
    /--[A-Za-z][A-Za-z0-9-]*/g,
    /\b[A-Za-z][A-Za-z0-9]*_[A-Za-z0-9_]+\b/g,
    /\b[a-z]+(?:[A-Z][A-Za-z0-9]*)+\b/g,
    /\b[A-Z][a-z0-9]+(?:[A-Z][A-Za-z0-9]+)+\b/g,
  ];
  for (const pattern of patterns) output = output.replace(pattern, (match) => store.mask(match));

  // Preserve title-case proper names in mid-sentence while leaving normal sentence openings translatable.
  output = output.replace(/\b[A-Z][a-zA-Z0-9]+(?:\s+[A-Z][a-zA-Z0-9]+){0,3}\b/g, (match, offset, whole) => {
    const first = match.split(/\s+/)[0].toLowerCase();
    const before = whole.slice(0, offset);
    const previousSentence = before.search(/[.!?](?:\s|$)[^.!?]*$/);
    const afterSentenceStart = previousSentence >= 0 ? before.slice(previousSentence).trim() : before.trim();
    const startsSentence = !afterSentenceStart || afterSentenceStart.length === 0;
    if (SENTENCE_START_WORDS.has(first) || ORDINARY_TITLECASE_WORDS.has(first) || startsSentence) return match;
    return store.mask(match);
  });
  return output;
}

function maskMarkdown(text, store = createTokenStore(), extraTerms = []) {
  let output = text;
  // Fenced code blocks remain byte-for-byte untouched and are never sent to the model.
  const lines = lineRecords(output);
  let open = -1;
  let openChar = '';
  let openLength = 0;
  const replacements = [];
  for (let i = 0; i < lines.length; i += 1) {
    const fence = lines[i].text.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (!fence) continue;
    if (open < 0) {
      open = lines[i].start;
      openChar = fence[1][0];
      openLength = fence[1].length;
    } else if (fence[1][0] === openChar && fence[1].length >= openLength) {
      replacements.push({ start: open, end: lines[i].end, value: store.mask(output.slice(open, lines[i].end)) });
      open = -1;
      openChar = '';
      openLength = 0;
    }
  }
  if (open >= 0) replacements.push({ start: open, end: output.length, value: store.mask(output.slice(open)) });
  for (const item of replacements.sort((a, b) => b.start - a.start)) output = `${output.slice(0, item.start)}${item.value}${output.slice(item.end)}`;

  output = output.replace(/<!--[\s\S]*?-->/g, (value) => store.mask(value));
  output = output.replace(/<(pre|code|kbd)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, (value) => store.mask(value));
  output = maskInlineCode(output, store);
  output = output.replace(/\$\$[\s\S]*?\$\$|(?<!\\)\$(?!\$)[^$\n]+(?<!\\)\$/g, (value) => store.mask(value));
  output = output.replace(/<\/?[A-Za-z][^>]*>/g, (value) => store.mask(value));
  output = output.replace(/&(?:#\d+|#x[0-9a-f]+|[A-Za-z][A-Za-z0-9]+);/gi, (value) => store.mask(value));

  // Keep link syntax and destinations exact, while allowing link labels to translate.
  output = output.replace(/(!?\[)([^\]\n]*)(\]\()([^)\n]*)(\))/g, (_whole, before, label, middle, destination, after) =>
    `${store.mask(before)}${label}${store.mask(middle)}${store.mask(destination)}${store.mask(after)}`);
  output = output.replace(/\]\(([^)\n]*)\)/g, (_whole, destination) => `${store.mask('](')}${store.mask(destination)}${store.mask(')')}`);
  output = output.replace(/^\s{0,3}\[[^\]\n]+\]:[^\n]*$/gm, (value) => store.mask(value));
  output = output.replace(/\b(?:https?|ftp|file):\/\/[^\s)\]>]+|\bmailto:[^\s)\]>]+/gi, (value) => store.mask(value));
  output = output.replace(/\bwww\.[A-Za-z0-9.-]+(?:\/[^\s)\]>]*)?/gi, (value) => store.mask(value));

  output = maskKnownTerms(output, store);
  if (extraTerms.length) {
    const terms = [...new Set(extraTerms)].sort((a, b) => b.length - a.length);
    for (const term of terms) {
      const pattern = new RegExp(`(?<![A-Za-z0-9_])${escapeRegExp(term)}(?![A-Za-z0-9_])`, 'gi');
      output = output.replace(pattern, (match) => store.mask(match));
    }
  }
  output = maskIdentifiers(output, store);

  // Keep Markdown layout and inline emphasis delimiters exactly as authored.
  output = output.replace(/^\s{0,3}#{1,6}\s+/gm, (value) => store.mask(value));
  output = output.replace(/^\s*(?:[-+*]|\d+[.)])\s+(?:\[[ xX]\]\s+)?/gm, (value) => store.mask(value));
  output = output.replace(/^(?:\s{0,3}>\s*)+/gm, (value) => store.mask(value));
  output = output.replace(/\|/g, (value) => store.mask(value));
  output = output.replace(/\*\*|__|~~|(?<!\*)\*(?!\*)|(?<!_)_(?!_)/g, (value) => store.mask(value));
  output = output.replace(/\\[\\`*_{}\[\]()#+.!|>-]/g, (value) => store.mask(value));
  output = output.replace(/\r?\n/g, (value) => store.mask(value));
  return { masked: output, store };
}

function maskInlineCode(text, store) {
  const replacements = [];
  const run = /`+/g;
  let opening;
  while ((opening = run.exec(text))) {
    const ticks = opening[0];
    const afterOpen = opening.index + ticks.length;
    const closingPattern = new RegExp('(?<!`)'+ escapeRegExp(ticks) + '(?!`)', 'g');
    closingPattern.lastIndex = afterOpen;
    const close = closingPattern.exec(text);
    if (!close) continue;
    const end = close.index + ticks.length;
    replacements.push({ start: opening.index, end, value: store.mask(text.slice(opening.index, end)) });
    run.lastIndex = end;
  }
  for (const replacement of replacements.sort((a, b) => b.start - a.start)) text = `${text.slice(0, replacement.start)}${replacement.value}${text.slice(replacement.end)}`;
  // Even unmatched backtick runs are syntax. Protect them so a model cannot add or remove one.
  return text.replace(/`+/g, (value) => store.mask(value));
}

function tokenSequence(text) {
  return [...text.matchAll(TOKEN_RE)].map((match) => match[0]);
}

function fenceBlocks(text) {
  const blocks = [];
  const lines = lineRecords(text);
  for (let i = 0; i < lines.length; i += 1) {
    const open = lines[i].text.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (!open) continue;
    let end = i + 1;
    while (end < lines.length && !new RegExp(`^\\s{0,3}${open[1][0]}{${open[1].length},}\\s*$`).test(lines[end].text)) end += 1;
    if (end >= lines.length) end = lines.length - 1;
    blocks.push(lines.slice(i, end + 1).map((line) => line.raw).join(''));
    i = end;
  }
  return blocks;
}

function inlineCodeArtifacts(text) {
  const result = [];
  const fences = fenceBlocks(text);
  let masked = text;
  for (const fence of fences) masked = masked.replace(fence, '\u0000'.repeat(fence.length));
  const run = /`+/g;
  let opening;
  while ((opening = run.exec(masked))) {
    const ticks = opening[0];
    const closing = new RegExp('(?<!`)'+ escapeRegExp(ticks) + '(?!`)', 'g');
    closing.lastIndex = opening.index + ticks.length;
    const close = closing.exec(masked);
    if (close) {
      const end = close.index + ticks.length;
      result.push(text.slice(opening.index, end));
      run.lastIndex = end;
    } else {
      result.push(ticks);
    }
  }
  return result;
}

function linkDestinations(text) {
  return [...text.matchAll(/\]\(([^)\n]*)\)/g)].map((match) => match[1]);
}

function allUrls(text) {
  return [...text.matchAll(/\b(?:https?|ftp|file):\/\/[^\s)\]>]+|\bmailto:[^\s)\]>]+|\bwww\.[A-Za-z0-9.-]+(?:\/[^\s)\]>]*)?/gi)].map((match) => match[0]);
}

function htmlTags(text) {
  return [...text.matchAll(/<\/?[A-Za-z][^>]*>/g)].map((match) => match[0]);
}

function markdownShape(text) {
  return text.split(/\r?\n/).map((line) => {
    const heading = line.match(/^\s{0,3}(#{1,6})\s+/)?.[1] || '';
    const list = line.match(/^\s*(?:([-+*])|(\d+[.)]))\s+/);
    const quote = (line.match(/^\s{0,3}(?:>\s*)+/)?.[0] || '').replace(/\s/g, '').length;
    const pipes = (line.match(/\|/g) || []).length;
    return { heading: heading.length, list: list?.[1] || list?.[2] || '', quote, pipes };
  });
}

function emphasisMarkers(text) {
  return [...text.matchAll(/\*\*|__|~~|(?<!\*)\*(?!\*)|(?<!_)_(?!_)/g)].map((match) => match[0]);
}

function preservesArtifacts(source, translated) {
  return JSON.stringify(fenceBlocks(source)) === JSON.stringify(fenceBlocks(translated)) &&
    JSON.stringify(inlineCodeArtifacts(source)) === JSON.stringify(inlineCodeArtifacts(translated)) &&
    JSON.stringify(linkDestinations(source)) === JSON.stringify(linkDestinations(translated)) &&
    JSON.stringify(allUrls(source)) === JSON.stringify(allUrls(translated)) &&
    JSON.stringify(htmlTags(source)) === JSON.stringify(htmlTags(translated)) &&
    JSON.stringify(emphasisMarkers(source)) === JSON.stringify(emphasisMarkers(translated)) &&
    JSON.stringify(markdownShape(source)) === JSON.stringify(markdownShape(translated)) &&
    (source.match(/\n/g) || []).length === (translated.match(/\n/g) || []).length;
}

function translatedResult(source, translated, store) {
  const restored = restoreTokens(translated, store);
  if (!preservesArtifacts(source, restored)) throw new Error('Translation changed code, URL, HTML, or Markdown structure.');
  return restored;
}

function isValidMaskedResponse(source, result) {
  const expected = tokenSequence(source);
  const actual = tokenSequence(result);
  return expected.length === actual.length && expected.every((token, index) => token === actual[index]);
}

function restoreTokens(text, store) {
  let output = text;
  for (const [token, value] of [...store.values.entries()].reverse()) {
    const count = output.split(token).length - 1;
    if (count !== 1) throw new Error(`Placeholder ${token} appeared ${count} times after translation.`);
    output = output.replace(token, value);
  }
  return output;
}

function visibleProse(text) {
  return text.replace(TOKEN_RE, ' ').replace(/\s+/g, ' ').trim();
}

function englishWordCount(text) {
  return (text.match(/[A-Za-z][A-Za-z'-]*/g) || []).length;
}

function isLongEnglish(text, { heading = false, title = false } = {}) {
  if (!text || HAN_RE.test(text)) return false;
  const words = englishWordCount(text);
  const letters = (text.match(/[A-Za-z]/g) || []).length;
  const minimum = title ? 2 : heading ? 5 : 8;
  if (words < minimum || letters < (title ? 8 : heading ? 28 : 42)) return false;
  const lower = text.toLowerCase().match(/[a-z]+/g) || [];
  const commonCount = lower.filter((word) => COMMON_ENGLISH.has(word)).length;
  return commonCount >= (title ? 0 : heading ? 1 : 2);
}

function isShortAlignedEnglish(text) {
  if (!text || hasHan(text)) return false;
  const words = text.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) || [];
  if (words.length < 2) return false;
  return words.some((word) => COMMON_ENGLISH.has(word) || ORDINARY_TITLECASE_WORDS.has(word));
}

function hasHan(text) {
  return HAN_RE.test(text);
}

function wordsForSimilarity(text) {
  const { masked } = maskMarkdown(text);
  return visibleProse(masked).toLowerCase().match(/[a-z0-9]+/g) || [];
}

function similarity(left, right) {
  const a = new Set(wordsForSimilarity(left));
  const b = new Set(wordsForSimilarity(right));
  if (!a.size || !b.size) return 0;
  let common = 0;
  for (const word of a) if (b.has(word)) common += 1;
  return common / Math.max(a.size, b.size);
}

function sourceBlockFor(targetBlock, targetIndex, sourceBlocks, used) {
  if (sourceBlocks[targetIndex] && !used.has(targetIndex)) {
    const score = similarity(targetBlock.text, sourceBlocks[targetIndex].text);
    if (score >= 0.34) { used.add(targetIndex); return { block: sourceBlocks[targetIndex], score }; }
  }
  let best = null;
  // Source and translated markdown preserve paragraph order. A narrow neighborhood handles
  // occasional split/merge differences without a quadratic scan of an entire page.
  const candidateIndices = [];
  for (let delta = 1; delta <= 4; delta += 1) candidateIndices.push(targetIndex - delta, targetIndex + delta);
  for (const i of candidateIndices) {
    if (i < 0 || i >= sourceBlocks.length) continue;
    if (used.has(i)) continue;
    const score = similarity(targetBlock.text, sourceBlocks[i].text);
    if (!best || score > best.score) best = { block: sourceBlocks[i], score, index: i };
  }
  if (best && best.score >= 0.34) { used.add(best.index); return best; }
  return { block: null, score: 0 };
}

function markdownHeadingLines(markdown) {
  const result = [];
  const lines = markdown.split(/\r?\n/);
  let inFence = false;
  let char = '';
  for (const line of lines) {
    const fence = line.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (fence) {
      if (!inFence) { inFence = true; char = fence[1][0]; }
      else if (fence[1][0] === char) inFence = false;
      continue;
    }
    if (inFence) continue;
    const heading = line.match(/^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (!heading) continue;
    const text = heading[2].replace(/\s+\{#[^}]+\}\s*$/, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[`*_~]/g, '').trim();
    result.push({ level: heading[1].length, text });
  }
  return result;
}

function plainSearchText(markdown) {
  return markdown
    .replace(/^---[\s\S]*?---\s*/m, '')
    .replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[>#*_~|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function shortPreview(text, max = 145) {
  const value = text.replace(/\s+/g, ' ').trim();
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

function knownLabelTranslation(text) {
  const match = text.match(/^(\s{0,3}(?:#{1,6}\s+|[-+*]\s+)?)((?:\*\*|__)?)([A-Za-z][A-Za-z0-9 _-]*?)(\*\*|__)?([:：]?)([ \t]*)(\r?\n?)$/);
  if (!match) return null;
  const translated = SHORT_LABELS.get(match[3].trim().toLowerCase());
  if (!translated) return null;
  return `${match[1]}${match[2]}${translated}${match[4] || ''}${match[5]}${match[6]}${match[7]}`;
}

function leadingShortLabelEdit(block) {
  const lead = block.text.match(/^\s{0,3}(?:#{1,6}\s+|[-+*]\s+)?(?:\*\*|__)?/)?.[0] || '';
  const rest = block.text.slice(lead.length);
  const labels = [...SHORT_LABELS.keys()].sort((a, b) => b.length - a.length);
  for (const label of labels) {
    const match = rest.match(new RegExp(`^(${escapeRegExp(label)})(?=(?:\\*\\*|__)?[:：](?:\\s|$)|(?:\\*\\*|__)(?:\\s|$))`, 'i'));
    if (!match) continue;
    const start = block.start + lead.length;
    return {
      start,
      end: start + match[1].length,
      text: match[1],
      direct: SHORT_LABELS.get(label),
    };
  }
  return null;
}

function shortHeadingCandidate(text) {
  const firstLine = text.split(/\r?\n/, 1)[0];
  if (!/^\s{0,3}#{1,6}\s+/.test(firstLine)) return false;
  const { masked } = maskMarkdown(text);
  const prose = visibleProse(masked);
  const words = englishWordCount(prose);
  return !hasHan(prose) && words >= 2 && words <= 6 && (prose.match(/[A-Za-z]/g) || []).length >= 8;
}

function ordinaryTitleWordCount(text) {
  const words = text.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) || [];
  return words.filter((word) => ORDINARY_TITLECASE_WORDS.has(word)).length;
}

function titleProperNameTerms(text) {
  const matches = text.match(/\b[A-Z][A-Za-z0-9]*(?:[-'][A-Z]?[A-Za-z0-9]+)*\b/g) || [];
  return [...new Set(matches.filter((word) => {
    const lower = word.toLowerCase();
    return !ORDINARY_TITLECASE_WORDS.has(lower) && !COMMON_ENGLISH.has(lower) && !SHORT_LABELS.has(lower);
  }))];
}

function isOrdinaryEnglishLinkLabel(label, extraTerms = []) {
  if (!label || hasHan(label) || inlineCodeArtifacts(label).length) return false;
  const unescaped = label.replace(/\\([\\`*_{}\[\]()#+.!|>-])/g, '$1');
  if (/[A-Za-z0-9_.-]+\.(?:py|md|json|ipynb|yaml|yml|toml|csv|txt|html|js|ts|jsx|tsx|sh|pdf|rst|xml|sql)\b/i.test(unescaped)) return false;
  const normalized = unescaped.replace(/[\*_~]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
  if (SHORT_LABELS.has(normalized)) return true;
  const { masked } = maskMarkdown(label, createTokenStore(), extraTerms);
  const prose = visibleProse(masked);
  const words = prose.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) || [];
  const ordinaryWords = words.filter((word) => ORDINARY_TITLECASE_WORDS.has(word));
  return words.length >= 2 && ordinaryWords.length >= 2 && (prose.match(/[A-Za-z]/g) || []).length >= 7;
}

function inlineCodeRanges(text, start, end) {
  const segment = text.slice(start, end);
  const ranges = [];
  const ticks = /`+/g;
  let opening = null;
  let match;
  while ((match = ticks.exec(segment))) {
    if (!opening) {
      opening = { index: match.index, length: match[0].length };
    } else if (match[0].length === opening.length) {
      const closeEnd = match.index + match[0].length;
      ranges.push({ start: start + opening.index, end: start + closeEnd });
      opening = null;
      ticks.lastIndex = closeEnd;
    }
  }
  return ranges;
}

function markdownCodeRanges(text) {
  const ranges = [];
  const lines = lineRecords(text);
  let opening = null;
  let outsideStart = 0;
  for (const line of lines) {
    const fence = line.text.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (!fence) continue;
    if (!opening) {
      ranges.push(...inlineCodeRanges(text, outsideStart, line.start));
      opening = { start: line.start, char: fence[1][0], length: fence[1].length };
    } else if (/^\s{0,3}(`{3,}|~{3,})\s*$/.test(line.text) && fence[1][0] === opening.char && fence[1].length >= opening.length) {
      ranges.push({ start: opening.start, end: line.end });
      opening = null;
      outsideStart = line.end;
    }
  }
  if (opening) ranges.push({ start: opening.start, end: text.length });
  else ranges.push(...inlineCodeRanges(text, outsideStart, text.length));
  for (const line of lines) {
    if (/^(?: {4}|\t)/.test(line.text)) ranges.push({ start: line.start, end: line.end });
  }
  for (const block of markdownBlocks(text)) {
    if (codeLikeBlock(block.text)) ranges.push({ start: block.start, end: block.end });
  }
  for (const match of text.matchAll(/<(pre|code|kbd)\b[^>]*>[\s\S]*?<\/\1\s*>/gi)) {
    ranges.push({ start: match.index, end: match.index + match[0].length });
  }
  ranges.push(...retrievalOutputRanges(text));
  return ranges;
}

function isInCodeRange(ranges, offset) {
  return ranges.some((range) => offset >= range.start && offset < range.end);
}

function destinationToken(value) {
  const trimmed = value.trim();
  const angle = trimmed.match(/^<([^>]*)>/);
  if (angle) return angle[1];
  return trimmed.match(/^(?:\\.|[^\s])+/)?.[0] || trimmed;
}

function canonicalDestination(value, baseUrl) {
  const destination = destinationToken(value);
  try {
    const url = new URL(destination, baseUrl || 'https://developers.llamaindex.ai/python/framework/');
    let pathname = url.pathname;
    if (url.hostname.toLowerCase() === 'developers.llamaindex.ai' && /^\/python\//i.test(pathname)) {
      if (/\.md$/i.test(pathname)) pathname = pathname.replace(/\.md$/i, '');
      if (/\/index\/?$/i.test(pathname)) pathname = pathname.replace(/\/index\/?$/i, '/');
      if (pathname !== '/' && !pathname.endsWith('/')) pathname += '/';
    }
    return `${url.protocol.toLowerCase()}//${url.host.toLowerCase()}${pathname}${url.search}${url.hash}`;
  } catch {
    return `raw:${destination}`;
  }
}

function markdownLinks(markdown, baseUrl) {
  const codeRanges = markdownCodeRanges(markdown);
  const links = [];
  const pattern = /(?<!!)\[([^\]\n]+)\]\((<[^>\n]*>|[^)\n]*)\)/g;
  for (const match of markdown.matchAll(pattern)) {
    const labelStart = match.index + 1;
    if (isInCodeRange(codeRanges, labelStart)) continue;
    const label = match[1];
    const destination = match[2];
    links.push({
      label,
      labelStart,
      labelEnd: labelStart + label.length,
      destination: canonicalDestination(destination, baseUrl),
    });
  }
  return links;
}

function candidateLinkLabels(page, existingCandidates) {
  const sourceLinks = markdownLinks(page.sourceBody, page.page.sourceUrl);
  const targetLinks = markdownLinks(page.page.markdown, page.page.sourceUrl);
  const productExtraTerms = titleProperNameTerms(page.page.sourceTitle || page.sourceMetadata.title || page.page.title || '');
  const byDestination = new Map();
  for (const link of sourceLinks) {
    if (!isOrdinaryEnglishLinkLabel(link.label, productExtraTerms)) continue;
    const entries = byDestination.get(link.destination) || [];
    entries.push(link);
    byDestination.set(link.destination, entries);
  }

  const candidates = [];
  for (const target of targetLinks) {
    if (hasHan(target.label) || !isOrdinaryEnglishLinkLabel(target.label, productExtraTerms)) continue;
    const matching = byDestination.get(target.destination) || [];
    let best = null;
    for (const source of matching) {
      const score = similarity(target.label, source.label);
      const exact = target.label.replace(/\s+/g, ' ').trim().toLowerCase() === source.label.replace(/\s+/g, ' ').trim().toLowerCase();
      if (!exact && score < 0.6) continue;
      if (!best || (exact && !best.exact) || (exact === best.exact && score > best.score)) best = { source, score, exact };
    }
    if (!best) continue;
    if (existingCandidates.some((candidate) => target.labelStart >= candidate.start && target.labelEnd <= candidate.end)) continue;
    const normalized = target.label.replace(/[\*_~]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
    const shortTranslation = SHORT_LABELS.get(normalized);
    const leading = target.label.match(/^(\s*)/)?.[1] || '';
    const trailing = target.label.match(/\s*$/)?.[0] || '';
      const direct = knownLabelTranslation(target.label)
        || (shortTranslation && !/[\*_~]/.test(target.label) ? `${leading}${shortTranslation}${trailing}` : null);
    candidates.push({
      start: target.labelStart,
      end: target.labelEnd,
      text: target.label,
      lineNumber: page.page.markdown.slice(0, target.labelStart).split(/\r?\n/).length,
      prose: target.label,
      source: best.source.label,
      kind: 'link label',
      direct,
      extraTerms: productExtraTerms,
    });
  }
  return candidates;
}

function candidateParagraphs(page) {
  const targetBlocks = markdownBlocks(page.page.markdown);
  const sourceBlocks = markdownBlocks(page.sourceBody);
  const targetCodeRanges = markdownCodeRanges(page.page.markdown);
  const sourceCodeRanges = markdownCodeRanges(page.sourceBody);
  const used = new Set();
  const candidates = [];
  const allLines = page.page.markdown.split(/\r?\n/);
  for (let i = 0; i < targetBlocks.length; i += 1) {
    const block = targetBlocks[i];
    if (isInCodeRange(targetCodeRanges, block.start)) continue;
    if (containsFence(block.text) || codeLikeBlock(block.text)) continue;
    const matched = sourceBlockFor(block, i, sourceBlocks, used);
    const sourceBlock = matched.block || sourceBlocks[i];
    if (!sourceBlock) continue;
    if (isInCodeRange(sourceCodeRanges, sourceBlock.start)) continue;
    if (containsFence(sourceBlock.text) || codeLikeBlock(sourceBlock.text)) continue;

    const targetHeaders = markdownTableHeaderRows(block.text);
    const sourceHeaders = markdownTableHeaderRows(sourceBlock.text);
    if (targetHeaders.length || sourceHeaders.length) {
      if (!targetHeaders.length || !sourceHeaders.length || matched.score < 0.55) continue;
      for (let headerIndex = 0; headerIndex < Math.min(targetHeaders.length, sourceHeaders.length); headerIndex += 1) {
        const targetHeader = targetHeaders[headerIndex];
        const sourceHeader = sourceHeaders[headerIndex];
        if (isDataFrameFieldHeader(targetHeader.text) || isDataFrameFieldHeader(sourceHeader.text)) continue;
        if (hasHan(targetHeader.text) || hasHan(sourceHeader.text)) continue;
        if (similarity(targetHeader.text, sourceHeader.text) < 0.55 || !isTranslatableTableHeader(targetHeader.text)) continue;
        const start = block.start + targetHeader.start;
        const end = block.start + targetHeader.end;
        const lineNumber = page.page.markdown.slice(0, start).split(/\r?\n/).length;
        candidates.push({
          start,
          end,
          text: targetHeader.raw,
          lineNumber,
          prose: targetHeader.text,
          source: sourceHeader.text,
          kind: 'table header',
        });
      }
      continue;
    }

    const { masked } = maskMarkdown(block.text);
    const prose = visibleProse(masked);
    const firstLine = block.text.split(/\r?\n/, 1)[0];
    const isHeading = /^\s{0,3}#{1,6}\s+/.test(firstLine);
    if (matched.score < 0.55) continue;
    const sourcePlain = visibleProse(maskMarkdown(sourceBlock.text).masked);
    const sourceScore = matched.block === sourceBlock ? matched.score : similarity(block.text, sourceBlock.text);
    const noHan = !hasHan(prose);
    const strongSourceMatch = sourceScore >= 0.55;
    const longFallback = strongSourceMatch && noHan && isLongEnglish(prose, { heading: isHeading }) && isLongEnglish(sourcePlain, { heading: isHeading });
    const shortAlignedFallback = strongSourceMatch && noHan && isShortAlignedEnglish(prose) && isShortAlignedEnglish(sourcePlain);
    const shortHeading = strongSourceMatch && noHan && isHeading && shortHeadingCandidate(block.text) && shortHeadingCandidate(sourceBlock.text);
    const direct = strongSourceMatch && noHan ? knownLabelTranslation(block.text) : null;
    const lineNumber = page.page.markdown.slice(0, block.start).split(/\r?\n/).length;
    if (isInsideFence(allLines, lineNumber - 1)) continue;
    if (direct) {
      candidates.push({ ...block, lineNumber, prose, source: sourceBlock.text, kind: 'label', direct });
      continue;
    }
    const leadingLabel = leadingShortLabelEdit(block);
    const sourceHasLabel = leadingLabel && new RegExp(`\\b${escapeRegExp(leadingLabel.text)}\\b`, 'i').test(sourceBlock.text);
    if (leadingLabel && sourceHasLabel && hasHan(prose)) {
      candidates.push({ ...leadingLabel, lineNumber, prose: leadingLabel.text, source: sourceBlock.text, kind: 'label' });
      continue;
    }
    if (longFallback || shortAlignedFallback || shortHeading) {
      candidates.push({ ...block, lineNumber, prose, source: sourceBlock.text, kind: isHeading ? 'heading' : 'paragraph' });
      continue;
    }

  }
  candidates.push(...candidateLinkLabels(page, candidates));
  return candidates;
}

function metadataCandidate(value, { title = false } = {}) {
  if (!value || hasHan(value)) return false;
  const properTerms = title ? titleProperNameTerms(value) : [];
  const { masked } = maskMarkdown(value, createTokenStore(), properTerms);
  const prose = visibleProse(masked);
  if (!prose || !/[A-Za-z]/.test(prose)) return false;
  if (title) {
    const normalized = value.replace(/[\*_~]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
    if (SHORT_LABELS.has(normalized)) return true;
    const words = englishWordCount(prose);
    return words >= 2 && words <= 12 && ordinaryTitleWordCount(prose) >= 2 &&
      (prose.match(/[A-Za-z]/g) || []).length >= 7;
  }
  return isLongEnglish(prose);
}

function pageCandidates(page) {
  const paragraphs = candidateParagraphs(page);
  const sourceTitle = (page.page.sourceTitle || page.sourceMetadata.title || '')
    .replace(/\s*\|\s*Developer Documentation.*$/i, '')
    .replace(/,\s*by the makers of LlamaParse$/i, '')
    .trim();
  const currentTitle = page.page.title || sourceTitle;
  const title = metadataCandidate(currentTitle, { title: true }) && (!page.page.title || similarity(currentTitle, sourceTitle) >= 0.5)
    ? { kind: 'title', text: currentTitle }
    : null;
  const sourceDescription = page.sourceMetadata.description || page.page.description || '';
  const currentDescription = page.page.description || sourceDescription;
  const description = metadataCandidate(currentDescription) && (!page.page.description || similarity(currentDescription, sourceDescription) >= 0.5)
    ? { kind: 'description', text: currentDescription }
    : null;
  return { paragraphs, title, description };
}

function cachePath() {
  const identity = createHash('sha256').update(ROOT).digest('hex').slice(0, 16);
  return path.join(os.tmpdir(), `llamaindex-zh-tw-repair-${identity}.json`);
}

async function readCache() {
  try {
    const parsed = JSON.parse(await readFile(cachePath(), 'utf8'));
    if (parsed.version === CACHE_VERSION && parsed.entries && typeof parsed.entries === 'object') return parsed;
  } catch {}
  return { version: CACHE_VERSION, entries: {} };
}

async function writeCache(cache) {
  cacheWriteQueue = cacheWriteQueue.then(() => atomicWrite(cachePath(), JSON.stringify(cache), 'utf8'));
  await cacheWriteQueue;
}

async function atomicWrite(file, data, encoding) {
  await mkdir(path.dirname(file), { recursive: true });
  const temp = `${file}.repair-${process.pid}-${Date.now()}.tmp`;
  await writeFile(temp, data, encoding);
  await rename(temp, file);
}

function cacheKey(kind, input, context) {
  return createHash('sha256').update(`${CACHE_VERSION}\0${MODEL}\0${kind}\0${context}\0${input}`).digest('hex');
}

async function ollama(text, context) {
  if (!text.trim()) return text;
  const prompt = `${SYSTEM_PROMPT}\n\nContext: ${context}.\nTranslate the following text into Traditional Chinese (Taiwan):\n${text}`;
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          model: MODEL,
          prompt,
          stream: false,
          think: false,
          options: { temperature: 0.1, num_ctx: 8192, num_predict: 4096 },
        }),
        signal: AbortSignal.timeout(180000),
      });
      if (!response.ok) throw new Error(`Ollama ${response.status}: ${await response.text()}`);
      const data = await response.json();
      if (typeof data.response !== 'string' || !data.response.trim()) throw new Error('Ollama returned an empty translation.');
      return data.response.trim();
    } catch (error) {
      lastError = error;
      if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 700 * (attempt + 1)));
    }
  }
  throw lastError;
}

function remainsLongEnglish(maskedText) {
  const prose = visibleProse(maskedText);
  return !hasHan(prose) && isLongEnglish(prose);
}

function remainsOrdinaryEnglish(maskedText) {
  const prose = visibleProse(maskedText);
  const runs = prose.split(/\p{Script=Han}+/u).map((run) => run.trim()).filter(Boolean);
  return runs.some((run) => {
    const words = englishWordCount(run);
    const letters = (run.match(/[A-Za-z]/g) || []).length;
      const ordinary = (run.toLowerCase().match(/[a-z]+/g) || []).some((word) => COMMON_ENGLISH.has(word));
      return isLongEnglish(run) || (words >= 2 && letters >= 7 && ordinary);
  });
}

function splitDeterministically(text, maxWords) {
  const pieces = [];
  let current = '';
  let words = 0;
  for (const match of text.matchAll(/\s+|\S+/g)) {
    const token = match[0];
    if (/^\s+$/.test(token)) {
      current += token;
      continue;
    }
    const punctuation = /^[.!?;:]+$/.test(token);
    if (!punctuation && words >= maxWords && current.trim()) {
      pieces.push(current);
      current = '';
      words = 0;
    }
    current += token;
    if (!punctuation && /[A-Za-z]/.test(token)) words += 1;
  }
  if (current) pieces.push(current);
  if (pieces.length < 2) {
    const boundary = text.lastIndexOf(' ', Math.floor(text.length / 2));
    if (boundary > 0 && boundary < text.length - 1) return [text.slice(0, boundary + 1), text.slice(boundary + 1)];
  }
  return pieces;
}

function splitSentences(text) {
  const result = [];
  const regex = /[.!?;:]+(?:\s+|$)/g;
  let cursor = 0;
  for (const match of text.matchAll(regex)) {
    const end = match.index + match[0].length;
    if (end > cursor) result.push(text.slice(cursor, end));
    cursor = end;
  }
  if (cursor < text.length) result.push(text.slice(cursor));
  return result;
}

async function translatePiece(piece, context, cache) {
  const trimmed = piece.trim();
  if (!trimmed || !/[A-Za-z]/.test(trimmed)) return piece;
  const leading = piece.match(/^\s*/)?.[0] || '';
  const trailing = piece.match(/\s*$/)?.[0] || '';
  const core = piece.slice(leading.length, piece.length - trailing.length || undefined);
  if (!core) return piece;
  const key = cacheKey('piece', core, context);
  if (typeof cache.entries[key] === 'string' && !TOKEN_RE.test(cache.entries[key]) && preservesArtifacts(core, cache.entries[key]) && !remainsOrdinaryEnglish(cache.entries[key])) {
    TOKEN_RE.lastIndex = 0;
    return `${leading}${cache.entries[key]}${trailing}`;
  }
  TOKEN_RE.lastIndex = 0;

  if (core.length > 1800) {
    const sentenceParts = splitSentences(core);
    const pieces = sentenceParts.length > 1 ? sentenceParts : splitDeterministically(core, 100);
    if (pieces.length < 2) throw new Error('Unable to split oversized prose deterministically.');
    let assembled = '';
    for (const part of pieces) assembled += await translatePiece(part, context, cache);
    cache.entries[key] = assembled;
    await writeCache(cache);
    return `${leading}${assembled}${trailing}`;
  }

  let translated = await ollama(core, context);
  if (TOKEN_RE.test(translated)) throw new Error('Model emitted a reserved repair token in plain prose.');
  TOKEN_RE.lastIndex = 0;
  if (!preservesArtifacts(core, translated)) {
    translated = await ollama(core, `${context}. Copy inline code, links, URLs, HTML, and Markdown punctuation exactly; do not add backticks.`);
    if (TOKEN_RE.test(translated) || !preservesArtifacts(core, translated)) throw new Error('Model changed protected syntax in a prose fragment.');
    TOKEN_RE.lastIndex = 0;
  }
  if (remainsOrdinaryEnglish(translated)) {
    const sentences = splitSentences(core).filter((part) => part.trim());
    if (sentences.length > 1) {
      translated = '';
      for (const sentence of sentences) translated += await translatePiece(sentence, context, cache);
    } else {
      const parts = splitDeterministically(core, 10);
      if (parts.length > 1 && parts.some((part) => part.trim() !== core.trim())) {
        translated = '';
        for (const part of parts) translated += await translatePiece(part, context, cache);
      } else if (englishWordCount(core) > 6) {
        const smaller = splitDeterministically(core, 6);
        if (smaller.length > 1) {
          translated = '';
          for (const part of smaller) translated += await translatePiece(part, context, cache);
        }
      } else if (englishWordCount(core) >= 2) {
        translated = await ollama(core, `${context}. This is an ordinary English prose fragment or link label; translate it into Traditional Chinese instead of repeating the English.`);
        if (TOKEN_RE.test(translated) || !preservesArtifacts(core, translated)) throw new Error('Model changed protected syntax in a short prose fragment.');
        TOKEN_RE.lastIndex = 0;
        if (remainsOrdinaryEnglish(translated)) throw new Error('Model left an ordinary short English fragment untranslated.');
      }
    }
  }
  cache.entries[key] = translated;
  await writeCache(cache);
  return `${leading}${translated}${trailing}`;
}

async function fallbackByTokens(masked, context, cache) {
  const items = masked.split(/(TRFIX\d{5}END)/g);
  let output = '';
  for (const item of items) {
    if (/^TRFIX\d{5}END$/.test(item)) {
      output += item;
      continue;
    }
    if (!/[A-Za-z]/.test(item)) { output += item; continue; }
    const sentences = splitSentences(item);
    for (const sentence of sentences) output += await translatePiece(sentence, context, cache);
  }
  return output;
}

async function translateProtected(input, context, cache, requireHan = false, extraTerms = []) {
  const { masked, store } = maskMarkdown(input, createTokenStore(), extraTerms);
  const cacheContext = extraTerms.length ? `${context}\0${JSON.stringify(extraTerms)}` : context;
  const fullKey = cacheKey('protected', masked, cacheContext);
  if (typeof cache.entries[fullKey] === 'string') {
    const cached = cache.entries[fullKey];
    if (isValidMaskedResponse(masked, cached) && !remainsOrdinaryEnglish(cached) && (!requireHan || hasHan(visibleProse(cached)))) {
      try { return translatedResult(input, cached, store); } catch {}
    }
  }

  let translated = '';
  if (masked.length <= 3500) {
    try { translated = await ollama(masked, context); } catch (error) {
      console.warn(`  primary translation request failed; splitting protected prose: ${error.message}`);
    }
  }
  if (translated && isValidMaskedResponse(masked, translated) && !remainsOrdinaryEnglish(translated) && (!requireHan || hasHan(visibleProse(translated)))) {
    try {
      const output = translatedResult(input, translated, store);
      cache.entries[fullKey] = translated;
      await writeCache(cache);
      return output;
    } catch {}
  }

  // Never fall back to the full English paragraph. Keep every opaque structure token fixed,
  // then translate each prose piece; long failures are recursively split at deterministic boundaries.
  translated = await fallbackByTokens(masked, context, cache);
  if (!isValidMaskedResponse(masked, translated)) throw new Error('Token-split fallback changed protected structure.');
  if (remainsOrdinaryEnglish(translated)) throw new Error('Token-split fallback left untranslated English prose; page was not written.');
  if (requireHan && !hasHan(visibleProse(translated))) throw new Error('Token-split fallback left a short English label untranslated; page was not written.');
  cache.entries[fullKey] = translated;
  await writeCache(cache);
  return translatedResult(input, translated, store);
}

function fallbackDescriptionIsSource(page, target, source) {
  if (hasHan(target) || !source) return false;
  if (!target) return true;
  return similarity(target, source) >= 0.5;
}

async function repairPage(entry, cache, existingPlan = null) {
  const { page, route, sourceBody, sourceMetadata } = entry;
  const plan = existingPlan || pageCandidates(entry);
  if (!plan.paragraphs.length && !plan.title && !plan.description) return { changed: false, page };
  if (JSON.stringify(fenceBlocks(sourceBody)) !== JSON.stringify(fenceBlocks(page.markdown))) {
    throw new Error('Source and page JSON fenced code differ; refusing to repair this page.');
  }

  let markdown = page.markdown;
  const changes = [];
  for (const candidate of plan.paragraphs) {
      let translated;
      try {
        translated = candidate.direct || await translateProtected(candidate.text, `Markdown ${candidate.kind} on ${route}`, cache, true, candidate.extraTerms || []);
      } catch (error) {
        throw new Error(`L${candidate.lineNumber} ${candidate.kind}: ${shortPreview(candidate.text)} — ${error.message}`);
      }
    changes.push({ start: candidate.start, end: candidate.end, value: translated });
  }
  for (const change of changes.sort((a, b) => b.start - a.start)) {
    markdown = `${markdown.slice(0, change.start)}${change.value}${markdown.slice(change.end)}`;
  }
  if (JSON.stringify(fenceBlocks(sourceBody)) !== JSON.stringify(fenceBlocks(markdown))) {
    throw new Error('Repair changed fenced code relative to source; page was not written.');
  }

  const titleSource = (page.sourceTitle || sourceMetadata.title || page.title || '')
    .replace(/\s*\|\s*Developer Documentation.*$/i, '')
    .replace(/,\s*by the makers of LlamaParse$/i, '')
    .trim();
  let title = page.title || titleSource;
  if (plan.title && fallbackDescriptionIsSource(page, title, titleSource)) {
    title = await translateProtected(titleSource, `page title on ${route}`, cache, true, titleProperNameTerms(titleSource));
  }
  let description = page.description || '';
  const sourceDescription = sourceMetadata.description || page.description || '';
  if (plan.description && fallbackDescriptionIsSource(page, description, sourceDescription)) {
    description = await translateProtected(sourceDescription, `page description on ${route}`, cache, true);
  }

  const oldHeadings = Array.isArray(page.headings) ? page.headings : [];
  const newHeadingTexts = markdownHeadingLines(markdown);
  const headings = oldHeadings.map((heading, index) => ({
    ...heading,
    text: newHeadingTexts[index]?.text ?? heading.text,
  }));
  const updated = { ...page, title, description, markdown, headings };
  const sourceHash = createHash('sha256').update(sourceBody).digest('hex');
  const zhPath = translatedSourcePathForRoute(route);
  const zhMarkdown = `---\ntitle: ${JSON.stringify(title)}\n${description ? `description: ${JSON.stringify(description)}\n` : ''}---\n\n${markdown}`;
  await atomicWrite(entry.file, JSON.stringify(updated), 'utf8');
  await atomicWrite(zhPath, zhMarkdown, 'utf8');
  console.log(`  repaired ${route} (${plan.paragraphs.length} paragraphs${plan.title ? ', title' : ''}${plan.description ? ', description' : ''}; source ${sourceHash.slice(0, 12)})`);
  return { changed: true, page: updated, sourceBody };
}

async function updateCompleteIndexes(changedPages) {
  const manifestPath = path.join(ROOT, 'public', 'content', 'manifest.json');
  const searchPath = path.join(ROOT, 'public', 'content', 'search-index.json');
  let manifest;
  let search;
  try {
    [manifest, search] = await Promise.all([
      readFile(manifestPath, 'utf8').then(JSON.parse),
      readFile(searchPath, 'utf8').then(JSON.parse),
    ]);
  } catch {
    console.log('  manifest/search-index update skipped: a complete pair is unavailable.');
    return;
  }
  if (!Array.isArray(manifest.pages) || manifest.pageCount !== manifest.pages.length || !Array.isArray(search)) {
    console.log('  manifest/search-index update skipped: manifest is not complete.');
    return;
  }
  const routes = new Set(manifest.pages.map((item) => item.route));
  const searchRoutes = new Set(search.map((item) => item.route));
  if (routes.size !== manifest.pages.length || searchRoutes.size !== search.length || routes.size !== searchRoutes.size || [...routes].some((route) => !searchRoutes.has(route))) {
    console.log('  manifest/search-index update skipped: route sets do not match.');
    return;
  }
  const loaded = new Map();
  for (const item of manifest.pages) {
    const contentFile = contentPathForRoute(item.route);
    const sourceFile = sourcePathForRoute(item.route);
    try {
      const [page, source] = await Promise.all([
        readFile(contentFile, 'utf8').then(JSON.parse),
        readFile(sourceFile, 'utf8'),
      ]);
      if (page.route !== item.route || typeof page.markdown !== 'string') throw new Error('route mismatch');
      loaded.set(item.route, { page, sourceBody: parseFrontmatter(source).body });
    } catch {
      console.log('  manifest/search-index update skipped: one or more manifest pages are missing.');
      return;
    }
  }

  const nextManifest = {
    ...manifest,
    pages: manifest.pages.map((item) => {
      const page = loaded.get(item.route).page;
      return { ...item, title: page.title, description: page.description || '', sourceTitle: page.sourceTitle };
    }),
  };
  const nextSearch = search.map((item) => {
    const { page, sourceBody } = loaded.get(item.route);
    const text = plainSearchText(page.markdown);
    return {
      ...item,
      title: page.title,
      sourceTitle: page.sourceTitle,
      text,
      sourceText: plainSearchText(sourceBody),
      snippet: text.slice(0, 220),
    };
  });
  await atomicWrite(manifestPath, JSON.stringify(nextManifest), 'utf8');
  await atomicWrite(searchPath, JSON.stringify(nextSearch), 'utf8');
  console.log('  refreshed manifest and search index from the complete page set.');
}

function reportDryRun(entries) {
  let total = 0;
  let pagesWithCandidates = 0;
  for (const { entry, candidates } of entries.map((entry) => ({ entry, candidates: pageCandidates(entry) }))) {
    const count = candidates.paragraphs.length + Number(Boolean(candidates.title)) + Number(Boolean(candidates.description));
    if (!count) continue;
    total += count;
    pagesWithCandidates += 1;
    console.log(`${entry.route}  ${count} candidates (${candidates.paragraphs.length} paragraphs${candidates.title ? ', title' : ''}${candidates.description ? ', description' : ''})`);
    if (candidates.title) console.log(`  title: ${shortPreview(candidates.title.text)}`);
    if (candidates.description) console.log(`  description: ${shortPreview(candidates.description.text)}`);
    for (const candidate of candidates.paragraphs) console.log(`  L${candidate.lineNumber} ${candidate.kind}: ${shortPreview(candidate.text)}`);
  }
  console.log(`Dry run: ${total} candidates across ${pagesWithCandidates} pages. No model calls or files written.`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) { printHelp(); return; }
  if (args.route) args.route = cleanRoute(args.route);
  const all = await loadPages();
  const excluded = new Set(args.exclude);
  const selected = all.filter((entry) => (!args.route || entry.route === args.route) && !excluded.has(entry.route));
  if (args.route && !selected.length) throw new Error(`No page JSON with a matching source/en Markdown file for ${args.route}.`);
  if (args.dryRun) {
    console.log(`Read ${selected.length} pages with matching English sources. Model: ${MODEL} (not called).`);
    reportDryRun(selected);
    return;
  }

  const cache = await readCache();
  const changed = [];
  console.log(`Repairing ${args.route ? 'one route' : `${selected.length} routes`} with Ollama model ${MODEL}; ${REPAIR_CONCURRENCY} workers.`);
  let nextIndex = 0;
  const failures = [];
  await Promise.all(Array.from({ length: Math.min(REPAIR_CONCURRENCY, selected.length) }, async () => {
    while (nextIndex < selected.length) {
      const entry = selected[nextIndex++];
      const plan = pageCandidates(entry);
      if (!plan.paragraphs.length && !plan.title && !plan.description) continue;
      try {
        const result = await repairPage(entry, cache, plan);
        if (result.changed) changed.push(result);
      } catch (error) {
        console.error(`  failed ${entry.route}: ${error.message}`);
        failures.push({ route: entry.route, error: error.message });
        process.exitCode = 1;
      }
    }
  }));
  if (changed.length) await updateCompleteIndexes(changed);
  await writeFile(path.join(ROOT, 'translation-repair-report.json'), JSON.stringify({ model: MODEL,
    checkedPages: selected.length, repairedPages: changed.map((item) => item.page?.route || item.route), failures }, null, 2));
  console.log(`Done: repaired ${changed.length} pages. Restart-safe cache: ${cachePath()}`);
}

export { loadPages, markdownBlocks, markdownCodeRanges, codeLikeBlock, maskMarkdown, visibleProse, isLongEnglish, ordinaryTitleWordCount };
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((error) => {
  console.error(error.message || error);
  if (process.exitCode !== 1) process.exitCode = 1;
});
