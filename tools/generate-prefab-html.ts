/* eslint-env node */

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require('path');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fsPromise'... Remove this comment to see the full error message
const fsPromise = require('fs').promises;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'glob'.
const glob = require('glob-promise');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'prefabHtml... Remove this comment to see the full error message
const prefabHtml = require('./lib/prefab-html');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'localInfo'... Remove this comment to see the full error message
const localInfo = require('../local.json');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'parseLabel... Remove this comment to see the full error message
const parseLabel = require('./lib/label-parser');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'projectRoo... Remove this comment to see the full error message
const projectRoot = path.join(path.dirname(process.argv[1]), '..');
const baseDist = 'docs/prefabs';

async function main() {
  await remove();
  const labels = await loadLabels();
  const prefabNames = await generateHtml(labels);
  await Promise.all([
    await generateIndex(prefabNames),
    await copyJpg(prefabNames),
  ]);
}

async function remove() {
  const globPath = path.join(projectRoot, baseDist, '*.{jpg,html}');
  await Promise.all((await glob(globPath)).map(fsPromise.unlink));
  console.log('Remove %s', globPath);
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
async function loadLabels() {
  const { vanillaDir } = localInfo;
  const fileName = path.join(vanillaDir, 'Data', 'Config', 'Localization.txt');
  const labels = await parseLabel(fileName);
  console.log('Load %s labels', Object.keys(labels).length);
  return labels;
}

async function generateHtml(labels: any) {
  const { vanillaDir } = localInfo;
  const xmlGlob = path.join(vanillaDir, 'Data', 'Prefabs', '*.xml');
  const xmlFiles = await glob(xmlGlob);
  if (xmlFiles.length === 0) {
    throw Error(`No xml file: ${xmlGlob}`);
  }

  const prefabNames = await Promise.all(xmlFiles.map(async (xmlFileName: any) => {
    const prefabName = path.basename(xmlFileName, '.xml');
    const nimFileName = path.join(vanillaDir, 'Data', 'Prefabs', `${prefabName}.blocks.nim`);
    const ttsFileName = path.join(vanillaDir, 'Data', 'Prefabs', `${prefabName}.tts`);
    let html;
    try {
      html = await prefabHtml({
        xml: xmlFileName, nim: nimFileName, tts: ttsFileName, labels,
      });
    } catch (e) {
      console.warn('Ignore Prefab: %s', e.message);
      return null;
    }
    const dist = path.join(projectRoot, baseDist, `${prefabName}.html`);
    await fsPromise.writeFile(dist, html);
    return prefabName;
  })).then((ns) => ns.filter((n) => n)); // Filter out failed prefabs.
  console.log('Write %d html files', xmlFiles.length);

  return prefabNames;
}

async function copyJpg(prefabNames: any) {
  const { vanillaDir } = localInfo;
  const jpgFiles = prefabNames
    .map((n: any) => path.join(vanillaDir, 'Data', 'Prefabs', `${n}.jpg`));

  let failNum = 0;
  await Promise.all(jpgFiles.map(async (jpgFileName: any) => {
    const dist = path.join(projectRoot, baseDist, path.basename(jpgFileName));
    try {
      await fsPromise.copyFile(jpgFileName, dist);
    } catch (e) {
      console.warn('JPG Copy fail: ', e.message);
      failNum += 1;
    }
  }));
  console.log('Copy %d jpg files', jpgFiles.length - failNum);
}

async function generateIndex(prefabNames: any) {
  const dist = path.join(projectRoot, baseDist, 'index.html');
  await fsPromise.writeFile(dist, `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="description" content="">
  <title>Prefab List</title>
</head>
<body>
  <h1>Prefab List</h1>
  <nav>
    <ul>
      <li><a href="..">7dtd-map</a></li>
      <li><a href="https://github.com/kui/7dtd-map">Github repository</a></li>
    </ul>
  </nav>
  <ul>
   ${prefabNames.map((p: any) => `<li><a href="${p}.html">${p}</a></li>`).join('\n')}
  </ul>
</body>
</html>
`);
  console.log('Write index.html');
}

main().then((exitCode) => {
  process.on('exit', () => process.exit(exitCode));
});
