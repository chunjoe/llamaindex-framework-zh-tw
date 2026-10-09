import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { ROOT } from './catalog.mjs';
import { loadPages, markdownBlocks, markdownCodeRanges, codeLikeBlock, maskMarkdown, visibleProse, isLongEnglish, ordinaryTitleWordCount } from './repair-translations.mjs';

const pages = await loadPages();
const candidates = [];
for (const entry of pages) {
  const markdown = entry.page.markdown;
  const protectedRanges = markdownCodeRanges(markdown);
  for (const block of markdownBlocks(markdown)) {
    if (protectedRanges.some((range) => block.start >= range.start && block.start < range.end) || codeLikeBlock(block.text)) continue;
    // Catalog/data tables contain identifiers and sample output rather than ordinary prose.
    if (/^\s*\|/m.test(block.text)) continue;
    const prose = visibleProse(maskMarkdown(block.text).masked);
    if (/\p{Script=Han}/u.test(prose)) continue;
    const heading = /^\s*#{1,6}\s/.test(block.text);
    if (!isLongEnglish(prose, { heading }) && !(heading && ordinaryTitleWordCount(prose) >= 2)) continue;
    candidates.push({ route: entry.route, line: markdown.slice(0, block.start).split('\n').length, text: block.text });
  }
}
await writeFile(path.join(ROOT, 'translation-audit-report.json'), JSON.stringify({ checkedPages: pages.length, candidates }, null, 2));
console.log(JSON.stringify({ checkedPages: pages.length, candidates: candidates.length }));
