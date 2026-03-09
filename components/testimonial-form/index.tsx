import { useConvexMutation } from "@convex-dev/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import {
  ClientOnly,
  useLoaderData,
  useNavigate,
  useRouteContext,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "convex/react";
import { formatDistance } from "date-fns";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import Markdown from "react-markdown";
import { toast } from "sonner";
import { validateTurnstileTokenServerFn } from "@/app/functions/turnstile";
import { defaultAgreement } from "@/app/routes/o.$orgSlug/dashboard/form-preferences/-components/form/schema";
import {
  AudioRecorder,
  VideoRecorder,
} from "@/components/testimonial-form/recorder/index";
import TestimonialFormBlocker from "@/components/testimonial-form/testimonial-form-blocker";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { env } from "@/env/client";
import { useUploadFile } from "@/hooks/use-upload-file";
import {
  AUDIO_RECORDING_TIME_LIMIT_IN_SECONDS,
  VIDEO_RECORDING_TIME_LIMIT_IN_SECONDS,
} from "@/lib/media";
import { type Testimonial, testimonialSchema } from "@/lib/schema/testimonials";
import { cn } from "@/lib/utils";
export default function TestimonialForm() {
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });
  const { formPreferenceArray } = useLoaderData({
    from: "/o/$orgSlug/_public/",
  });

  const formPreference =
    formPreferenceArray && formPreferenceArray.length > 0
      ? formPreferenceArray[0]
      : null;

  const agreements =
    formPreference?.agreements && formPreference.agreements?.length > 0
      ? formPreference.agreements
      : [defaultAgreement];

  const textEnabled = !formPreference || formPreference.textEnabled;
  const audioEnabled = !formPreference || formPreference.audioEnabled;
  const videoEnabled = !formPreference || formPreference.videoEnabled;

  const form = useForm<Testimonial & { agreementsAccepted: string[] }>({
    defaultValues: {
      name: "",
      email: "",
      writtenText: "",
      agreementsAccepted: [],
      turnstileToken: "",
    },
    resolver: zodResolver(testimonialSchema),
  });

  const navigation = useNavigate();
  const uploadFile = useUploadFile();
  const generateUploadUrl = useConvexMutation(
    api.uploadTempFile.generateTempUploadUrl,
  );
  const postTestimonial = useMutation(api.testimonials.postTestimonial);
  const validateTurnstileToken = useServerFn(validateTurnstileTokenServerFn);

  const [tabValue, setTabValue] = useState(() => {
    if (videoEnabled) return "video";
    if (audioEnabled) return "audio";
    return "text";
  });

  const formatCount = [videoEnabled, audioEnabled, textEnabled].filter(
    Boolean,
  ).length;

  const handleTabChange = (value: string) => {
    setTabValue(value);
    form.resetField("mediaFile");
    form.resetField("writtenText");
  };

  const canSwitchTab =
    form.watch("mediaFile") == null && form.watch("writtenText") === "";

  const allAgreementsAccepted =
    form.watch("agreementsAccepted")?.length === agreements.length;

  async function onSubmit(
    values: Testimonial & { agreementsAccepted: string[] },
  ) {
    try {
      const isHuman = await validateTurnstileToken({
        data: { turnstileToken: values.turnstileToken },
      });

      if (!isHuman) throw new Error("Human verification failed");

      let storageId: string | undefined;
      let media_type = "text";

      if (values.mediaFile) {
        const { url, key } = await generateUploadUrl({
          organizationId: organization._id,
        });

        if (!key) throw new Error("Failed to generate media key");

        await uploadFile({ file: values.mediaFile, url, key });
        storageId = key;

        if (values.mediaFile.type.startsWith("audio")) {
          media_type = "audio";
        } else if (values.mediaFile.type.startsWith("video")) {
          media_type = "video";
        }
      }

      const id = await postTestimonial({
        name: values.name,
        email: values.email || undefined,
        storageId,
        media_type,
        text: values.writtenText,
        organizationId: organization._id as string,
      });

      form.reset();

      toast.success("Testimonial submitted successfully!", {
        description: "Thank you for your submission.",
      });

      await navigation({
        to: "/o/$orgSlug/testimonials/tmp/$id",
        params: { orgSlug: organization.slug, id },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";

      toast.error("Failed to submit testimonial", {
        description: message,
      });
    }
  }

  return (
    <FormProvider {...form}>
      <TestimonialFormBlocker />
      <div className="w-full max-w-lg">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  {...field}
                  placeholder="Jane"
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor={field.name}
                  className="flex items-baseline"
                >
                  Email <small>(optional)</small>
                </FieldLabel>
                <Input
                  {...field}
                  placeholder="name@example.com"
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Tabs value={tabValue} onValueChange={handleTabChange}>
            <TabsList className={cn(formatCount === 1 && "hidden")}>
              {videoEnabled && (
                <TabsTrigger value="video" disabled={!canSwitchTab}>
                  Video
                </TabsTrigger>
              )}
              {audioEnabled && (
                <TabsTrigger value="audio" disabled={!canSwitchTab}>
                  Audio
                </TabsTrigger>
              )}
              {textEnabled && (
                <TabsTrigger value="text" disabled={!canSwitchTab}>
                  Text
                </TabsTrigger>
              )}
            </TabsList>
            {textEnabled && (
              <TabsContent value="text">
                <Controller
                  control={form.control}
                  name="writtenText"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Written Testimonial
                      </FieldLabel>
                      <Textarea
                        {...field}
                        placeholder="Start typing..."
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </TabsContent>
            )}
            {audioEnabled && (
              <TabsContent value="audio">
                <Controller
                  control={form.control}
                  name="mediaFile"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Audio Testimonial
                      </FieldLabel>
                      <FieldDescription>
                        Please find a quiet place to record your audio
                        testimonial.
                      </FieldDescription>
                      <FieldDescription>
                        Time limit:{" "}
                        <strong>
                          {formatDistance(
                            0,
                            AUDIO_RECORDING_TIME_LIMIT_IN_SECONDS * 1000,
                          )}
                        </strong>
                      </FieldDescription>
                      <ClientOnly>
                        <AudioRecorder />
                      </ClientOnly>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </TabsContent>
            )}
            {videoEnabled && (
              <TabsContent value="video">
                <Controller
                  control={form.control}
                  name="mediaFile"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Video Testimonial
                      </FieldLabel>
                      <FieldDescription>
                        Please find a quiet place to record your video
                        testimonial.
                      </FieldDescription>
                      <FieldDescription>
                        Time limit:{" "}
                        <strong>
                          {formatDistance(
                            0,
                            VIDEO_RECORDING_TIME_LIMIT_IN_SECONDS * 1000,
                          )}
                        </strong>
                      </FieldDescription>
                      <ClientOnly>
                        <VideoRecorder />
                      </ClientOnly>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </TabsContent>
            )}
          </Tabs>
          <Controller
            control={form.control}
            name="agreementsAccepted"
            render={({ field, fieldState }) => {
              const selected = field.value || [];

              const toggle = (agreement: string, checked: boolean) => {
                if (checked) {
                  field.onChange([...selected, agreement]);
                } else {
                  field.onChange(selected.filter((a) => a !== agreement));
                }
              };

              return (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex flex-col gap-2">
                    {agreements.map((agreement, index) => {
                      const checked = selected.includes(agreement);

                      return (
                        <Field key={agreement} orientation="horizontal">
                          <Checkbox
                            id={`agreement-${index}`}
                            checked={checked}
                            onCheckedChange={(c) =>
                              toggle(agreement, Boolean(c))
                            }
                          />
                          <FieldContent>
                            <FieldLabel htmlFor={`agreement-${index}`}>
                              <Markdown
                                components={{
                                  a: ({ node, ...props }) => (
                                    <a
                                      {...props}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-primary underline"
                                    />
                                  ),
                                }}
                              >
                                {agreement}
                              </Markdown>
                            </FieldLabel>
                          </FieldContent>
                        </Field>
                      );
                    })}
                  </div>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />

          <Controller
            control={form.control}
            name="turnstileToken"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Turnstile
                  siteKey={env.VITE_TURNSTILE_SITE_KEY}
                  onSuccess={(token) => field.onChange(token)}
                  onExpire={() => form.resetField("turnstileToken")}
                  options={{ size: "flexible" }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button
            type="submit"
            disabled={form.formState.isSubmitting || !allAgreementsAccepted}
          >
            {form.formState.isSubmitting && <Spinner />}
            {form.formState.isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>
    </FormProvider>
  );
}
