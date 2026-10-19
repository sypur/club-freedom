import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useUploadProgressStore } from "@/lib/offline/upload-progress-store";
import type {
  MediaWorkerIncomingMessage,
  MediaWorkerOutgoingMessage,
} from "@/utils/upload-worker-types";

interface MediaWorkerContextType {
  postMessage: (message: MediaWorkerIncomingMessage) => void;
}

const MediaWorkerContext = createContext<MediaWorkerContextType | null>(null);

export function MediaWorkerProvider({ children }: { children: ReactNode }) {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const worker = new Worker(
      new URL("../workers/upload.worker.ts", import.meta.url),
      { type: "module" },
    );
    workerRef.current = worker;

    worker.addEventListener(
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

    // Retry any pending uploads on app mount
    worker.postMessage({
      action: "retry",
    } satisfies MediaWorkerIncomingMessage);

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const postMessage = useCallback((message: MediaWorkerIncomingMessage) => {
    workerRef.current?.postMessage(message);
  }, []);

  const value = useMemo(() => ({ postMessage }), [postMessage]);

  return (
    <MediaWorkerContext.Provider value={value}>
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
