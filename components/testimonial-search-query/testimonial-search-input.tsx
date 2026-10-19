import { debounce } from "nuqs";
import type { ComponentProps } from "react";
import { Input } from "../ui/input";
import { useTestimonialSearchQuery } from "./hook";

export default function TestimonialSearchInput(
  props: ComponentProps<typeof Input>,
) {
  const { searchQuery, setSearchQuery } = useTestimonialSearchQuery();
  return (
    <Input
      value={searchQuery.q}
      placeholder="Search testimonials"
      onChange={async (e) => {
        await setSearchQuery(
          { q: e.target.value },
          {
            limitUrlUpdates: e.target.value === "" ? undefined : debounce(500),
          },
        );
      }}
      {...props}
    />
  );
}
