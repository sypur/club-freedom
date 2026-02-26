import { type DBSchema, openDB, type StoreValue } from "idb";

const DATABASE_NAME = "club-freedom-media";
const DATABASE_VERSION = 1;

type Status = "pending" | "uploading" | "error" | "done";

export interface LocalMediaDB extends DBSchema {
  media: {
    key: string;
    value: {
      blob: Blob;
      organizationId: string;
      status: Status;
    };
  };
}

export type MediaItem = StoreValue<LocalMediaDB, "media">;

export const getDB = () => {
  return openDB<LocalMediaDB>(DATABASE_NAME, DATABASE_VERSION, {
    upgrade(db) {
      db.createObjectStore("media");
    },
  });
};

export const addMediaItemToDB = async (id: string, item: MediaItem) => {
  const db = await getDB();
  db.put("media", item, id);
};

export const getAllKeys = async () => {
  const db = await getDB();
  return db.getAllKeys("media");
};

export const getMediaById = async (id: string) => {
  const db = await getDB();
  return db.get("media", id);
};

export const deleteMediaById = async (id: string) => {
  const db = await getDB();
  await db.delete("media", id);
};

export const updateMediaItemById = async (
  id: string,
  data: Partial<MediaItem>,
) => {
  const db = await getDB();
  const item = await db.get("media", id);
  if (item) {
    await db.put("media", { ...item, ...data }, id);
  }
};
