import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import { ROOT, DOCS_ROOT, filesIn, sourceBody, rebuildCatalog } from './catalog.mjs';

const ORIGIN = 'https://developers.llamaindex.ai';
const SOURCE_ROOT = path.join(ROOT, 'source/en');
const OUTPUT_ROOT = path.join(ROOT, 'public/content/pages');
const parser = unified().use(remarkParse).use(remarkGfm);
const args = new Set(process.argv.slice(2));
const mode = args.has('--write') ? 'write' : 'dry-run';
const DROP_STALE_ANCHORS = args.has('--drop-stale-anchors');

if (args.has('--help') || args.has('-h')) {
  console.log('Usage: node scripts/normalize-links.mjs [--dry-run | --write] [--drop-stale-anchors]');
  console.log('--dry-run (default) reports proposed link and anchor changes without writing files.');
  console.log('--write requires a complete, current generated page set and rebuilds source/zh-TW and the catalog.');
  console.log('--drop-stale-anchors removes fragments absent from in-scope English source headings and HTML anchors.');
  process.exit(0);
}
if (args.has('--write') && args.has('--dry-run')) throw new Error('Choose either --dry-run or --write.');
for (const arg of args) if (!['--write', '--dry-run', '--drop-stale-anchors'].includes(arg)) throw new Error(`Unknown option: ${arg}`);

const VECTOR_STORE_GUIDE = `${DOCS_ROOT}module_guides/indexing/vector_store_guide/`;
const VECTOR_STORE_INDEX = `${DOCS_ROOT}module_guides/indexing/vector_store_index/`;
const MISPLACED_WORKFLOW = `${DOCS_ROOT}llamaagents/workflows/`;
const WORKFLOW_UPSTREAM_PATH = '/python/llamaagents/workflows/';

function idFromFile(filename, base, extension) {
  return path.relative(base, filename).replaceAll('\\', '/').replace(new RegExp(`${extension.replace('.', '\\.')}$`), '');
}

function routeFromId(id) {
  const relative = id.replace(/(^|\/)index$/, '');
  return `${DOCS_ROOT}${relative ? `${relative}/` : ''}`;
}

function canonicalDocPath(pathname) {
  let result = pathname.replace(/\/index\.md$/i, '/').replace(/\.md$/i, '/');
  if (!result.endsWith('/')) result += '/';
  return result;
}

function sourceRouteForPath(pathname) {
  return canonicalDocPath(pathname);
}

function safeDecode(value) {
  try { return decodeURIComponent(value); } catch { return value; }
}

function stripIndexSuffix(fragment) {
  return safeDecode(fragment).replace(/\/index\.md$/i, '');
}

