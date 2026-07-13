import migration from "@convex-dev/migrations/convex.config";
import r2 from "@convex-dev/r2/convex.config";
import resend from "@convex-dev/resend/convex.config";
import posthog from "@posthog/convex/convex.config.js";
import { defineApp } from "convex/server";
import { v } from "convex/values";
import betterAuth from "@/convex/betterAuth/convex.config";

const app = defineApp({
  env: {
    // General
    SITE_URL: v.string(),

    // Better Auth
    BETTER_AUTH_SECRET: v.string(),

    // Resend
    AUTH_EMAIL: v.string(),
    RESEND_API_KEY: v.string(),

    // AI
    GROQ_API_KEY: v.string(),
    AI_GATEWAY_ENDPOINT: v.string(),
    AI_GATEWAY_API_TOKEN: v.string(),

    // PostHog
    POSTHOG_PROJECT_TOKEN: v.string(),
    POSTHOG_HOST: v.optional(v.string()),
    POSTHOG_PERSONAL_API_KEY: v.optional(v.string()),
    POSTHOG_FLAGS_POLLING_INTERVAL_SECONDS: v.optional(v.string()),

    // R2
    R2_PUBLIC_URL: v.string(),
    R2_TOKEN: v.string(),
    R2_ACCESS_KEY_ID: v.string(),
    R2_SECRET_ACCESS_KEY: v.string(),
    R2_ENDPOINT: v.string(),
    R2_BUCKET: v.string(),

    // Trigger.dev
    TRIGGER_SECRET_KEY: v.string(),
  },
});

app.use(r2);
app.use(migration);
app.use(betterAuth);
app.use(resend);
app.use(posthog, {
  env: {
    POSTHOG_PROJECT_TOKEN: app.env.POSTHOG_PROJECT_TOKEN,
    POSTHOG_HOST: app.env.POSTHOG_HOST,
    POSTHOG_PERSONAL_API_KEY: app.env.POSTHOG_PERSONAL_API_KEY,
    POSTHOG_FLAGS_POLLING_INTERVAL_SECONDS:
      app.env.POSTHOG_FLAGS_POLLING_INTERVAL_SECONDS,
  },
});

export default app;
