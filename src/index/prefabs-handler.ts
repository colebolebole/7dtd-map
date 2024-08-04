import type * as prefabsFilter from "../worker/prefabs-filter";
import type { PrefabUpdate } from "../lib/prefabs";
import type { MarkerHandler } from "./marker-handler";
import type { LabelHandler } from "../lib/label-handler";
import type { FileHandler } from "./file-handler";

import { printError } from "../lib/utils";
import * as storage from "../lib/storage";

interface Doms {
  status: HTMLElement;
  minTier: HTMLInputElement;
  maxTier: HTMLInputElement;
  prefabFilter: HTMLInputElement;
  blockFilter: HTMLInputElement;
}

declare class PrefabsFilterWorker extends Worker {
  postMessage(message: prefabsFilter.InMessage): void;
}

export class PrefabsHandler {
  #listeners: ((prefabs: HighlightedPrefab[]) => unknown)[] = [];
  #tierRange: NumberRange;

  constructor(
    doms: Doms,
    worker: PrefabsFilterWorker,
    markerHandler: MarkerHandler,
    labelHandler: LabelHandler,
    fileHandler: FileHandler,
    fetchDifficulties: () => Promise<PrefabDifficulties>,
  ) {
    this.#tierRange = { start: doms.minTier.valueAsNumber, end: doms.maxTier.valueAsNumber };

    worker.addEventListener("message", (event: MessageEvent<PrefabUpdate>) => {
      const { prefabs, status } = event.data;
      doms.status.textContent = status;
      Promise.allSettled(this.#listeners.map((fn) => fn(prefabs))).catch(printError);
    });
    doms.minTier.addEventListener("input", () => {
      const newMinTier = doms.minTier.valueAsNumber;
      if (newMinTier === this.#tierRange.start) return;
      this.#tierRange.start = newMinTier;
      worker.postMessage({ difficulty: this.#tierRange });
    });
    doms.maxTier.addEventListener("input", () => {
      const newMaxTier = doms.maxTier.valueAsNumber;
      if (newMaxTier === this.#tierRange.end) return;
      this.#tierRange.end = newMaxTier;
      worker.postMessage({ difficulty: this.#tierRange });
    });
    doms.prefabFilter.addEventListener("input", () => {
      worker.postMessage({ prefabFilterRegexp: doms.prefabFilter.value });
    });
    doms.blockFilter.addEventListener("input", () => {
      worker.postMessage({ blockFilterRegexp: doms.blockFilter.value });
    });
    markerHandler.addListener((markCoords) => {
      worker.postMessage({ markCoords });
    });
    labelHandler.addListener((language) => {
      worker.postMessage({ language });
    });
    fileHandler.addListener(async (fileNames) => {
      if (fileNames.includes("prefabs.xml")) worker.postMessage({ all: await loadPrefabsXml(fetchDifficulties()) });
    });
  }

  addListener(fn: (prefabs: HighlightedPrefab[]) => unknown) {
    this.#listeners.push(fn);
  }
}

// Note: This logic can not be moved to a worker because DOM API like `DOMParser` is not available.
async function loadPrefabsXml(difficulties: Promise<PrefabDifficulties>): Promise<Prefab[]> {
  const workspace = await storage.workspaceDir();
  const prefabsXml = await workspace.get("prefabs.xml");
  return prefabsXml ? parseXml(...(await Promise.all([prefabsXml.text(), difficulties]))) : [];
}

function parseXml(xml: string, difficulties: PrefabDifficulties): Prefab[] {
  const dom = new DOMParser().parseFromString(xml, "text/xml");
  return Array.from(dom.getElementsByTagName("decoration")).flatMap((e) => {
    const position = e.getAttribute("position")?.split(",");
    if (!position || position.length !== 3) return [];
    const [x, , z] = position;
    if (!x || !z) return [];
    const name = e.getAttribute("name");
    if (!name) return [];
    return {
      name,
      x: parseInt(x),
      z: parseInt(z),
      difficulty: difficulties[name] ?? 0,
    };
  });
}
