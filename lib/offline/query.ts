import { queryOptions } from "@tanstack/react-query";
import { getMediaById } from "./db";

export function offlineMediaQuery(id: string) {
  return queryOptions({
    queryKey: ["offlineMedia", { id }],
    queryFn: async () => {
      const media = await getMediaById(id);
      if (!media) {
        return null;
      }

      return {
        ...media,
        url: URL.createObjectURL(media.blob),
      };
    },
    staleTime: Infinity,
  });
}
