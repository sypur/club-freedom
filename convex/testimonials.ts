import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { filter } from "convex-helpers/server/filter";
import { api } from "./_generated/api";
import { query } from "./_generated/server";
import { mutation } from "./functions";
import { processingStatusSchema } from "./schema";
import removeUndefinedFromRecord from "./utils";

export const getTestimonials = query({
  args: {
    paginationOpts: paginationOptsValidator,
    searchQuery: v.optional(v.string()),
    orgId: v.string(),
    filters: v.optional(
      v.object({
        author: v.optional(v.string()),
        types: v.optional(v.array(v.string())),
        before: v.optional(v.float64()),
        after: v.optional(v.float64()),
        statuses: v.optional(
          v.array(
            v.union(
              v.literal("pending"),
              v.literal("published"),
              v.literal("not-published"),
            ),
          ),
        ),
      }),
    ),
    order: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
  },
  handler: async (
    ctx,
    { paginationOpts, searchQuery = "", filters = {}, order, orgId },
  ) => {
    const trimmedQuery = searchQuery.trim();
    const testimonialQuery = ctx.db.query("testimonials");

    const completeTestimonialQuery =
      trimmedQuery !== "" && !order
        ? testimonialQuery.withSearchIndex("search_posts", (q) =>
            q

              .search("searchText", trimmedQuery)
              .eq("processingStatus", "completed")
              .eq("organizationId", orgId),
          )
        : testimonialQuery
            .withIndex("by_processingStatus_and_organizationId", (q) =>
              q.eq("processingStatus", "completed").eq("organizationId", orgId),
            )
            .order(order || "desc");

    const canView = await ctx.runQuery(api.auth.checkUserPermissions, {
      permissions: {
        testimonial: ["view"],
      },
    });

    const readyTestimonialQuery = completeTestimonialQuery.filter((q) =>
      !canView
        ? q.eq(q.field("approved"), true)
        : filters.statuses && filters.statuses.length > 0
          ? q.or(
              filters.statuses.includes("pending") &&
                q.eq(q.field("approved"), undefined),
              filters.statuses.includes("published") &&
                q.eq(q.field("approved"), true),
              filters.statuses.includes("not-published") &&
                q.eq(q.field("approved"), false),
            )
          : true,
    );

    const filteredTestimonialQuery = readyTestimonialQuery
      .filter(
        (q) =>
          !filters.types ||
          filters.types.length === 0 ||
          q.or(
            ...filters.types.map((type) => q.eq(q.field("media_type"), type)),
          ),
      )
      .filter(
        (q) =>
          !filters.before || q.lte(q.field("_creationTime"), filters.before),
      )
      .filter(
        (q) => !filters.after || q.gte(q.field("_creationTime"), filters.after),
      );

    const trimmedAuthor = filters.author?.trim().toLowerCase() || "";

    const withAuthorTestimonialQuery = trimmedAuthor
      ? filter(filteredTestimonialQuery, (t) =>
          t.name.toLowerCase().includes(trimmedAuthor),
        )
      : filteredTestimonialQuery;

    const withNonIndexSearchTestimonialQuery =
      trimmedQuery !== "" && order
        ? filter(
            withAuthorTestimonialQuery,
            (t) =>
              t.searchText
                ?.toLocaleLowerCase()
                .includes(trimmedQuery.toLowerCase()) || false,
          )
        : withAuthorTestimonialQuery;

    return await withNonIndexSearchTestimonialQuery.paginate(paginationOpts);
  },
});

export const postTestimonial = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()),
    storageId: v.optional(v.string()),
    media_type: v.string(),
    text: v.string(),
    organizationId: v.string(),
  },
  handler: async (
    ctx,
    { name, email, storageId, media_type, text, organizationId },
  ) => {
    const id = await ctx.db.insert("testimonials", {
      name,
      email,
      storageId,
      media_type,
      testimonialText: text,
      organizationId,
      processingStatus: "ongoing",
    });
    return id;
  },
});

