import { ffmpeg } from "@trigger.dev/build/extensions/core";
import { defineConfig } from "@trigger.dev/sdk";

export default defineConfig({
  // Automatically configure with TRIGGER_PROJECT_REF env variable
  project: "",

  // Directories containing your tasks
  dirs: ["./trigger"], // Customize based on your project structure

  // Retry configuration
  retries: {
    enabledInDev: false, // Enable retries in development
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },

  // Build configuration (optional)
  build: {
    extensions: [ffmpeg()], // Build extensions go here
    external: [
      "fluent-ffmpeg",
      "@aws-sdk/client-s3",
      "openai",
      "convex/browser",
      "convex/server",
      "posthog-node",
    ],
  },

  machine: "medium-2x", //remove this while testing locally
  runtime: "node-22",
  // Max duration of a task in seconds
  maxDuration: 3600,
});
