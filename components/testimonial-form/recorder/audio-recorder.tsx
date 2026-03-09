import { Mic, Square } from "lucide-react";
import { useController } from "react-hook-form";
import { ReactMediaRecorder } from "react-media-recorder";
import { Button } from "@/components/ui/button";
import { AUDIO_RECORDING_TIME_LIMIT_IN_SECONDS } from "@/lib/media";
import type { Testimonial } from "@/lib/schema/testimonials";
import RecorderTimer from "./recorder-timer";

export default function AudioRecorder() {
  const mp4Supported = MediaRecorder.isTypeSupported("audio/mp4");
  const { field } = useController<Testimonial>({
    name: "media",
  });

  return (
    <ReactMediaRecorder
      audio
      blobPropertyBag={{
        type: mp4Supported ? "audio/mp4" : "audio/webm",
      }}
      mediaRecorderOptions={{
        mimeType: mp4Supported ? "audio/mp4" : "audio/webm",
      }}
      onStop={(_, blob) => {
        field.onChange(blob);
      }}
      render={({
        status,
        startRecording,
        stopRecording,
        mediaBlobUrl,
        clearBlobUrl,
      }) => {
        const isRecording = status === "recording";

        return (
          <div className="flex flex-col p-4 border items-center rounded-lg gap-4 w-full">
            {/* Audio Preview */}
            {!isRecording && mediaBlobUrl && (
              <audio
                src={mediaBlobUrl}
                controls
                controlsList="nodownload"
                className="w-full object-cover"
              />
            )}

            {isRecording && (
              <RecorderTimer
                isRecording={isRecording}
                limit={AUDIO_RECORDING_TIME_LIMIT_IN_SECONDS}
                onTimeout={stopRecording}
              />
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
                  <Mic className="size-6" />
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
      }}
    />
  );
}
