import migration from "@convex-dev/migrations/convex.config";
import r2 from "@convex-dev/r2/convex.config";
import resend from "@convex-dev/resend/convex.config";
import { defineApp } from "convex/server";
import betterAuth from "@/convex/betterAuth/convex.config";
import { v } from "convex/values";

const app = defineApp({
  env: {
    SITE_URL: v.string(),
    BETTER_AUTH_SECRET: v.string(),
    AUTH_EMAIL: v.string(),
    R2_PUBLIC_URL: v.string(),
    GROQ_API_KEY: v.string(),
    AI_GATEWAY_ENDPOINT: v.string(),
    AI_GATEWAY_API_TOKEN: v.string(),
  }
});

app.use(r2);
app.use(migration);
app.use(betterAuth);
app.use(resend);

export default app;
