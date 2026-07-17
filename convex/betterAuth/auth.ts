import { createAuth } from "../auth";

/**
 * NOTE: This file should only have your auth export for schema generation, and no other code.
 * If this file is imported at runtime it will trigger errors due to missing environment variables.
 *
 * https://labs.convex.dev/better-auth/migrations/migrate-to-0-10#remove-getstaticauth
 * biome-ignore  lint: expected any
 */
export const auth = createAuth({} as any);
