/* eslint-disable no-restricted-imports */

import {
  customCtx,
  customMutation,
} from "convex-helpers/server/customFunctions";
import { Triggers } from "convex-helpers/server/triggers";
import { TEMP_TESTIMONIAL_FOLDER } from "@/lib/constants";
import { api } from "./_generated/api";
/* eslint-enable no-restricted-imports */
import type { DataModel } from "./_generated/dataModel";
import {
  internalMutation as rawInternalMutation,
  mutation as rawMutation,
} from "./_generated/server";
import { r2 } from "./r2";

// start using Triggers, with table types from schema.ts
const triggers = new Triggers<DataModel>();

triggers.register("testimonials", async (ctx, change) => {
  const oldEmail = change.oldDoc?.email;
  const email = change.newDoc?.email;
  const oldName = change.oldDoc?.name;
  const name = change.newDoc?.name;
  const oldSummary = change.oldDoc?.summary;
  const summary = change.newDoc?.summary;
  const oldText = change.oldDoc?.testimonialText;
  const text = change.newDoc?.testimonialText;
  const oldTitle = change.oldDoc?.title;
  const title = change.newDoc?.title;
  const oldEventName = change.oldDoc?.eventName;
  const eventName = change.newDoc?.eventName;

  if (
    (oldEmail === email &&
      oldName === name &&
      oldSummary === summary &&
      oldText === text &&
      oldTitle === title &&
      oldEventName === eventName) ||
    change.operation === "delete"
  ) {
    return;
  }
  const newSearchText = [email, name, summary, text, title, eventName].join(
    " ",
  );
  await ctx.db.patch(change.id, { searchText: newSearchText });
});

// Only trigger when media_id changes
triggers.register("testimonials", async (ctx, change) => {
  const oldMediaId = change.oldDoc?.storageId;
  const mediaId = change.newDoc?.storageId;

  if (
    oldMediaId === mediaId ||
    !mediaId?.includes(TEMP_TESTIMONIAL_FOLDER) ||
    change.operation === "delete"
  ) {
    return;
  }

  if (!mediaId) {
    console.log(
      `New testimonial inserted with id ${change.id} but no media ID.`,
    );
    return;
  }

  const id = change.id;
  const mediaUrl = await r2.getUrl(mediaId);

  if (!mediaUrl) {
    console.log(
      `New testimonial inserted with id ${id} but failed to get media URL for storage ID ${mediaId}.`,
    );
    return;
  }

  // Schedule transcription as an action (runs in Node.js environment)
  await ctx.scheduler.runAfter(0, api.mediaProcessing.processMedia, {
    testimonialId: id,
    mediaKey: mediaId,
  });
});

triggers.register("testimonials", async (ctx, change) => {
  const oldStorageId = change.oldDoc?.storageId;
  if (change.operation !== "delete" || !oldStorageId) {
    return;
  }
  await ctx.scheduler.runAfter(0, api.media.deleteMedia, {
    storageId: oldStorageId,
  });
});

// Trigger when the transcript changes
triggers.register("testimonials", async (ctx, change) => {
  const oldText = change.oldDoc?.testimonialText;
  const newText = change.newDoc?.testimonialText;

  if (oldText === newText || !newText || change.operation === "delete") {
    return;
  }

  const id = change.id;

  // Schedule summarization as an action (runs in Node.js environment)
  await ctx.scheduler.runAfter(0, api.ai.summarizeText, {
    testimonialId: id,
    text: newText,
  });
});

// create wrappers that replace the built-in `mutation` and `internalMutation`
// the wrappers override `ctx` so that `ctx.db.insert`, `ctx.db.patch`, etc. run registered trigger functions
export const mutation = customMutation(rawMutation, customCtx(triggers.wrapDB));
export const internalMutation = customMutation(
  rawInternalMutation,
  customCtx(triggers.wrapDB),
);
