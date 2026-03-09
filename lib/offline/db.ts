import { type DBSchema, openDB } from "idb";

const DATABASE_NAME = "club-freedom-media";
const DATABASE_VERSION = 1;

type Status = "pending" | "uploading" | "error" | "done";

export interface LocalMediaDB extends DBSchema {
  media: {
    key: string;
    value: {
      blob: Blob;
      status: Status;
    };
  };
}

export const getDB = () => {
  return openDB<LocalMediaDB>(DATABASE_NAME, DATABASE_VERSION, {
    upgrade(db) {
      db.createObjectStore("media");
    },
  });
};

export const addMediaToDB = async (blob: Blob, id: string) => {
  const db = await getDB();
  db.put("media", { blob, status: "pending" }, id);
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

export const updateMediaUploadStatus = async (id: string, status: Status) => {
  const db = await getDB();
  const item = await db.get("media", id);
  if (item) {
    await db.put("media", { ...item, status }, id);
  }
};
