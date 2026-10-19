import {
  parseAsIsoDate,
  parseAsNativeArrayOf,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs";
import { z } from "zod";

export const testimonialFormats = ["video", "audio", "text"] as const;
export type TestimonialFormat = (typeof testimonialFormats)[number];
export const getTestimonialFormatLabel = (type: TestimonialFormat) => {
  switch (type) {
    case "text":
      return "Text";
    case "video":
      return "Video";
    case "audio":
      return "Audio";
  }
};

export const testimonialStatuses = [
  "pending",
  "published",
  "not-published",
] as const;
export type TestimonialStatus = (typeof testimonialStatuses)[number];
export const getTestimonialStatusLabel = (type: TestimonialStatus) => {
  switch (type) {
    case "pending":
      return "Pending";
    case "published":
      return "Published";
    case "not-published":
      return "Not Published";
  }
};

export const sortOrders = ["newest", "oldest"] as const;
export type SortOrder = (typeof sortOrders)[number];
export const getSortOrderLabel = (order: SortOrder) => {
  switch (order) {
    case "newest":
      return "Newest to Oldest";
    case "oldest":
      return "Oldest to Newest";
  }
};

export const testimonialSearchQueryParams = {
  q: parseAsString.withDefault(""),
  author: parseAsString.withDefault(""),
  formats: parseAsNativeArrayOf(
    parseAsStringLiteral(testimonialFormats),
  ).withDefault([]),
  from: parseAsIsoDate,
  to: parseAsIsoDate,
  order: parseAsStringLiteral(sortOrders),
  statuses: parseAsNativeArrayOf(
    parseAsStringLiteral(testimonialStatuses),
  ).withDefault([]),
};

// Zod schema for TanStack Router validation
export const testimonialSearchQuerySchema = z.object({
  q: z.string().optional(),
  author: z.string().optional(),
  formats: z
    .union([z.enum(testimonialFormats), z.array(z.enum(testimonialFormats))])
    .optional()
    .transform((val) => (val ? (Array.isArray(val) ? val : [val]) : undefined)),
  from: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  to: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  order: z.enum(sortOrders).optional(),
  statuses: z
    .union([z.enum(testimonialStatuses), z.array(z.enum(testimonialStatuses))])
    .optional()
    .transform((val) => (val ? (Array.isArray(val) ? val : [val]) : undefined)),
});

export type TestimonialSearchQuery = z.infer<
  typeof testimonialSearchQuerySchema
>;
