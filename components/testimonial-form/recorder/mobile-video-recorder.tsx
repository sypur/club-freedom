import { useOrientation } from "@uidotdev/usehooks";
import { RefreshCcw, Square, Video } from "lucide-react";
import { useState } from "react";
import { useController } from "react-hook-form";
import { useReactMediaRecorder } from "react-media-recorder";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
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
    facingMode: "user",
  },
  audio: true,
} satisfies MediaStreamConstraints;

export default function MobileVideoRecorder({ type, mimeType }: MediaConfig) {
  const { field } = useController<Testimonial>({
    name: "media",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [previewMediaStream, setPreviewMediaStream] =
    useState<MediaStream | null>(null);
  const orientation = useOrientation();

  const {
    startRecording,
    stopRecording,
    clearBlobUrl,
    status,
    mediaBlobUrl,
    error,
    previewStream,
  } = useReactMediaRecorder({
    ...MEDIA_CONSTRAINTS,
    blobPropertyBag: { type },
    mediaRecorderOptions: {
      mimeType,
      audioBitsPerSecond: 128000, // 128 kbps
      videoBitsPerSecond: 2500000, // 2.5 Mbps
    },
    onStop: (_, blob) => {
      console.log("File size:", blob.size / (1024 * 1024), "MB");
      field.onChange(blob);
      setIsOpen(false);
    },
  });

  const isRecording = status === "recording";

  const handleOpenCamera = async () => {
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia(MEDIA_CONSTRAINTS);
      setPreviewMediaStream(stream);
      setIsOpen(true);
    } catch (err) {
      console.error("Failed to get media stream:", err);
    }
  };

  const handleCloseDialog = (open: boolean) => {
    if (!open) {
      // Clean up preview stream when closing
      if (previewMediaStream) {
        previewMediaStream.getTracks().forEach((track) => void track.stop());
        setPreviewMediaStream(null);
      }
    }
    setIsOpen(open);
  };

  const handleStartRecording = () => {
    startRecording();
    // Clean up preview stream after recording starts
    // The recording stream will take over immediately
    if (previewMediaStream) {
      setTimeout(() => {
        previewMediaStream.getTracks().forEach((track) => void track.stop());
        setPreviewMediaStream(null);
      }, 100);
    }
  };

  const isLandscape = orientation.type.startsWith("landscape");

  if (isLandscape) {
    return (
      <div className="flex flex-col p-4 border items-center rounded-lg gap-4 w-full">
        <RefreshCcw />
        Please use your device in portrait mode for video testimonial service.
      </div>
    );
  }

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

  return (
    <div className="flex flex-col p-4 border items-center rounded-lg gap-4 w-full">
      {!isRecording && mediaBlobUrl && (
        <video controls src={mediaBlobUrl} playsInline className="w-full" />
      )}
      <div className="flex items-center gap-3">
        <Button type="button" onClick={handleOpenCamera}>
          Open camera
        </Button>
        {mediaBlobUrl && (
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

      <AlertDialog open={isOpen} onOpenChange={handleCloseDialog}>
        <AlertDialogContent className="rounded-none max-w-screen h-screen px-0">
          <div className="relative">
            <AlertDialogHeader className="p-6 bg-foreground/80 text-background absolute top-0 inset-x-0 z-20">
              <AlertDialogDescription className="text-background text-balance">
                Please record your testimonial video. Make sure you are in a
                quiet environment with good lighting.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="absolute inset-0 bg-black content-center">
              {(isRecording ? previewStream : previewMediaStream) ? (
                <video
                  autoPlay
                  ref={(ref) => {
                    if (ref) {
                      // Use recording stream when recording, preview stream otherwise
                      ref.srcObject = isRecording
                        ? previewStream
                        : previewMediaStream;
                    }
                  }}
                  muted
                  playsInline
                  className="w-full"
                />
              ) : (
                <div className="w-full"></div>
              )}
            </div>
            <AlertDialogFooter className="flex flex-row items-center justify-between absolute bottom-0 left-0 right-0 z-20 p-6 bg-foreground/80 text-background">
              <RecorderTimer
                isRecording={isRecording}
                limit={VIDEO_RECORDING_TIME_LIMIT_IN_SECONDS}
                onTimeout={stopRecording}
              />
              {!isRecording ? (
                <Button
                  size="icon"
                  className="size-12 rounded-full"
                  type="button"
                  onClick={handleStartRecording}
                >
                  <Video className="size-6" />
                </Button>
              ) : (
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
              <Button
                type="button"
                variant="ghost"
                disabled={isRecording}
                onClick={() => handleCloseDialog(false)}
              >
                Close
              </Button>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