export const updateTestimonialStorageId = mutation({
  args: {
    id: v.id("testimonials"),
    storageId: v.string(),
  },
  handler: async (ctx, { id, storageId }) => {
    await ctx.db.patch(id, { storageId });
    return { id, storageId };
  },
});

export const updateTestimonialApproval = mutation({
  args: {
    id: v.id("testimonials"),
    approved: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, approved }) => {
    const canApprove = await ctx.runQuery(api.auth.checkUserPermissions, {
      permissions: { testimonial: ["approve"] },
    });

    if (!canApprove) {
      throw new Error("Forbidden");
    }

    await ctx.db.patch(id, { approved });
    return { id, approved };
  },
});

export const deleteTestimonial = mutation({
  args: { id: v.id("testimonials") },
  handler: async (ctx, { id }) => {
    const canDelete = await ctx.runQuery(api.auth.checkUserPermissions, {
      permissions: { testimonial: ["delete"] },
    });
    if (!canDelete) {
      throw new Error("Testimonial Delete Forbidden");
    }
    await ctx.db.delete("testimonials", id);
  },
});

export const getTestimonialById = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const testimonialId = ctx.db.normalizeId("testimonials", id);
    if (!testimonialId) return null;
    return await ctx.db.get(testimonialId);
  },
});

export const getTestimonialByIdAndOrgId = query({
  args: { id: v.string(), orgId: v.string() },
  handler: async (ctx, { id, orgId }) => {
    const testimonialId = ctx.db.normalizeId("testimonials", id);

    if (!testimonialId) return null;
    const testimonial = await ctx.db.get(testimonialId);

    if (!testimonial || testimonial.organizationId !== orgId) {
      return null;
    }

    return testimonial;
  },
});

export const getTestimonialMediaUrlById = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const testimonialId = ctx.db.normalizeId("testimonials", id);
    if (!testimonialId) return null;
    const testimonial = await ctx.db.get(testimonialId);
    const r2PublicUrl = process.env.R2_PUBLIC_URL;

    if (!testimonial || !testimonial.storageId || !r2PublicUrl) {
      return null;
    }

    return `${r2PublicUrl}/${testimonial.storageId}`;
  },
});

export const updateTestimonial = mutation({
  args: {
    _id: v.id("testimonials"),
    storageId: v.optional(v.string()),
    testimonialText: v.optional(v.string()),
    processingStatus: v.optional(processingStatusSchema),
  },
  handler: async (ctx, args) => {
    const cleaned = removeUndefinedFromRecord(args);
    await ctx.db.patch(args._id, cleaned);
  },
});
export const updateTranscription = mutation({
  args: {
    id: v.id("testimonials"),
    text: v.string(),
  },
  handler: async (ctx, { id, text }) => {
    await ctx.db.patch(id, { testimonialText: text });
  },
});

export const updateSummaryAndTitle = mutation({
  args: {
    id: v.id("testimonials"),
    summary: v.string(),
    title: v.string(),
  },
  handler: async (ctx, { id, summary, title }) => {
    await ctx.db.patch(id, { summary, title });
  },
});

export const updateProcessingStatus = mutation({
  args: {
    id: v.id("testimonials"),
    processingStatus: processingStatusSchema,
  },
  handler: async (ctx, { id, processingStatus }) => {
    await ctx.db.patch(id, { processingStatus });
  },
});

export const retryProcessing = mutation({
  args: {
    id: v.id("testimonials"),
  },
  handler: async (ctx, { id }) => {
    const testimonial = await ctx.db.get(id);
    if (!testimonial) return;
    const status = testimonial.processingStatus;
    if (status !== "error") return;

    await ctx.db.patch(id, { processingStatus: "ongoing" });

    if (testimonial.storageId && !testimonial.testimonialText) {
      await ctx.scheduler.runAfter(0, api.mediaProcessing.processMedia, {
        mediaKey: testimonial.storageId,
        testimonialId: id,
      });
      return;
    }

    if (!testimonial.summary || !testimonial.title) {
      await ctx.scheduler.runAfter(0, api.ai.summarizeText, {
        testimonialId: id,
        text: testimonial.testimonialText || "",
      });
    }
  },
});
