import { useQuery } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { hasPermissionQuery } from "@/lib/query";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { useTestimonialSearchQuery } from "./hook";
import AuthoutInput from "./inputs/author";
import DateInput from "./inputs/date";
import FormatInput from "./inputs/format";
import SortOrderInput from "./inputs/sort-order";
import StatusInput from "./inputs/status";
import {
  getSortOrderLabel,
  getTestimonialFormatLabel,
  getTestimonialStatusLabel,
} from "./schema";
import TestimonialSearchDropdown from "./testimonial-search-query-dropdown";

export default function TestimonialFilters() {
  const [open, setOpen] = useState(false);
  const { searchQuery, setSearchQuery, resetSortAndFilters } =
    useTestimonialSearchQuery();
  const { organization } = useRouteContext({ from: "/o/$orgSlug" });

  const { data: canView } = useQuery(
    hasPermissionQuery(
      {
        testimonial: ["view"],
      },
      organization._id,
    ),
  );

  const activeQueriesCount = useMemo(() => {
    let count = 0;

    if (searchQuery.author !== "") count++;
    if (searchQuery.formats.length > 0) count++;
    if (searchQuery.from !== null) count++;
    if (searchQuery.to !== null) count++;
    if (searchQuery.order !== null) count++;
    if (searchQuery.statuses.length > 0 && canView) count++;

    return count;
  }, [searchQuery, canView]);

  const isActive = activeQueriesCount > 0;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-4 py-2">
        <span className="font-semibold text-sm space-x-2">
          <span>Sort and Filters</span>
          {isActive && (
            <Badge className="px-1.5 py-px">{activeQueriesCount}</Badge>
          )}
        </span>
        <span className="flex items-center ml-auto">
          {isActive && (
            <Button
              variant="link"
              size="sm"
              className="cursor-pointer"
              onClick={resetSortAndFilters}
            >
              Clear Filter
            </Button>
          )}
          <CollapsibleTrigger asChild>
            <Button
              variant={open ? "secondary" : "ghost"}
              size="icon-sm"
              className="cursor-pointer"
            >
              <SlidersHorizontal />
            </Button>
          </CollapsibleTrigger>
        </span>
      </div>
      <CollapsibleContent>
        <div className="flex flex-wrap gap-2">
          <TestimonialSearchDropdown
            name="Author"
            displayValue={searchQuery.author}
            isEnabled={searchQuery.author !== ""}
            clear={() => setSearchQuery({ author: "" })}
          >
            {({ setOpen }) => <AuthoutInput onSuccess={() => setOpen(false)} />}
          </TestimonialSearchDropdown>
          <TestimonialSearchDropdown
            name="Format"
            displayValue={searchQuery.formats
              .map(getTestimonialFormatLabel)
              .join(", ")}
            isEnabled={searchQuery.formats.length > 0}
            clear={() => setSearchQuery({ formats: [] })}
          >
            {() => <FormatInput />}
          </TestimonialSearchDropdown>
          {canView && (
            <TestimonialSearchDropdown
              name="Status"
              displayValue={searchQuery.statuses
                .map(getTestimonialStatusLabel)
                .join(", ")}
              isEnabled={searchQuery.statuses.length > 0}
              clear={() => setSearchQuery({ statuses: [] })}
            >
              {() => <StatusInput />}
            </TestimonialSearchDropdown>
          )}
          <TestimonialSearchDropdown
            name="From Date"
            displayValue={formatDate(searchQuery.from)}
            isEnabled={searchQuery.from !== null}
            clear={() => setSearchQuery({ from: null })}
          >
            {({ setOpen }) => (
              <DateInput
                date={searchQuery.from}
                enabledDate={(date) =>
                  date.getTime() <=
                  Math.min(Date.now(), searchQuery.to?.getTime() || Infinity)
                }
                onDateChange={async (date) => {
                  setOpen(false);
                  await setSearchQuery({ from: date });
                }}
              />
            )}
          </TestimonialSearchDropdown>
          <TestimonialSearchDropdown
            name="To Date"
            displayValue={formatDate(searchQuery.to)}
            isEnabled={searchQuery.to !== null}
            clear={() => setSearchQuery({ to: null })}
          >
            {({ setOpen }) => (
              <DateInput
                date={searchQuery.to}
                enabledDate={(date) =>
                  date.getTime() <= Date.now() &&
                  date.getTime() >= Math.max(searchQuery.from?.getTime() || 0)
                }
                onDateChange={async (date) => {
                  setOpen(false);
                  await setSearchQuery({ to: date });
                }}
              />
            )}
          </TestimonialSearchDropdown>
          <TestimonialSearchDropdown
            name="Sort by"
            displayValue={
              searchQuery.order
                ? getSortOrderLabel(searchQuery.order)
                : undefined
            }
            isEnabled={searchQuery.order !== null}
            clear={() => setSearchQuery({ order: null })}
          >
            {() => <SortOrderInput />}
          </TestimonialSearchDropdown>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function formatDate(date: Date | null) {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
}
