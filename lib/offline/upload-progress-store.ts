import { create } from "zustand";

interface UploadProgressStore {
  uploadProgress: Record<string, number>;
  setProgress: (id: string, progress: number) => void;
  removeProgress: (id: string) => void;
}

export const useUploadProgressStore = create<UploadProgressStore>((set) => ({
  uploadProgress: {},
  setProgress: (id, progress) =>
    set((state) => ({
      uploadProgress: { ...state.uploadProgress, [id]: progress },
    })),
  removeProgress: (id) =>
    set((state) => {
      const { [id]: _, ...rest } = state.uploadProgress;
      return { uploadProgress: rest };
    }),
}));
