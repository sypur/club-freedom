import { useLiveQuery } from "dexie-react-hooks";
import { AlertCircleIcon } from "lucide-react";
import { useTestimonialContext } from "@/contexts/testimonial-context";
import { db } from "@/lib/offline/db";
import { useUploadProgressStore } from "@/lib/offline/upload-progress-store";
import { Item, ItemContent, ItemMedia, ItemTitle } from "../ui/item";
import { Spinner } from "../ui/spinner";

export default function TestimonialUploadProgress() {
  const { testimonial } = useTestimonialContext();
  const data = useLiveQuery(() => db.media.get(testimonial._id));
  const uploadProgress = useUploadProgressStore(
    (state) => state.uploadProgress[testimonial._id] || 0,
  );

  if (data?.status === "error") {
    return (
      <Item variant="muted">
        <ItemMedia>
          <AlertCircleIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>
            Error uploading {testimonial.media_type} to the server
          </ItemTitle>
        </ItemContent>
      </Item>
    );
  }

  if (data?.status === "uploading") {
    return (
      <Item variant="muted">
        <ItemMedia>
          <Spinner />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>
            Uploading media ({Math.round(uploadProgress * 100)} %)...
          </ItemTitle>
        </ItemContent>
      </Item>
    );
  }
}
