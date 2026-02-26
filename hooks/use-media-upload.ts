import { useCallback } from "react";
import { useMediaWorker } from "@/contexts/media-worker-context";
import { addMediaItemToDB, type MediaItem } from "@/lib/offline/db";
import type { MediaWorkerIncomingMessage } from "@/utils/upload-worker-types";

export const useMediaUpload = () => {
  const { postMessage } = useMediaWorker();

  const uploadMedia = useCallback(
    async (id: string, item: MediaItem) => {
      await addMediaItemToDB(id, item);
      console.log("Save media into the local database");

      postMessage({
        action: "upload",
        id,
      } satisfies MediaWorkerIncomingMessage);
    },
    [postMessage],
  );

  return { uploadMedia };
};
