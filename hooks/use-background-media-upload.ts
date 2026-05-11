import { useCallback } from "react";
import { useMediaWorker } from "@/contexts/media-worker-context";
import { db, type MediaData } from "@/lib/offline/db";
import type { MediaWorkerIncomingMessage } from "@/utils/upload-worker-types";

export const useBackgroundMediaUpload = () => {
  const { postMessage } = useMediaWorker();

  const uploadMedia = useCallback(
    async (data: MediaData) => {
      await db.media.put(data);
      console.log("Save media into the local database");

      postMessage({
        action: "upload",
        id: data.id,
      } satisfies MediaWorkerIncomingMessage);
    },
    [postMessage],
  );

  return { uploadMedia };
};