function collapseHyphens(fragment) {
  return fragment.replace(/-{2,}/g, '-');
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

// Keep in step with sync-docs.mjs: heading IDs come from the English source,
// while the page renderer applies them to translated headings by position.
function sourceHeadingIds(markdown) {
  const ids = [];
  const used = new Map();
  let fenceChar = '';
  let fenceLength = 0;
  for (const line of markdown.replaceAll('\r\n', '\n').split('\n')) {
    const fence = line.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (fence) {
      if (!fenceChar) {
        fenceChar = fence[1][0];
        fenceLength = fence[1].length;
      } else if (fence[1][0] === fenceChar && fence[1].length >= fenceLength) {
        fenceChar = '';
        fenceLength = 0;
      }
      continue;
    }
    if (fenceChar) continue;
    const heading = line.match(/^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$/);
    if (!heading) continue;
    const explicit = heading[1].match(/\{#([^}]+)\}/)?.[1];
    const text = heading[1].replace(/\s+\{#[^}]+\}\s*$/, '').trim();
    const base = explicit || slugId(text) || `section-${ids.length + 1}`;
    const count = used.get(base) || 0;
    used.set(base, count + 1);
    ids.push(count ? `${base}-${count}` : base);
  }
  return ids;
}

function sourceAnchorIds(markdown) {
  const ids = new Set(sourceHeadingIds(markdown));
  const tree = parser.parse(markdown);
  visit(tree, 'html', (node) => {
    for (const match of node.value.matchAll(/\b(?:id|name)\s*=\s*(["'])(.*?)\1/gi)) ids.add(match[2]);
  });
  return [...ids];
}

function closingBracket(text, openAt) {
  let depth = 0;
  for (let i = openAt; i < text.length; i += 1) {
    if (text[i] === '\\') { i += 1; continue; }
    if (text[i] === '`') {
      let end = i;
      while (text[end] === '`') end += 1;
      const ticks = text.slice(i, end);
      let close = end;
      while (close < text.length) {
        if (text[close] === '`') {
          let closeEnd = close;
          while (text[closeEnd] === '`') closeEnd += 1;
          if (text.slice(close, closeEnd) === ticks) break;
          close = closeEnd;
        } else close += 1;
      }
      i = close < text.length ? close + ticks.length - 1 : end - 1;
      continue;
    }
    if (text[i] === '[') depth += 1;
    if (text[i] === ']') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function destinationInParenthesizedLink(segment) {
  if (!segment.startsWith('[')) return null;
  const closeLabel = closingBracket(segment, 0);
  if (closeLabel < 0) return null;
  let cursor = closeLabel + 1;
  while (/\s/.test(segment[cursor] || '')) cursor += 1;
  if (segment[cursor] !== '(') return null;
  cursor += 1;
  while (/\s/.test(segment[cursor] || '')) cursor += 1;
  if (segment[cursor] === '<') {
    const start = cursor + 1;
    for (let i = start; i < segment.length; i += 1) {
      if (segment[i] === '\\') { i += 1; continue; }
      if (segment[i] === '>') return { start, end: i };
    }
    return null;
  }
  const start = cursor;
  let parentheses = 0;
  for (; cursor < segment.length; cursor += 1) {
    const char = segment[cursor];
    if (char === '\\') { cursor += 1; continue; }
    if (char === '(') parentheses += 1;
    else if (char === ')') {
      if (parentheses === 0) break;
      parentheses -= 1;
    } else if (/\s/.test(char) && parentheses === 0) break;
  }
  return cursor > start ? { start, end: cursor } : null;
}

function destinationInDefinition(segment) {
  if (!segment.startsWith('[')) return null;
  const closeLabel = closingBracket(segment, 0);
  if (closeLabel < 0) return null;
  let cursor = closeLabel + 1;
  while (/\s/.test(segment[cursor] || '')) cursor += 1;
  if (segment[cursor] !== ':') return null;
  cursor += 1;
  while (/\s/.test(segment[cursor] || '')) cursor += 1;
  if (segment[cursor] === '<') {
    const start = cursor + 1;
    for (let i = start; i < segment.length; i += 1) {
      if (segment[i] === '\\') { i += 1; continue; }
      if (segment[i] === '>') return { start, end: i };
    }
    return null;
  }
  const start = cursor;
  while (cursor < segment.length && !/\s/.test(segment[cursor])) {
    if (segment[cursor] === '\\') cursor += 1;
    cursor += 1;
  }
  return cursor > start ? { start, end: cursor } : null;
}

function markdownLinks(markdown) {
  const tree = parser.parse(markdown);
  const linkedDefinitions = new Set();
  visit(tree, 'linkReference', (node) => linkedDefinitions.add(node.identifier));
  const links = [];
  visit(tree, 'link', (node) => {
    if (!node.url || !node.position) return;
    const start = node.position.start.offset;
    const end = node.position.end.offset;
    const segment = markdown.slice(start, end);
    let range = destinationInParenthesizedLink(segment);
    if (range) {
      links.push({ node, start: start + range.start, end: start + range.end, definition: false });
      return;
    }
    if (segment.startsWith('<') && segment.endsWith('>')) {
      links.push({ node, start: start + 1, end: end - 1, definition: false });
      return;
    }
    // GFM autolinks such as https://example.com have no surrounding markup.
    if (segment.trim() === node.url) links.push({ node, start, end, definition: false });
  });
  visit(tree, 'definition', (node) => {
    if (!linkedDefinitions.has(node.identifier) || !node.url || !node.position) return;
    const start = node.position.start.offset;
    const end = node.position.end.offset;
    const range = destinationInDefinition(markdown.slice(start, end));
    if (range) links.push({ node, start: start + range.start, end: start + range.end, definition: true });
  });
  return links;
}

function mapAlias(route) {
  if (route === VECTOR_STORE_GUIDE) return { localRoute: VECTOR_STORE_INDEX, kind: 'vector-store-guide-alias' };
  if (route === MISPLACED_WORKFLOW || route === '/python/llamaagents/workflows/') {
    return { externalPath: WORKFLOW_UPSTREAM_PATH, kind: 'workflow-path-correction' };
  }
  return null;
}

function fragmentPlan(hash, headingIds, dropStaleAnchors = false) {
  if (!hash) return { hash: '', changed: false, unresolved: null };
  const original = safeDecode(hash.slice(1));
  let normalized = stripIndexSuffix(original);
  let changed = normalized !== original;
  const ids = headingIds ? new Set(headingIds) : null;
  if (ids) {
    if (ids.has(normalized)) return { hash: `#${normalized}`, changed: changed || normalized !== original, unresolved: null };
    const collapsed = collapseHyphens(normalized);
    if (collapsed !== normalized && ids.has(collapsed)) {
      return { hash: `#${collapsed}`, changed: true, unresolved: null, kind: 'heading-hyphen-correction' };
    }
    const slugged = slugId(normalized);
    if (slugged !== normalized && ids.has(slugged)) {
      return { hash: `#${slugged}`, changed: true, unresolved: null, kind: 'heading-slug-correction' };
    }
    if (dropStaleAnchors) {
      return {
        hash: '',
        changed: true,
        unresolved: null,
        dropped: { original: hash, candidate: slugged, reason: 'source anchor unavailable' },
      };
    }
    return { hash: changed ? `#${normalized}` : hash, changed,
      unresolved: { original: hash, candidate: normalized, reason: 'fragment does not match a heading ID' } };
  }
  return { hash: changed ? `#${normalized}` : hash, changed, unresolved: null };
}

function normalizeDestination(rawUrl, baseUrl, scope, sourceRoute) {
  let url;
  try { url = new URL(rawUrl, baseUrl); } catch { return { value: rawUrl, kind: 'unchanged-invalid-url' }; }
  if (url.origin !== ORIGIN) return { value: rawUrl, kind: 'external-unchanged' };

  const route = sourceRouteForPath(url.pathname);
  const alias = mapAlias(route);
  let destinationRoute = route;
  let externalPath = null;
  let aliasKind = null;
  if (alias?.localRoute) {
    destinationRoute = alias.localRoute;
    aliasKind = alias.kind;
  } else if (alias?.externalPath) {
    externalPath = alias.externalPath;
    aliasKind = alias.kind;
  }

  const inScope = scope.routes.has(destinationRoute);
  const isFrameworkPath = url.pathname.startsWith(DOCS_ROOT);
  let targetHeadingIds = null;
  if (inScope) targetHeadingIds = scope.headingIds.get(destinationRoute) || [];

  // Keep hashes on upstream or otherwise out-of-scope URLs exactly as authored.
  const fragment = inScope
    ? fragmentPlan(url.hash, targetHeadingIds, DROP_STALE_ANCHORS)
    : { hash: url.hash, changed: false, unresolved: null };
  if (fragment.changed || (url.hash && fragment.hash !== url.hash)) url.hash = fragment.hash;

  if (aliasKind === 'workflow-path-correction') {
    url.pathname = externalPath;
    return { value: url.href, kind: aliasKind, route: destinationRoute, unresolved: fragment.unresolved, dropped: fragment.dropped };
  }

  if (inScope) {
    const value = `${destinationRoute}${url.search}${url.hash}`;
    return { value, kind: aliasKind || (destinationRoute !== url.pathname ? 'local-route-canonicalized' : 'local'),
      route: destinationRoute, unresolved: fragment.unresolved, dropped: fragment.dropped };
  }

  // This old spelling is an in-site route typo and should point to the current page.
  if (route === VECTOR_STORE_GUIDE) {
    const value = `${VECTOR_STORE_INDEX}${url.search}${url.hash}`;
    return { value, kind: 'vector-store-guide-alias', route: VECTOR_STORE_INDEX, unresolved: fragment.unresolved, dropped: fragment.dropped };
  }

  // Framework-root URLs absent from source/en (for example API reference pages)
  // stay upstream links. Other same-host links are made absolute but otherwise
  // keep their upstream path as-authored.
  if (isFrameworkPath) url.pathname = canonicalDocPath(url.pathname);
  return { value: url.href, kind: 'upstream-out-of-scope', route: destinationRoute, unresolved: null };
}

function applyEdits(text, edits) {
  let output = text;
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    output = `${output.slice(0, edit.start)}${edit.value}${output.slice(edit.end)}`;
  }
  return output;
}

async function loadScope() {
  const files = await filesIn(SOURCE_ROOT, '.md');
  const routes = new Map();
  const headingIds = new Map();
  const fileIds = new Map();
  for (const filename of files) {
    const id = idFromFile(filename, SOURCE_ROOT, '.md');
    const route = routeFromId(id);
    const raw = await readFile(filename, 'utf8');
    routes.set(route, filename);
    headingIds.set(route, sourceAnchorIds(sourceBody(raw)));
    fileIds.set(route, id);
  }
  return { routes, headingIds, fileIds, sourceCount: files.length };
}

async function loadGeneratedPages(scope) {
  const filenames = await filesIn(OUTPUT_ROOT, '.json');
  const pages = [];
  const errors = [];
  for (const filename of filenames) {
    try {
      const page = JSON.parse(await readFile(filename, 'utf8'));
      const id = idFromFile(filename, OUTPUT_ROOT, '.json');
      const sourceFile = scope.routes.get(page.route);
      const sourceRaw = sourceFile ? await readFile(sourceFile, 'utf8') : null;
      pages.push({ filename, id, page, sourceFile, sourceRaw, route: page.route });
    } catch (error) {
      errors.push({ file: path.relative(ROOT, filename).replaceAll('\\', '/'), error: error.message });
    }
  }
  return { pages, errors };
}

function inspectBrokenSourceAnchors(scope) {
  const unresolved = [];
  const dropped = [];
  for (const [route, filename] of scope.routes) {
    const markdown = sourceBody(awaitReadCache.get(filename));
    const baseUrl = `${ORIGIN}${route}`;
    for (const { node } of markdownLinks(markdown)) {
      let url;
      try { url = new URL(node.url, baseUrl); } catch { continue; }
      if (url.origin !== ORIGIN || !url.pathname.startsWith(DOCS_ROOT) || !url.hash) continue;
      const targetRouteRaw = sourceRouteForPath(url.pathname);
      const alias = mapAlias(targetRouteRaw);
      const targetRoute = alias?.localRoute || targetRouteRaw;
      if (!scope.routes.has(targetRoute)) continue;
      const plan = fragmentPlan(url.hash, scope.headingIds.get(targetRoute) || [], DROP_STALE_ANCHORS);
      const reportItem = {
        from: route,
        sourceFile: path.relative(ROOT, filename).replaceAll('\\', '/'),
        line: node.position?.start?.line,
        href: node.url,
        target: targetRoute,
      };
      if (plan.unresolved) unresolved.push({
        ...reportItem,
        fragment: plan.unresolved.original,
        afterSafeNormalization: plan.unresolved.candidate,
        reason: plan.unresolved.reason,
      });
      if (plan.dropped) dropped.push({
        ...reportItem,
        fragment: plan.dropped.original,
        afterSafeNormalization: plan.dropped.candidate,
        reason: plan.dropped.reason,
      });
    }
  }
  return { unresolved, dropped };
}

// Source files are read once so dry-run can inspect every source route while the
// generated JSON set is still growing.
const awaitReadCache = new Map();

async function collectSourceMarkdown(scope) {
  for (const filename of scope.routes.values()) awaitReadCache.set(filename, await readFile(filename, 'utf8'));
}

function countByKind(items) {
  const counts = {};
  for (const item of items) counts[item.kind] = (counts[item.kind] || 0) + 1;
  return counts;
}

async function main() {
  const scope = await loadScope();
  await collectSourceMarkdown(scope);
  const { pages, errors } = await loadGeneratedPages(scope);
  const routeFiles = new Set(scope.routes.keys());
  const generatedRoutes = new Set(pages.map(({ route }) => route));
  const missingRoutes = [...routeFiles].filter((route) => !generatedRoutes.has(route));
  const extraRoutes = [...generatedRoutes].filter((route) => !routeFiles.has(route));
  const staleSourceHashes = [];
  const changes = [];
  const unresolvedOutputAnchors = [];
  const droppedOutputAnchors = [];
  const outputMissingRoutes = [];
  const writes = [];

  for (const item of pages) {
    if (!item.sourceRaw) continue;
    if (!item.page.sourceHash || createHash('sha256').update(item.sourceRaw).digest('hex') !== item.page.sourceHash) {
      staleSourceHashes.push(item.route);
    }
    const markdown = item.page.markdown || '';
    const edits = [];
    for (const link of markdownLinks(markdown)) {
      const result = normalizeDestination(link.node.url, `${ORIGIN}${item.route}`, scope, item.route);
      if (result.unresolved) unresolvedOutputAnchors.push({
        from: item.route,
        line: link.node.position?.start?.line,
        href: link.node.url,
        target: result.route,
        fragment: result.unresolved.original,
        afterSafeNormalization: result.unresolved.candidate,
      });
      if (result.dropped) droppedOutputAnchors.push({
        from: item.route,
        line: link.node.position?.start?.line,
        href: link.node.url,
        target: result.route,
        fragment: result.dropped.original,
        afterSafeNormalization: result.dropped.candidate,
        reason: result.dropped.reason,
      });
      let resolvedUrl;
      try { resolvedUrl = new URL(link.node.url, `${ORIGIN}${item.route}`); } catch {}
      if (result.kind === 'upstream-out-of-scope' && resolvedUrl?.pathname.startsWith(DOCS_ROOT)) {
        outputMissingRoutes.push({ from: item.route, href: link.node.url, resolved: result.value });
      }
      if (result.value !== link.node.url) {
        edits.push({ start: link.start, end: link.end, value: result.value });
        changes.push({ route: item.route, line: link.node.position?.start?.line, from: link.node.url, to: result.value, kind: result.kind });
      }
    }
    if (edits.length) writes.push({ filename: item.filename, page: item.page, markdown: applyEdits(markdown, edits) });
  }

  const sourceBrokenAnchors = inspectBrokenSourceAnchors(scope);
  const report = {
    mode,
    snapshot: {
      sourceRoutes: scope.sourceCount,
      generatedPages: pages.length,
      parsedPageErrors: errors.length,
      missingGeneratedRoutes: missingRoutes.length,
      extraGeneratedRoutes: extraRoutes.length,
      staleSourceHashes: staleSourceHashes.length,
      dropStaleAnchors: DROP_STALE_ANCHORS,
    },
    planned: {
      pagesToUpdate: writes.length,
      linkDestinationsToUpdate: changes.length,
      byKind: countByKind(changes),
      examples: changes.slice(0, 40),
    },
    unresolvedOutputAnchors,
    droppedOutputAnchors,
    unresolvedSourceAnchors: sourceBrokenAnchors.unresolved,
    droppedSourceAnchors: sourceBrokenAnchors.dropped,
    frameworkLinksOutsideSourceScope: {
      count: outputMissingRoutes.length,
      examples: outputMissingRoutes.slice(0, 100),
    },
    missingGeneratedRouteExamples: missingRoutes.slice(0, 30),
    extraGeneratedRouteExamples: extraRoutes.slice(0, 30),
    staleSourceHashRouteExamples: staleSourceHashes.slice(0, 30),
    parseErrors: errors,
  };

  if (mode === 'write') {
    if (errors.length || missingRoutes.length || extraRoutes.length || staleSourceHashes.length || pages.length !== scope.sourceCount) {
      throw new Error(`Refusing --write: generated JSON must exactly match all ${scope.sourceCount} current source routes; no files were changed.`);
    }
    for (const item of writes) {
      item.page.markdown = item.markdown;
      await writeFile(item.filename, JSON.stringify(item.page), 'utf8');
    }
    const rebuilt = await rebuildCatalog();
    report.catalogRebuiltPages = rebuilt;
    await writeFile(path.join(ROOT, 'link-normalization-report.json'), JSON.stringify(report, null, 2));
  }

  console.log(JSON.stringify(mode === 'write' ? { updatedPages: writes.length, updatedLinks: changes.length,
    unresolvedAnchors: unresolvedOutputAnchors.length, droppedSourceAnchors: sourceBrokenAnchors.dropped.length,
    report: 'link-normalization-report.json' } : report, null, 2));
}

await main();
