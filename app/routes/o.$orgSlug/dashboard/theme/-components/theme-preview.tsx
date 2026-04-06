import { useRouteContext } from "@tanstack/react-router";
import { Mic, Video } from "lucide-react";
import type { ComponentProps, CSSProperties } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Theme } from "./form/schema";

export default function ThemePreview({
  className,
  ...props
}: ComponentProps<"div">) {
  const form = useFormContext<Theme>();
  const style = form.watch() as CSSProperties;
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });

  return (
    <div
      className={cn(
        "px-4 py-16 bg-background flex flex-col gap-4 max-w-lg mx-auto",
        className,
      )}
      style={{
        ...style,
      }}
      {...props}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold">
          Welcome to <span className="text-primary">{organization.name}</span>{" "}
          Testimonial
        </h1>
        <p className="mt-4 text-lg">Please share your testimonial with us!</p>
        <p className="mt-4 italic text-lg text-muted-foreground">
          "Let your light shine before others" – Matthew 5:16
        </p>
      </div>
      <Field>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <Input placeholder="Jane" id="name" />
      </Field>
      <Field>
        <FieldLabel htmlFor="email">
          Email <small>(optional)</small>
        </FieldLabel>
        <Input placeholder="name@example.com" id="email" />
      </Field>
      <Tabs defaultValue="video">
        <TabsList>
          <TabsTrigger value="video">Video</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
        </TabsList>
        <TabsContent value="video">
          <Field>
            <FieldLabel>Video testimonial</FieldLabel>
            <FieldDescription>
              Please find quiet place to record your testimonial
            </FieldDescription>
            <div className="p-4 border rounded-lg flex justify-center">
              <Button size="icon-lg" className="rounded-full size-12">
                <Video className="size-6" />
              </Button>
            </div>
          </Field>
        </TabsContent>
        <TabsContent value="audio">
          <Field>
            <FieldLabel>Audio testimonial</FieldLabel>
            <FieldDescription>
              Please find quiet place to record your testimonial
            </FieldDescription>
            <div className="p-4 border rounded-lg flex justify-center">
              <Button size="icon-lg" className="rounded-full size-12">
                <Mic className="size-6" />
              </Button>
            </div>
          </Field>
        </TabsContent>
        <TabsContent value="text">
          <Field>
            <FieldLabel htmlFor="text">Text testimonial</FieldLabel>
            <Textarea placeholder="Start typing..." id="text" />
          </Field>
        </TabsContent>
      </Tabs>
      <Field orientation="horizontal">
        <Checkbox id="agreement" />
        <FieldContent>
          <FieldLabel>
            I agree with the{" "}
            <span className="underline text-primary cursor-pointer">
              terms and conditions
            </span>
          </FieldLabel>
        </FieldContent>
      </Field>
      <Button>Submit</Button>
    </div>
  );
}
