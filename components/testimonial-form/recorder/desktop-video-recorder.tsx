import { Square, Video } from "lucide-react";
import { useController } from "react-hook-form";
import { useReactMediaRecorder } from "react-media-recorder";
import { Button } from "@/components/ui/button";
import {
  type MediaConfig,
  VIDEO_RECORDING_TIME_LIMIT_IN_SECONDS,
} from "@/lib/media";
import type { Testimonial } from "@/lib/schema/testimonials";
import RecorderTimer from "./recorder-timer";

const MEDIA_CONSTRAINTS = {
  video: {
    frameRate: {
      ideal: 24,
      max: 30,
    },
    width: { ideal: 1280, min: 1280, max: 1920 },
    height: { ideal: 720, min: 720, max: 1080 },
  },
  audio: true,
} satisfies MediaStreamConstraints;

export default function DesktopVideoRecorder({ type, mimeType }: MediaConfig) {
  const { field } = useController<Testimonial>({
    name: "media",
  });

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    clearBlobUrl,
    previewStream,
    error,
  } = useReactMediaRecorder({
    ...MEDIA_CONSTRAINTS,
    blobPropertyBag: { type },
    mediaRecorderOptions: {
      mimeType,
      audioBitsPerSecond: 128_000, // 128 kbps
      videoBitsPerSecond: 2_500_000, // 2.5 Mbps
    },
    onStop: (_, blob) => {
      console.log("File size:", blob.size / (1024 * 1024), "MB");
      field.onChange(blob);
    },
  });

  if (error || status === "permission_denied") {
    return (
      <div className="flex flex-col p-4 border items-center rounded-lg gap-4 w-full">
        <div className="text-center text-destructive">
          <p className="font-semibold">Camera access denied or unavailable</p>
          <p className="text-sm mt-2">
            {window.location.protocol === "http:" &&
            !window.location.hostname.includes("localhost")
              ? "Camera access requires HTTPS or localhost. Try accessing via localhost or enable HTTPS."
              : "Please allow camera access and try again."}
          </p>
        </div>
      </div>
    );
  }

  const isRecording = status === "recording";

  return (
    <div className="flex flex-col p-4 border items-center rounded-lg gap-4 w-full">
      {/* Video Preview */}
      {isRecording && (
        <div className="relative">
          <RecorderTimer
            limit={VIDEO_RECORDING_TIME_LIMIT_IN_SECONDS}
            isRecording={isRecording}
            onTimeout={stopRecording}
            className="absolute top-2 left-2"
          />
          <video
            autoPlay
            ref={(ref) => {
              if (ref) {
                ref.srcObject = previewStream;
              }
            }}
            muted
            playsInline
            className="w-full"
          />
        </div>
      )}

      {/* Video Playback */}
      {!isRecording && mediaBlobUrl && (
        <video controls src={mediaBlobUrl} className="w-full" />
      )}

      {/* Controls */}
      <div className="flex items-center gap-3">
        {!isRecording && (
          <Button
            size="icon"
            className="size-12 rounded-full"
            type="button"
            onClick={startRecording}
          >
            <Video className="size-6" />
          </Button>
        )}
        {isRecording && (
          <Button
            size="icon"
            className="size-12 rounded-full"
            variant="destructive"
            type="button"
            onClick={stopRecording}
          >
            <Square className="size-6" />
          </Button>
        )}

        {mediaBlobUrl && !isRecording && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              clearBlobUrl();
              field.onChange(undefined);
            }}
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
