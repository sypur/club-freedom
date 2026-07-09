import { v } from "convex/values";
import { formEventSchema } from "@/convex/schema";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { type MutationCtx, type QueryCtx, query } from "./_generated/server";
import { mutation } from "./functions";
import { removeUndefinedFromRecord } from "./utils";

export async function getFormPreferenceByOrgIdAndName(
  ctx: QueryCtx,
  name: string,
  orgId: string,
) {
  const formPreference = await ctx.db
    .query("formPreferences")
    .withIndex("byOrganizationIdAndActivated", (q) =>
      q.eq("organizationId", orgId),
    )
    .filter((q) => q.eq(q.field("name"), name))
    .first();
  return formPreference;
}

export async function getActivatedFormPreferencesByOrgId(
  ctx: QueryCtx,
  orgId: string,
) {
  const formPreferences = await ctx.db
    .query("formPreferences")
    .withIndex("byOrganizationIdAndActivated", (q) =>
      q.eq("organizationId", orgId).eq("activated", true),
    )
    .collect();
  return formPreferences;
}

export const getActiveFormPreferenceByOrgId = query({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, { organizationId }) => {
    const formPreference = await getActivatedFormPreferencesByOrgId(
      ctx,
      organizationId,
    );
    return formPreference;
  },
});

export const getFormPreferenceByOrgId = query({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, { organizationId }) => {
    const canUpdateOrg = await ctx.runQuery(api.auth.checkUserPermissions, {
      permissions: {
        organization: ["update"],
      },
    });
    if (!canUpdateOrg) {
      throw new Error("Forbidden");
    }
    const formPreference = await ctx.db
      .query("formPreferences")
      .withIndex("byOrganizationIdAndActivated", (q) =>
        q.eq("organizationId", organizationId),
      )
      .order("desc")
      .collect();
    return formPreference;
  },
});

export const getFormPreferenceByIdAndOrgId = query({
  args: { id: v.string(), orgId: v.string() },
  handler: async (ctx, { id, orgId }) => {
    const formPreferenceId = ctx.db.normalizeId("formPreferences", id);

    if (!formPreferenceId) return null;
    const formPreference = await ctx.db.get(formPreferenceId);

    if (!formPreference || formPreference.organizationId !== orgId) {
      return null;
    }

    return formPreference;
  },
});

export const postFormPreference = mutation({
  args: {
    organizationId: v.string(),
    name: v.string(),
    branding: v.optional(v.string()),
    textInstructions: v.optional(v.string()),
    textEnabled: v.boolean(),
    audioInstructions: v.optional(v.string()),
    audioEnabled: v.boolean(),
    videoInstructions: v.optional(v.string()),
    videoEnabled: v.boolean(),
    agreements: v.optional(v.array(v.string())),
    formEvents: v.optional(v.array(formEventSchema)),
  },
  handler: async (
    ctx,
    {
      organizationId,
      name,
      branding,
      textInstructions,
      textEnabled,
      audioInstructions,
      audioEnabled,
      videoInstructions,
      videoEnabled,
      agreements,
      formEvents,
    },
  ) => {
    const canUpdateOrg = await ctx.runQuery(api.auth.checkUserPermissions, {
      permissions: {
        organization: ["update"],
      },
    });
    if (!canUpdateOrg) {
      throw new Error("Forbidden");
    }
    const existingPreference = await getFormPreferenceByOrgIdAndName(
      ctx,
      name,
      organizationId,
    );
    if (existingPreference) {
      throw new Error(
        "Another form preference with the same name already exists for this organization. Please choose a different name.",
      );
    }
    const id = await ctx.db.insert("formPreferences", {
      organizationId,
      name,
      branding,
      textInstructions,
      textEnabled,
      audioInstructions,
      audioEnabled,
      videoInstructions,
      videoEnabled,
      agreements,
      formEvents,
      activated: false,
    });
    return id;
  },
});

export const deleteFormPreference = mutation({
  args: { id: v.id("formPreferences") },
  handler: async (ctx, { id }) => {
    const canDelete = await ctx.runQuery(api.auth.checkUserPermissions, {
      permissions: { organization: ["delete"] },
    });
    if (!canDelete) {
      throw new Error("Form Preference Delete Forbidden");
    }
    await ctx.db.delete("formPreferences", id);
  },
});

export async function deactivateFormPreferences(
  ctx: MutationCtx,
  orgIds: Id<"formPreferences">[],
) {
  for (const orgId of orgIds) {
    await ctx.db.patch("formPreferences", orgId, { activated: false });
  }
}

export const activateFormPreference = mutation({
  args: { id: v.id("formPreferences"), organizationId: v.string() },
  handler: async (ctx, { id, organizationId }) => {
    const canUpdate = await ctx.runQuery(api.auth.checkUserPermissions, {
      permissions: { organization: ["update"] },
    });
    if (!canUpdate) {
      throw new Error("Form Preference Update Forbidden");
    }
    const activeFormPreferences = await getActivatedFormPreferencesByOrgId(
      ctx,
      organizationId,
    );
    await deactivateFormPreferences(
      ctx,
      activeFormPreferences.map((fp) => fp._id),
    );
    await ctx.db.patch(id, { activated: true });
  },
});

export const updateFormPreference = mutation({
  args: {
    _id: v.id("formPreferences"),
    name: v.optional(v.string()),
    branding: v.optional(v.string()),
    textInstructions: v.optional(v.string()),
    textEnabled: v.optional(v.boolean()),
    audioInstructions: v.optional(v.string()),
    audioEnabled: v.optional(v.boolean()),
    videoInstructions: v.optional(v.string()),
    videoEnabled: v.optional(v.boolean()),
    formEvents: v.optional(v.array(formEventSchema)),
    agreements: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const cleaned = removeUndefinedFromRecord(args);
    await ctx.db.patch(args._id, cleaned);
  },
});
