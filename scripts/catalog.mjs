import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const DOCS_ROOT = '/python/framework/';
export const NAV_LABELS = {
  'understanding/evaluating': '評估', 'module_guides/deploying': '部署',
  'integrations/embeddings': 'Embedding 模型', 'integrations/llm': 'LLM',
  'integrations/retrievers': 'Retriever', 'integrations/vector_stores': 'Vector Store',
  changes: '版本變更', optimizing: '最佳化',
  'optimizing/advanced_retrieval': '進階檢索', 'optimizing/agentic_strategies': 'Agent 策略',
  'optimizing/basic_strategies': '基本策略', 'optimizing/evaluation': '評估',
  'optimizing/fine-tuning': '微調', presentations: '簡報', 'understanding/deployment': '部署',
};
export async function filesIn(directory, extension) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => entry.isDirectory()
    ? filesIn(path.join(directory, entry.name), extension)
    : entry.name.endsWith(extension) ? [path.join(directory, entry.name)] : []));
  return nested.flat();
}
export function sourceBody(raw) {
  return raw.replace(/^---\s*\n[\s\S]*?\n---\s*(?:\n|$)/, '');
}
export function plainText(markdown) {
  return markdown.replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, ' ')
    .replace(/`([^`]*)`/g, '$1').replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/<[^>]+>/g, ' ')
    .replace(/[>#*_~|]/g, ' ').replace(/\s+/g, ' ').trim();
}
export async function rebuildCatalog() {
  const old = JSON.parse(await readFile(path.join(ROOT, 'public/content/manifest.json'), 'utf8'));
  const oldPages = new Map(old.pages.map((page) => [page.route, page]));
  const pageFiles = await filesIn(path.join(ROOT, 'public/content/pages'), '.json');
  const pages = [];
  const search = [];
  for (const filename of pageFiles) {
    const page = JSON.parse(await readFile(filename, 'utf8'));
    const id = path.relative(path.join(ROOT, 'public/content/pages'), filename).replaceAll('\\', '/').replace(/\.json$/, '');
    const previous = oldPages.get(page.route);
    const source = await readFile(path.join(ROOT, 'source/en', `${id}.md`), 'utf8');
    pages.push({ route: page.route, sourceUrl: page.sourceUrl, id, order: previous?.order ?? 100000 + pages.length,
      title: page.title, sourceTitle: page.sourceTitle, description: page.description, contentUrl: `/content/pages/${id}.json` });
    const text = plainText(page.markdown);
    search.push({ route: page.route, title: page.title, sourceTitle: page.sourceTitle,
      text, sourceText: plainText(sourceBody(source)), snippet: text.slice(0, 220) });
    const translated = path.join(ROOT, 'source/zh-TW', `${id}.md`);
    await mkdir(path.dirname(translated), { recursive: true });
    await writeFile(translated, `---\ntitle: ${JSON.stringify(page.title)}\n${page.description ? `description: ${JSON.stringify(page.description)}\n` : ''}---\n\n${page.markdown}`);
  }
  pages.sort((a, b) => a.order - b.order);
  const folderLabels = { ...old.folderLabels, ...NAV_LABELS };
  for (const page of pages) {
    const prefix = page.route.slice(DOCS_ROOT.length).replace(/\/$/, '');
    if (prefix in folderLabels) folderLabels[prefix] = page.title;
  }
  await writeFile(path.join(ROOT, 'public/content/manifest.json'), JSON.stringify({ ...old, pageCount: pages.length, folderLabels, pages }));
  await writeFile(path.join(ROOT, 'public/content/search-index.json'), JSON.stringify(search));
  return pages.length;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(`Catalog rebuilt: ${await rebuildCatalog()} pages`);
}
