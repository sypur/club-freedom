import { convexQuery } from "@convex-dev/react-query";
import { usePaginatedQuery } from "convex/react";
import type { TestimonialSearchQuery } from "@/components/testimonial-search-query/schema";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/betterAuth/_generated/dataModel";
import type { OrganizationPermissionCheck } from "./auth/permissions/organization";

export function hasPermissionQuery(
  permissions: OrganizationPermissionCheck,
  organizationId: string,
) {
  return convexQuery(api.auth.checkUserPermissions, {
    permissions,
    organizationId,
  });
}

export function getMemberRoleQuery(organizationId: string) {
  return convexQuery(api.auth.getMemeberRole, {
    organizationId,
  });
}

export const TESTIMONIAL_PER_PAGE = 10;

function toLocalMidnight(date: Date, dayOffset = 0) {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate() + dayOffset,
  ).getTime();
}

export function useInfiniteTestimonialQuery(
  orgId: Id<"organization">,
  searchQuery: TestimonialSearchQuery,
) {
  const before = searchQuery.to
    ? toLocalMidnight(searchQuery.to, 1) - 1
    : undefined;
  const after = searchQuery.from
    ? toLocalMidnight(searchQuery.from)
    : undefined;

  return usePaginatedQuery(
    api.testimonials.getTestimonials,
    {
      searchQuery: searchQuery.q,
      orgId: orgId,
      filters: {
        author: searchQuery.author || "",
        types: searchQuery.formats || [],
        statuses: searchQuery.statuses || [],
        before,
        after,
      },
      order:
        searchQuery.order === "oldest"
          ? "asc"
          : searchQuery.order === "newest"
            ? "desc"
            : undefined,
    },
    {
      initialNumItems: TESTIMONIAL_PER_PAGE,
    },
  );
}
