import { promises as fs } from "fs";
import { handleMain, program, projectRoot } from "./lib/utils";

const USAGE = `Usage: ${program()} <tier>
  tier: 1-5
  Output a regex that matches all prefab in the given tier.`;

const DIFFICULTY_JSON_FILE = projectRoot("docs", "prefab-difficulties.json");

interface PrefabDifficulties {
  [prefabName: string]: number;
}

async function main() {
  const tier = parseInt(process.argv[2] ?? "");
  if (isNaN(tier) || tier < 1 || tier > 5) {
    console.error(USAGE);
    return 1;
  }

  const difficulties: PrefabDifficulties = await readJsonFile(DIFFICULTY_JSON_FILE);
  const prefabNames = Object.entries(difficulties)
    .filter(([, difficulty]) => difficulty === tier)
    .map(([name]) => name);
  console.error("Found %d prefabs in tier %d", prefabNames.length, tier);
  console.log(`^(%s)$`, prefabNames.join("|"));
  return 0;
}

async function readJsonFile<T>(file: string): Promise<T> {
  return fs.readFile(file, "utf-8").then((s) => JSON.parse(s) as T);
}

handleMain(main());
