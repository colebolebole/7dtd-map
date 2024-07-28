import { printError, waitAnimationFrame } from "../lib/utils";
import { LoadingHandler } from "./loading-handler";

interface Doms {
  input: HTMLInputElement;
}

type Listener = (file: File, preprocessed: boolean) => unknown;

type ResourceLike = { name: string; file: File; preprocessed: boolean } | { name: string; url: string; preprocessed: boolean };

export class FileHandler {
  #listeners = new Map<RegExp | string, Listener[]>();
  #loadingHandler: LoadingHandler;

  constructor(doms: Doms, loadingHandler: LoadingHandler) {
    this.#loadingHandler = loadingHandler;
    doms.input.addEventListener("input", () => {
      if (doms.input.files) this.pushFiles(Array.from(doms.input.files));
    });
  }

  addListeners(arr: [RegExp | string, Listener | Listener[]][]): void {
    for (const [name, listener] of arr) this.addListener(name, listener);
  }

  addListener(fileName: RegExp | string, listener: Listener | Listener[]): void {
    const old = this.#listeners.get(fileName) ?? [];
    this.#listeners.set(fileName, old.concat(listener));
  }

  pushFiles(files: File[], preprocessed = false): void {
    this.#process(files.map((file) => ({ name: file.name, file, preprocessed }))).catch(printError);
  }

  pushUrls(urls: string[], preprocessed = false): void {
    this.#process(urls.map((url) => ({ name: basename(url), url, preprocessed }))).catch(printError);
  }

  async #process(resourceList: ResourceLike[]) {
    if (this.#loadingHandler.isLoading()) {
      throw new Error("Loading is in progress");
    }

    this.#loadingHandler.add(resourceList.map((f) => f.name));
    for (const resource of resourceList) {
      const listeners = this.#getListeners(resource.name);
      if (listeners.length === 0) {
        console.log("No hundler: ", resource.name);
      } else if (shouldSkip(resourceList, resource.name)) {
        console.log("Skip: ", resource.name);
      } else {
        console.time(`Processe: ${resource.name}`);
        const file = await resolve(resource);
        await Promise.all(listeners.map((fn) => fn(file, resource.preprocessed)));
        console.timeEnd(`Processe: ${resource.name}`);
      }
      this.#loadingHandler.delete(resource.name);
      await waitAnimationFrame();
    }
  }

  #getListeners(fileName: string) {
    return Array.from(this.#listeners.entries()).flatMap(([pattern, listeners]) => {
      if (pattern instanceof RegExp && pattern.test(fileName)) return listeners;
      if (typeof pattern === "string" && pattern === fileName) return listeners;
      return [];
    });
  }
}

async function resolve(resource: ResourceLike): Promise<File> {
  if ("file" in resource) return resource.file;
  const blob = await fetch(resource.url).then((res) => res.blob());
  return new File([blob], resource.name, { type: blob.type });
}

function basename(path: string) {
  return path.substring(path.lastIndexOf("/") + 1);
}

function shouldSkip(resources: ResourceLike[], targetName: string): boolean {
  if (targetName === "splat3.png") {
    return resources.some(({ name }) => name === "splat3_processed.png");
  }
  return false;
}
