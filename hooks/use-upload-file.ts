import { useMutation } from "convex/react";
import { useCallback } from "react";
import { api } from "@/convex/_generated/api";

type Args = {
  file: File;
  url: string;
  key: string;
};

export function useUploadFile() {
  const syncMetadata = useMutation(api.r2.syncMetadata);

  return useCallback(
    async ({ file, url, key }: Args) => {
      try {
        const result = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });
        if (!result.ok) {
          throw new Error(`Failed to upload image: ${result.statusText}`);
        }
      } catch (error) {
        throw new Error("Failed to upload image", { cause: error });
      }
      await syncMetadata({ key });
    },
    [syncMetadata],
  );
}
