import { throttledInvoker } from "./throttled-invoker";
import { LabelHolder, Language } from "./labels";

export interface PrefabUpdate {
  status: string;
  prefabs: HighlightedPrefab[];
}

interface PrefabHighlightedBlocks {
  [prefabName: string]: HighlightedBlock[];
}

export default class Prefabs {
  all: Prefab[] = [];
  blockPrefabIndex: BlockPrefabIndex = {};
  filtered: HighlightedPrefab[] = [];
  markCoords: GameCoords | null = null;
  status = "";

  #labelHolder: LabelHolder;
  filter: PrefabMatcher;

  private throttledUpdater = throttledInvoker(async () => await this.updateImmediately());
  private updateListeners: ((u: PrefabUpdate) => void)[] = [];

  constructor(baseUrl: string, navigatorLanguages: readonly string[]) {
    this.#labelHolder = new LabelHolder(baseUrl, navigatorLanguages);
    this.filter = this.defaultMatcher();
  }

  set language(lang: Language) {
    this.#labelHolder.language = lang;
  }

  set prefabsFilterString(filter: string) {
    const s = filter.trim();
    if (s.length === 0) {
      this.filter = this.defaultMatcher();
    } else {
      this.filter = new PrefabNameMatcher(new RegExp(s, "i"), this.#labelHolder);
    }
  }
  set blocksFilterString(filter: string) {
    const s = filter.trim();
    if (s.length === 0) {
      this.filter = this.defaultMatcher();
    } else {
      this.filter = new BlockNameMatcher(new RegExp(s, "i"), this.blockPrefabIndex, this.#labelHolder);
    }
  }

  update(): void {
    this.throttledUpdater();
  }
  async updateImmediately(): Promise<void> {
    await this.applyFilter();
    this.updateDist();
    this.sort();
    const update: PrefabUpdate = { status: this.status, prefabs: this.filtered };
    this.updateListeners.forEach((f) => f(update));
  }

  addUpdateListener(func: (update: PrefabUpdate) => void): void {
    this.updateListeners.push(func);
  }

  private defaultMatcher() {
    return new AllMatcher(this.#labelHolder);
  }

  private async applyFilter() {
    const result = await this.filter.match(this.all);
    this.status = result.status;
    this.filtered = result.matched;
  }

  private updateDist() {
    if (this.markCoords) {
      const { markCoords } = this;
      this.filtered.forEach((p) => (p.dist = calcDist(p, markCoords)));
    } else {
      this.filtered.forEach((p) => (p.dist = null));
    }
  }

  private sort() {
    if (this.markCoords) {
      this.status = `${this.status}, order by distances from the flag`;
      this.filtered.sort(distSorter);
    } else {
      this.filtered.sort(nameSorter);
    }
  }
}

function nameSorter(a: { name: string }, b: { name: string }) {
  if (a.name > b.name) return 1;
  if (a.name < b.name) return -1;
  return 0;
}

function distSorter(a: HighlightedPrefab, b: HighlightedPrefab) {
  if (!a.dist || !b.dist) return nameSorter(a, b);
  if (a.dist > b.dist) return 1;
  if (a.dist < b.dist) return -1;
  return nameSorter(a, b);
}

function calcDist(targetCoords: GameCoords, baseCoords: GameCoords) {
  return Math.round(Math.sqrt((targetCoords.x - baseCoords.x) ** 2 + (targetCoords.z - baseCoords.z) ** 2));
}

function matchAndHighlight(str: string, regex: RegExp) {
  let isMatched = false;
  const highlighted = str.replace(regex, (m) => {
    isMatched = m.length > 0;
    return `<mark>${m}</mark>`;
  });
  return isMatched ? highlighted : null;
}

interface PrefabMatcher {
  match(prefabs: Prefab[]): Promise<PrefabMatcherResult>;
}
interface PrefabMatcherResult {
  status: string;
  matched: HighlightedPrefab[];
}

class AllMatcher implements PrefabMatcher {
  labels: LabelHolder;

  constructor(labels: LabelHolder) {
    this.labels = labels;
  }

  async match(prefabs: Prefab[]) {
    const labels = await this.labels.prefabs;
    return {
      status: prefabs.length === 0 ? "No prefabs" : "All prefabs",
      matched: prefabs.map((p) => {
        const label = labels.get(p.name) ?? "-";
        return {
          ...p,
          highlightedName: p.name,
          highlightedLabel: label,
        };
      }),
    };
  }
}

class PrefabNameMatcher implements PrefabMatcher {
  regexp: RegExp;
  labels: LabelHolder;

  constructor(regexp: RegExp, labels: LabelHolder) {
    this.regexp = regexp;
    this.labels = labels;
  }

  async match(prefabs: Prefab[]) {
    const labels = await this.labels.prefabs;
    const results = prefabs.flatMap<HighlightedPrefab>((prefab) => {
      const highlightedName = matchAndHighlight(prefab.name, this.regexp);
      const label = labels.get(prefab.name) ?? "-";
      const highlightedLabel = label && matchAndHighlight(label, this.regexp);
      if (highlightedName || highlightedLabel) {
        return {
          ...prefab,
          highlightedName: highlightedName || prefab.name,
          highlightedLabel: highlightedLabel || label,
        };
      }
      return [];
    });
    return {
      status: `${results.length} matched prefabs`,
      matched: results,
    };
  }
}

class BlockNameMatcher implements PrefabMatcher {
  regexp: RegExp;
  blockPrefabIndex: BlockPrefabIndex;
  labels: LabelHolder;

  constructor(regexp: RegExp, blockPrefabIndex: BlockPrefabIndex, labels: LabelHolder) {
    this.regexp = regexp;
    this.blockPrefabIndex = blockPrefabIndex;
    this.labels = labels;
  }

  async match(prefabs: Prefab[]) {
    const matchedBlocks = await this.matchBlocks();
    if (matchedBlocks.length === 0) {
      return { status: "No matched blocks", matched: [] };
    }

    const matchedPrefabBlocks = this.matchPrefabTypes(matchedBlocks);
    if (Object.keys(matchedPrefabBlocks).length === 0) {
      return { status: `No prefabs, but ${matchedBlocks.length} matched blocks`, matched: [] };
    }

    const labels = await this.labels.prefabs;
    const results = prefabs.flatMap((prefab: Prefab) => {
      const blocks = matchedPrefabBlocks[prefab.name];
      if (!blocks) {
        return [];
      }
      return {
        ...prefab,
        highlightedName: prefab.name,
        highlightedLabel: labels.get(prefab.name) ?? "-",
        matchedBlocks: blocks,
      };
    });
    return {
      status: `${results.length} prefabs, ${matchedBlocks.length} matched blocks`,
      matched: results,
    };
  }

  private async matchBlocks() {
    const labels = await this.labels.blocks;
    return Object.entries(this.blockPrefabIndex).reduce<HighlightedBlock[]>((arr, [blockName, prefabs]) => {
      const highlightedName = matchAndHighlight(blockName, this.regexp);
      const label = labels.get(blockName) ?? "-";
      const highlightedLabel = label && matchAndHighlight(label, this.regexp);
      if (highlightedName || highlightedLabel) {
        return arr.concat({
          name: blockName,
          highlightedName: highlightedName || blockName,
          highlightedLabel: highlightedLabel || label,
          prefabs,
        });
      }
      return arr;
    }, []);
  }

  private matchPrefabTypes(matchedBlocks: HighlightedBlock[]): PrefabHighlightedBlocks {
    return matchedBlocks.reduce<PrefabHighlightedBlocks>((idx, block) => {
      const { name, highlightedName, highlightedLabel } = block;
      block.prefabs?.forEach((p) => {
        const b = {
          name,
          highlightedName,
          highlightedLabel,
          count: p.count,
        };
        idx[p.name] = (idx[p.name] || []).concat(b);
      });
      return idx;
    }, {});
  }
}
