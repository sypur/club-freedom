/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ai from "../ai.js";
import type * as auth from "../auth.js";
import type * as email from "../email.js";
import type * as formPreferences from "../formPreferences.js";
import type * as functions from "../functions.js";
import type * as http from "../http.js";
import type * as internal_createUser from "../internal/createUser.js";
import type * as internal_organizations from "../internal/organizations.js";
import type * as libs_ai_summarize from "../libs/ai/summarize.js";
import type * as libs_posthog from "../libs/posthog.js";
import type * as media from "../media.js";
import type * as mediaProcessing from "../mediaProcessing.js";
import type * as migrations from "../migrations.js";
import type * as notification from "../notification.js";
import type * as organization from "../organization.js";
import type * as r2 from "../r2.js";
import type * as testimonials from "../testimonials.js";
import type * as uploadTempFile from "../uploadTempFile.js";
import type * as utils from "../utils.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  ai: typeof ai;
  auth: typeof auth;
  email: typeof email;
  formPreferences: typeof formPreferences;
  functions: typeof functions;
  http: typeof http;
  "internal/createUser": typeof internal_createUser;
  "internal/organizations": typeof internal_organizations;
  "libs/ai/summarize": typeof libs_ai_summarize;
  "libs/posthog": typeof libs_posthog;
  media: typeof media;
  mediaProcessing: typeof mediaProcessing;
  migrations: typeof migrations;
  notification: typeof notification;
  organization: typeof organization;
  r2: typeof r2;
  testimonials: typeof testimonials;
  uploadTempFile: typeof uploadTempFile;
  utils: typeof utils;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  r2: import("@convex-dev/r2/_generated/component.js").ComponentApi<"r2">;
  migrations: import("@convex-dev/migrations/_generated/component.js").ComponentApi<"migrations">;
  betterAuth: import("@/convex/betterAuth/_generated/component.js").ComponentApi<"betterAuth">;
  resend: import("@convex-dev/resend/_generated/component.js").ComponentApi<"resend">;
  posthog: import("@posthog/convex/_generated/component.js").ComponentApi<"posthog">;
};
