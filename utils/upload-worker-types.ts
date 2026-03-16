export type MediaWorkerIncomingMessage = UploadMessage | RetryMessage;

type UploadMessage = {
  action: "upload";
  id: string;
};

type RetryMessage = {
  action: "retry";
};

export type MediaWorkerOutgoingMessage = ProgressMessage | DoneMessage;

type ProgressMessage = {
  action: "progress";
  progress: number;
  id: string;
};

type DoneMessage = {
  action: "done";
  id: string;
};
