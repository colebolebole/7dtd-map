import { DBSchema, IDBPDatabase, openDB } from "idb";
import { requireNonnull } from "./utils";

const DB_NAME = "7dtd-map-a20";
const DB_VERSION = 2;
const DEFAULT_WORLD_NAME = "New-World";

type Db = IDBPDatabase<DbSchema>;
interface DbSchema extends DBSchema {
  maps: {
    value: MapObject;
    key: number;
  };
  largeObjects: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: LargeObject<any>;
    key: [number, string];
  };
  selectedMap: {
    value: { id: number; mapId: number };
    key: number;
  };
}

export interface MapObject {
  id: number;
  name: string;
}

export const LARGE_OBJECT_TYPES = ["biomes", "splat3", "splat4", "rad", "elevations", "subElevations", "prefabs"] as const;
type LargeObjectType = (typeof LARGE_OBJECT_TYPES)[number];
export interface LargeObjects {
  // ImageBitmap for backward compatibility
  biomes: ImageBitmap | PngBlob;
  splat3: ImageBitmap | PngBlob;
  splat4: ImageBitmap | PngBlob;
  rad: ImageBitmap | PngBlob;
  elevations: Uint8Array;
  subElevations: Uint8Array;
  prefabs: Prefab[];
}
export interface LargeObject<T extends LargeObjectType> {
  mapId: number;
  type: T;
  data: LargeObjects[T];
}

const MAP_PROPERTY_TYPES = ["maps", ...LARGE_OBJECT_TYPES] as const;
type MapPropertyType = (typeof MAP_PROPERTY_TYPES)[number];
type MapPropertyValue<T extends MapPropertyType> = T extends LargeObjectType ? LargeObject<T> : DbSchema["maps"]["value"];
type MapPropertyRawValue<T extends MapPropertyType> = T extends LargeObjectType
  ? LargeObject<T>["data"]
  : DbSchema["maps"]["value"]["name"];

function dbUpgrade(db: Db, oldVersion: number, newVersion: number) {
  for (let version = oldVersion + 1; version <= newVersion; version++) {
    if (version === 1) {
      db.createObjectStore("maps", { keyPath: "id", autoIncrement: true });
      db.createObjectStore("largeObjects", { keyPath: ["mapId", "type"] });
      db.createObjectStore("selectedMap", { keyPath: "id" });
    }
  }
}

const CHANGE_LISTENERS: ((mapId: number, instance: MapStorage) => Promise<unknown> | unknown)[] = [
  (mapId) => console.log("MapStorage change current map", mapId),
];

export class MapStorage {
  private _db?: Db;

  async put<Type extends MapPropertyType>(type: Type, data: MapPropertyRawValue<Type>): Promise<void> {
    const db = await this.getDb();
    const mapId = await currentId(db);
    if (isLargeObjectType(type)) {
      await db.put("largeObjects", { mapId, type, data });
    } else if (type === "maps") {
      await db.put("maps", { id: mapId, name: data as MapPropertyRawValue<"maps"> });
    } else {
      throw Error(`Unreachable code: type=${type}`);
    }
  }

  async getCurrent<Type extends MapPropertyType>(type: Type): Promise<MapPropertyValue<Type> | undefined> {
    const db = await this.getDb();
    const mapId = await currentId(db);
    if (isLargeObjectType(type)) {
      return (await db.get("largeObjects", [mapId, type])) as MapPropertyValue<Type> | undefined;
    } else if (type === "maps") {
      return requireNonnull(await db.get("maps", mapId), () => `Unexpected state: ${mapId}`) as MapPropertyValue<Type> | undefined;
    } else {
      throw Error(`Unreachable code: ${type}`);
    }
  }

  async listMaps(): Promise<MapObject[]> {
    const db = await this.getDb();
    return db.getAll("maps");
  }

  async createMap(name = DEFAULT_WORLD_NAME): Promise<MapObject> {
    const db = await this.getDb();
    return await createMap(db, name);
  }

  async deleteMap(mapIdOrUndefined?: number): Promise<void> {
    const db = await this.getDb();
    const mapId = mapIdOrUndefined ?? (await currentId(db));
    await Promise.all([db.delete("maps", mapId), ...LARGE_OBJECT_TYPES.map((t) => db.delete("largeObjects", [mapId, t]))]);
  }

  async changeMap(mapId: number): Promise<void> {
    const db = await this.getDb();
    await Promise.all([changeMap(db, mapId), ...CHANGE_LISTENERS.map((fn) => fn(mapId, this))]);
  }

  async currentId(): Promise<number> {
    return currentId(await this.getDb());
  }

  static addListener(listener: (mapId: number, self: MapStorage) => Promise<void>): void {
    CHANGE_LISTENERS.push(listener);
  }

  private async getDb() {
    if (!this._db) {
      this._db = await openDB<DbSchema>(DB_NAME, DB_VERSION, { upgrade: dbUpgrade });
    }
    return this._db;
  }
}

async function createMap(db: Db, name: string) {
  const id = await db.put("maps", { name } as MapObject);
  return { id, name };
}

function isLargeObjectType(type: MapPropertyType): type is LargeObjectType {
  return (LARGE_OBJECT_TYPES as readonly string[]).includes(type);
}

async function changeMap(db: Db, mapId: number) {
  await db.put("selectedMap", { id: 0, mapId });
}

async function currentId(db: Db): Promise<number> {
  const map = await db.get("selectedMap", 0);
  if (map) {
    return map.mapId;
  }

  const all = await db.getAll("maps");
  if (all[0]) {
    await changeMap(db, all[0].id);
    return currentId(db);
  }

  const newMap = await createMap(db, DEFAULT_WORLD_NAME);
  await changeMap(db, newMap.id);
  return currentId(db);
}
