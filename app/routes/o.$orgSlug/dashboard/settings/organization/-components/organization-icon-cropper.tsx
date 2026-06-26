import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouteContext, useRouter } from "@tanstack/react-router";
import {
  ArrowLeftIcon,
  ImageIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Cropper,
  CropperCropArea,
  CropperDescription,
  CropperImage,
} from "@/components/ui/cropper";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { api } from "@/convex/_generated/api";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useUploadFile } from "@/hooks/use-upload-file";
import { authClient } from "@/lib/auth/auth-client";
import { type Area, createFileFromImageBlob, getCroppedImg } from "@/lib/image";

export default function OrganizationIconCropper() {
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });

  const [{ files }, { openFileDialog, removeFile, getInputProps }] =
    useFileUpload({
      accept: "image/*",
    });

  const previewUrl = files[0]?.preview || null;
  const fileId = files[0]?.id;

  const [imageBlob, setImageBlob] = useState<Blob | null>();
  const [finalImageUrl, setFinalImageUrl] = useState<string | null>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Ref to track the previous file ID to detect new uploads
  const previousFileIdRef = useRef<string | undefined | null>(null);

  // State to store the desired crop area in pixels
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // State for zoom level
  const [zoom, setZoom] = useState(1);

  // Callback for Cropper to provide crop data - Wrap with useCallback
  const handleCropChange = useCallback((pixels: Area | null) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleApply = async () => {
    // Check if we have the necessary data
    if (!previewUrl || !fileId || !croppedAreaPixels) {
      console.error("Missing data for apply:", {
        croppedAreaPixels,
        fileId,
        previewUrl,
      });
      // Remove file if apply is clicked without crop data?
      if (fileId) {
        removeFile(fileId);
        setCroppedAreaPixels(null);
      }
      return;
    }

    try {
      // 1. Get the cropped image blob using the helper
      const croppedBlob = await getCroppedImg(previewUrl, croppedAreaPixels);
      setImageBlob(croppedBlob);

      if (!croppedBlob) {
        throw new Error("Failed to generate cropped image blob.");
      }

      // 2. Create a NEW object URL from the cropped blob
      const newFinalUrl = URL.createObjectURL(croppedBlob);

      // 3. Revoke the OLD finalImageUrl if it exists
      if (finalImageUrl) {
        URL.revokeObjectURL(finalImageUrl);
      }

      // 4. Set the final avatar state to the NEW URL
      setFinalImageUrl(newFinalUrl);

      // 5. Close the dialog (don't remove the file yet)
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error during apply:", error);
      // Close the dialog even if cropping fails
      setIsDialogOpen(false);
    }
  };

  const handleRemoveFinalImage = () => {
    if (finalImageUrl) {
      URL.revokeObjectURL(finalImageUrl);
    }
    setFinalImageUrl(null);
  };

  useEffect(() => {
    const currentFinalUrl = finalImageUrl;
    // Cleanup function
    return () => {
      if (currentFinalUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(currentFinalUrl);
      }
    };
  }, [finalImageUrl]);

  const displayUrl = finalImageUrl || organization.icon;

  // Effect to open dialog when a *new* file is ready
  useEffect(() => {
    // Check if fileId exists and is different from the previous one
    if (fileId && fileId !== previousFileIdRef.current) {
      setIsDialogOpen(true); // Open dialog for the new file
      setCroppedAreaPixels(null); // Reset crop area for the new file
      setZoom(1); // Reset zoom for the new file
    }
    // Update the ref to the current fileId for the next render
    previousFileIdRef.current = fileId;
  }, [fileId]); // Depend only on fileId

  const generateUploadUrl = useConvexMutation(
    api.organization.generateIconUploadUrl,
  );
  const uploadFile = useUploadFile();
  const queryClient = useQueryClient();
  const organizationQuery = convexQuery(
    api.organization.getOrganizationBySlug,
    {
      slug: organization.slug,
    },
  );
  const router = useRouter();

  const { mutate: updateIcon, isPending } = useMutation({
    mutationFn: async (blob: Blob) => {
      const { _id: organizationId } = organization;
      const file = createFileFromImageBlob(organizationId, blob);
      const { url, key, storageUrl } = await generateUploadUrl({
        organizationId,
        oldUrl: organization.icon || undefined,
      });
      await uploadFile({ file, url, key });
      const { error } = await authClient.organization.update({
        organizationId,
        data: {
          icon: storageUrl,
        },
      });
      if (error) {
        throw error;
      }
    },
    onSuccess: async () => {
      toast.success("Icon updated successfully");
      await queryClient.invalidateQueries(organizationQuery);
      await queryClient.ensureQueryData(organizationQuery);
      await router.invalidate();
      handleRemoveFinalImage();
    },
    onError: (error) => {
      toast.error("Failed to update icon", {
        description: error.message,
      });
    },
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Drop area - uses finalImageUrl */}
      <div className="relative flex size-32 place-items-center mx-auto justify-center overflow-hidden rounded-lg border-2 border-input border-dashed">
        {displayUrl ? (
          <img
            alt={finalImageUrl ? "Preview" : "Current Icon"}
            className="size-full object-cover bg-transparent"
            height={64}
            src={displayUrl}
            style={{ objectFit: "cover" }}
            width={64}
          />
        ) : (
          <div aria-hidden="true">
            <ImageIcon className="size-8" />
          </div>
        )}
      </div>

      <div className="inline-flex gap-2">
        <Button onClick={openFileDialog} variant="outline">
          {displayUrl ? "Update Icon" : "Upload Icon"}
        </Button>
        <Button
          disabled={!finalImageUrl}
          onClick={handleRemoveFinalImage}
          variant="destructive"
        >
          Reset
        </Button>
        <Button
          onClick={async () => {
            if (imageBlob) {
              updateIcon(imageBlob);
            }
          }}
          disabled={!finalImageUrl || isPending}
        >
          {isPending ? "Saving..." : "Save"}
        </Button>
      </div>

      <input
        {...getInputProps()}
        aria-label="Upload image file"
        className="sr-only"
        tabIndex={-1}
      />

      {/* Cropper Dialog - Use isDialogOpen for open prop */}
      <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
        <DialogContent className="gap-0 p-0 sm:max-w-140 *:[button]:hidden">
          <DialogDescription className="sr-only">
            Crop image dialog
          </DialogDescription>
          <DialogHeader className="contents space-y-0 text-left">
            <DialogTitle className="flex items-center justify-between border-b p-4 text-base">
              <div className="flex items-center gap-2">
                <Button
                  aria-label="Cancel"
                  className="-my-1 opacity-60"
                  onClick={() => setIsDialogOpen(false)}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <ArrowLeftIcon aria-hidden="true" />
                </Button>
                <span>Crop image</span>
              </div>
              <Button
                autoFocus
                className="-my-1"
                disabled={!previewUrl}
                onClick={handleApply}
              >
                Apply
              </Button>
            </DialogTitle>
          </DialogHeader>
          {previewUrl && (
            <Cropper
              className="h-96 sm:h-120"
              image={previewUrl}
              onCropChange={handleCropChange}
              onZoomChange={setZoom}
              zoom={zoom}
            >
              <CropperDescription />
              <CropperImage />
              <CropperCropArea />
            </Cropper>
          )}
          <DialogFooter className="border-t px-4 py-6">
            <div className="mx-auto flex w-full max-w-80 items-center gap-4">
              <ZoomOutIcon
                aria-hidden="true"
                className="shrink-0 opacity-60"
                size={16}
              />
              <Slider
                aria-label="Zoom slider"
                defaultValue={[1]}
                max={3}
                min={1}
                onValueChange={(value) => setZoom(value[0])}
                step={0.1}
                value={[zoom]}
              />
              <ZoomInIcon
                aria-hidden="true"
                className="shrink-0 opacity-60"
                size={16}
              />
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
