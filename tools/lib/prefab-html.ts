import * as path from "path";
import { parseNim } from "./nim-parser";
import { parseTts } from "./tts-parser";
import { parseXml } from "./xml-parser";

function html(model: any): string {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="description" content="">
  <style>
  tr:nth-child(odd) {
    background-color: lightcyan;
  }
  </style>
  <title>${model.name}</title>
</head>
<body>
  <h1>${model.name}</h1>

  <nav>
    <ul>
      <li><a href="index.html">Prefab List</a></li>
      <li><a href="..">7dtd-map</a></li>
      <li><a href="https://github.com/kui/7dtd-map">Github repository</a></li>
    </ul>
  </nav>

  <img src="${model.name}.jpg">

  <section>
    <h2>XML</h2>
    <table>${model.xml
      .map((p: any) => `<tr><th>${p.name}</th><td>${p.value}</td></tr>`)
      .join("\n")}</table>
  </section>

  <section>
    <h2>Dimensions</h2>
    <table>${["x", "y", "z"]
      .map((d) => `<tr><th>${d}</th><td>${model.dimensions[d]}</td></tr>`)
      .join("\n")}</table>
  </section>

  <section>
    <h2>Blocks</h2>
    <table>
      <tr><th>ID</th><th>Name</th><th>Count</th></tr>
      ${model.blocks
        .map(
          (b: any) =>
            `<tr><td>${b.name}</td><td>${escapeHtml(b.localizedName)}</td><td>${
              b.num
            }</td></tr>`
        )
        .join("\n")}
    </table>
  </section>
</body>
</html>
`;
}

export async function prefabHtml(
  xml: string,
  nim: string,
  tts: string,
  labels: Map<string, string>
): Promise<string> {
  const name = path.basename(xml, ".xml");
  const { maxx, maxy, maxz, blockNums } = await parseTts(tts);
  const blocksPromise = parseNim(nim).then((bs: any) =>
    bs.map((b: any) => ({
      id: b.id,
      name: b.name,
      localizedName: labels.get(b.name),
      num: blockNums.get(b.id) || 0,
    }))
  );
  const xmlPromise = parsePrefabXml(xml).then((p) =>
    p
      .map((node: any) => {
        if (!node.name) {
          // This node might be a branch node contains child nodes.
          return null;
        }
        return { name: node.name, value: node.value };
      })
      .filter((e: any) => e)
  );
  const [blocks, dom] = await Promise.all([blocksPromise, xmlPromise]);

  const blockIdSet = new Set(blocks.map((b: any) => b.id));
  if ([...blockNums.keys()].filter((i) => !blockIdSet.has(i)).length > 0) {
    console.warn(
      "Unexpected state: unused block num: file=%s, idList=%s",
      xml,
      [...blockNums.keys()].filter((i) => !blockIdSet.has(i))
    );
  }
  if (blocks.filter((b: any) => b.num === 0).length > 0) {
    console.warn(
      "Unexpected state: unused block was asigned a ID: file=%s, blocks=%s",
      xml,
      blocks.filter((b: any) => b.num === 0)
    );
  }

  sortByProperty(dom, "name");
  sortByProperty(blocks, "name");

  return html({
    name,
    xml: dom,
    blocks,
    dimensions: { x: maxx, y: maxy, z: maxz },
  });
}

async function parsePrefabXml(xmlFileName: any) {
  const xml: any = await parseXml(xmlFileName);
  return xml.prefab.property.map((p: any) => p.$);
}

function sortByProperty(arr: any, propName: any) {
  arr.sort((a: any, b: any) => {
    if (a[propName] > b[propName]) return 1;
    if (a[propName] < b[propName]) return -1;
    return 0;
  });
}

const ESCAPE_HTML_PATTERNS = [
  [/</g, "&lt;"],
  [/>/g, "&gt;"],
  [/&/g, "&amp;"],
];

function escapeHtml(s: any) {
  if (!s) return s;
  return ESCAPE_HTML_PATTERNS.reduce(
    (str, [regex, newStr]) => str.replace(regex, newStr),
    s
  );
}
