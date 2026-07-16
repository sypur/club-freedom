import migration from "@convex-dev/migrations/convex.config";
import r2 from "@convex-dev/r2/convex.config";
import resend from "@convex-dev/resend/convex.config";
import { defineApp } from "convex/server";
import betterAuth from "@/convex/betterAuth/convex.config";

const app = defineApp();
app.use(r2);
app.use(migration);
app.use(betterAuth);
app.use(resend);
export default app;
