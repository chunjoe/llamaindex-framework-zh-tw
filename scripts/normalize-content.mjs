import { spawn } from 'node:child_process';
import { ROOT, rebuildCatalog } from './catalog.mjs';

async function run(script, args = []) {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [`scripts/${script}`, ...args], { cwd: ROOT, stdio: 'inherit', windowsHide: true });
    child.on('error', reject);
    child.on('exit', (code) => code === 0 ? resolve() : reject(Error(`${script} exited with ${code}`)));
  });
}
await run('normalize-boundaries.mjs');
await run('normalize-labels.mjs');
await run('normalize-examples.mjs');
await run('normalize-inline-code.mjs', ['--write']);
await run('normalize-headings.mjs');
await run('localize-assets.mjs');
await run('normalize-links.mjs', ['--write', '--drop-stale-anchors']);
console.log(`Refreshed ${await rebuildCatalog()} pages and the bilingual search index.`);
