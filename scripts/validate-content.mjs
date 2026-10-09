import { readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import { ROOT, DOCS_ROOT, filesIn, sourceBody } from './catalog.mjs';

const parser = unified().use(remarkParse).use(remarkGfm);
const sourceRoot = path.join(ROOT, 'source/en');
const sourceFiles = await filesIn(sourceRoot, '.md');
function routeFromMarkdownFile(file) {
  const id = path.relative(sourceRoot, file).replaceAll('\\', '/').replace(/\.md$/, '');
  const relative = id.replace(/(^|\/)index$/, '');
  return `${DOCS_ROOT}${relative ? `${relative}/` : ''}`;
}
const sourceRoutes = sourceFiles.map(routeFromMarkdownFile);
const pages = await Promise.all((await filesIn(path.join(ROOT, 'public/content/pages'), '.json')).map(async (file) => ({
  file, page: JSON.parse(await readFile(file, 'utf8')),
})));
const byRoute = new Map(pages.map(({ page }) => [page.route, page]));
const report = { checkedPages: pages.length, sourcePages: sourceFiles.length,
  sourceRouteCoverage: {}, codeDifferences: [], inlineCodeDifferences: [], headingDifferences: [], missingPages: [], missingAssets: [], remoteImages: [], brokenAnchors: [], unlistedSourceLinks: [] };
function collect(tree, type) {
  const nodes = [];
  visit(tree, type, (node) => { nodes.push(node); });
  return nodes;
}
function rawBlocks(tree, text) {
  return collect(tree, 'code').map((node) => text.slice(node.position.start.offset, node.position.end.offset));
}
for (const { file, page } of pages) {
  const id = path.relative(path.join(ROOT, 'public/content/pages'), file).replace(/\.json$/, '.md');
  const source = sourceBody(await readFile(path.join(ROOT, 'source/en', id), 'utf8'));
  const srcTree = parser.parse(source);
  const tree = parser.parse(page.markdown);
  if (JSON.stringify(rawBlocks(srcTree, source)) !== JSON.stringify(rawBlocks(tree, page.markdown))) report.codeDifferences.push(page.route);
  const srcInline = collect(srcTree, 'inlineCode').map((node) => node.value);
  const actualInline = collect(tree, 'inlineCode').map((node) => node.value);
  // Word order can change in Chinese. Each original inline code value must remain verbatim.
  if (JSON.stringify([...srcInline].sort()) !== JSON.stringify([...actualInline].sort())) report.inlineCodeDifferences.push({ route: page.route,
    removed: srcInline.filter((value) => !actualInline.includes(value)), added: actualInline.filter((value) => !srcInline.includes(value)) });
  const sourceLevels = collect(srcTree, 'heading').map((node) => node.depth);
  const actualLevels = collect(tree, 'heading').map((node) => node.depth);
  const metadataHeadings = Array.isArray(page.headings) ? page.headings : [];
  const metadataLevels = metadataHeadings.map((heading) => heading.level);
  if (JSON.stringify(sourceLevels) !== JSON.stringify(actualLevels)
    || JSON.stringify(actualLevels) !== JSON.stringify(metadataLevels)
    || actualLevels.length !== metadataHeadings.length
    || metadataHeadings.some((heading) => typeof heading.id !== 'string' || !heading.id)) {
    report.headingDifferences.push({ route: page.route, sourceLevels, actualLevels, metadataLevels });
  }
  const definitions = new Map(collect(tree, 'definition').map((node) => [node.identifier, node.url]));
  const links = [...collect(tree, 'link'), ...collect(tree, 'linkReference').map((node) => ({ url: definitions.get(node.identifier) }))];
  for (const node of links) {
    if (!node.url) continue;
    let url;
    try { url = new URL(node.url, page.sourceUrl); } catch { continue; }
    if (url.hostname !== 'developers.llamaindex.ai' || !url.pathname.startsWith(DOCS_ROOT)) continue;
    const targetRoute = decodeURI(url.pathname).replace(/\/index\.md$/, '/').replace(/\.md$/, '/').replace(/\/?$/, '/');
    const target = byRoute.get(targetRoute);
    if (!target) { report.unlistedSourceLinks.push({ from: page.route, url: url.href }); continue; }
    if (url.hash && !target.headings.some((heading) => heading.id === decodeURIComponent(url.hash.slice(1)))) {
      const explicit = new RegExp(`(?:id|name)=["']${url.hash.slice(1)}["']`);
      if (!explicit.test(target.markdown)) report.brokenAnchors.push({ from: page.route, to: targetRoute, hash: url.hash });
    }
  }
  const images = [...collect(tree, 'image').map((node) => node.url), ...collect(tree, 'html').flatMap((node) => [...node.value.matchAll(/\bsrc=["']([^"']+)["']/g)].map((match) => match[1]))];
  for (const image of images) {
    if (/^https?:/.test(image)) report.remoteImages.push({ route: page.route, image });
    else if (image.startsWith('/assets/')) {
      try { await access(path.join(ROOT, 'public', image)); }
      catch { report.missingAssets.push({ route: page.route, image }); }
    }
  }
}
const manifest = JSON.parse(await readFile(path.join(ROOT, 'public/content/manifest.json'), 'utf8'));
const searchIndex = JSON.parse(await readFile(path.join(ROOT, 'public/content/search-index.json'), 'utf8'));
const manifestPages = Array.isArray(manifest.pages) ? manifest.pages : [];
const searchEntries = Array.isArray(searchIndex) ? searchIndex : [];
const routeCounts = (entries) => {
  const counts = new Map();
  for (const entry of entries) if (typeof entry.route === 'string') counts.set(entry.route, (counts.get(entry.route) || 0) + 1);
  return counts;
};
const jsonRouteCounts = routeCounts(pages.map(({ page }) => page));
const manifestRouteCounts = routeCounts(manifestPages);
const searchRouteCounts = routeCounts(searchEntries);
const duplicateRoutes = (counts) => [...counts].filter(([, count]) => count > 1).map(([route]) => route);
report.sourceRouteCoverage = {
  missingJson: sourceRoutes.filter((route) => !jsonRouteCounts.has(route)),
  missingManifest: sourceRoutes.filter((route) => !manifestRouteCounts.has(route)),
  missingSearchIndex: sourceRoutes.filter((route) => !searchRouteCounts.has(route)),
  duplicateJson: duplicateRoutes(jsonRouteCounts),
  duplicateManifest: duplicateRoutes(manifestRouteCounts),
  duplicateSearchIndex: duplicateRoutes(searchRouteCounts),
};
for (const page of manifestPages) if (!byRoute.has(page.route)) report.missingPages.push(page.route);
await writeFile(path.join(ROOT, 'validation-report.json'), JSON.stringify(report, null, 2));
const summary = Object.fromEntries(Object.entries(report).map(([key, value]) => [key, Array.isArray(value) ? value.length : value]));
summary.sourceRouteCoverage = Object.fromEntries(Object.entries(report.sourceRouteCoverage).map(([key, routes]) => [key, routes.length]));
console.log(JSON.stringify(summary, null, 2));
const routeCoverageFailed = Object.values(report.sourceRouteCoverage).some((routes) => routes.length > 0);
if (report.codeDifferences.length || report.inlineCodeDifferences.length || report.headingDifferences.length
  || report.brokenAnchors.length || report.missingAssets.length || report.remoteImages.length
  || report.missingPages.length || routeCoverageFailed) process.exitCode = 1;
