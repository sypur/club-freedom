import { Dexie, type EntityTable } from "dexie";

const DATABASE_NAME = "club-freedom";
const DATABASE_VERSION = 1;

type Status = "pending" | "uploading" | "error" | "done";

interface MediaData {
  id: string;
  blob: Blob;
  status: Status;
  organizationId: string;
}

const db = new Dexie(DATABASE_NAME) as Dexie & {
  media: EntityTable<
    MediaData,
    "id" // primary key "id" (for the typings only)
  >;
};

db.version(DATABASE_VERSION).stores({
  media: "id, blob, status, organizationId",
});

export { type MediaData, db };
