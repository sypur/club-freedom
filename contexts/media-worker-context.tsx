import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
} from "react";
import { useUploadProgressStore } from "@/lib/offline/upload-progress-store";
import type {
  MediaWorkerIncomingMessage,
  MediaWorkerOutgoingMessage,
} from "@/utils/upload-worker-types";

interface MediaWorkerContextType {
  worker: Worker | null;
  postMessage: (message: MediaWorkerIncomingMessage) => void;
}

const MediaWorkerContext = createContext<MediaWorkerContextType | null>(null);

export function MediaWorkerProvider({ children }: { children: ReactNode }) {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/upload.worker.ts", import.meta.url),
      { type: "module" },
    );

    // Retry any pending uploads on app mount
    workerRef.current?.postMessage({
      action: "retry",
    } satisfies MediaWorkerIncomingMessage);

    workerRef.current?.addEventListener(
      "message",
      (e: MessageEvent<MediaWorkerOutgoingMessage>) => {
        const message = e.data;
        switch (message.action) {
          case "progress":
            useUploadProgressStore
              .getState()
              .setProgress(message.id, message.progress);
            break;
          case "done":
            useUploadProgressStore.getState().removeProgress(message.id);
            break;
        }
      },
    );

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const postMessage = (message: MediaWorkerIncomingMessage) => {
    workerRef.current?.postMessage(message);
  };

  return (
    <MediaWorkerContext.Provider
      value={{ worker: workerRef.current, postMessage }}
    >
      {children}
    </MediaWorkerContext.Provider>
  );
}

export function useMediaWorker() {
  const context = useContext(MediaWorkerContext);
  if (!context) {
    throw new Error("useMediaWorker must be used within MediaWorkerProvider");
  }
  return context;
}
