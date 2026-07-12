import migration from "@convex-dev/migrations/convex.config";
import r2 from "@convex-dev/r2/convex.config";
import resend from "@convex-dev/resend/convex.config";
import { defineApp } from "convex/server";
import betterAuth from "@/convex/betterAuth/convex.config";
import { v } from "convex/values";
import posthog from "@posthog/convex/convex.config.js"

const app = defineApp({
  env: {
    SITE_URL: v.string(),
    BETTER_AUTH_SECRET: v.string(),
    AUTH_EMAIL: v.string(),
    R2_PUBLIC_URL: v.string(),
    GROQ_API_KEY: v.string(),
    AI_GATEWAY_ENDPOINT: v.string(),
    AI_GATEWAY_API_TOKEN: v.string(),

    POSTHOG_PROJECT_TOKEN: v.string(),
    POSTHOG_HOST: v.optional(v.string()),
    POSTHOG_PERSONAL_API_KEY: v.optional(v.string()),
    POSTHOG_FLAGS_POLLING_INTERVAL_SECONDS: v.optional(v.string()),
  }
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
    POSTHOG_FLAGS_POLLING_INTERVAL_SECONDS: app.env.POSTHOG_FLAGS_POLLING_INTERVAL_SECONDS,
  }
})

export default app;
