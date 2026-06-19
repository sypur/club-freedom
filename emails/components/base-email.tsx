import React from "react";
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  pixelBasedPreset,
  Tailwind,
} from "react-email";

export interface BaseEmailProps {
  children: React.ReactNode;
  previewText: string;
}

export function BaseEmail({ children, previewText }: BaseEmailProps) {
  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                background: "#ffffff",
                foreground: "#0a0a0a",
                accent: "#f5f5f5",
                primary: "#171717",
                "primary-foreground": "#fafafa",
                "accent-foreground": "#171717",
                border: "#e5e5e5",
                muted: "#f5f5f5",
                "muted-foreground": "#171717",
              },
            },
          },
        }}
      >
        <Body className="bg-muted font-sans font-14 mx-auto p-0">
          <Preview>{previewText}</Preview>
          <Container className="mx-auto h-full bg-background text-foreground max-w-120">
            {children}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
