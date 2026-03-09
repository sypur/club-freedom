import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useRouteContext } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { FormPreferenceContext } from "@/contexts/form-preference-context";
import { api } from "@/convex/_generated/api";
import ActivateFormPreference from "../actions/activate";
import RemoveFormPreference from "../actions/remove";
import FormPreferenceFormatTags from "./format-tags";

export default function FormPreferenceList() {
  const { organization } = useRouteContext({
    from: "/o/$orgSlug",
  });

  const { data, error, refetch } = useSuspenseQuery(
    convexQuery(api.formPreferences.getFormPreferenceByOrgId, {
      organizationId: organization._id,
    }),
  );

  if (error)
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle className="text-destructive">
            Failed to fetch form preferences
          </EmptyTitle>
          <EmptyDescription className="text-destructive">
            An error occurred while fetching form preferences.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </EmptyContent>
      </Empty>
    );

  if (data.length <= 0) {
    return (
      <Empty className="bg-muted">
        <EmptyHeader>
          <EmptyTitle>No testimonial form created</EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="grid gap-2">
      {data.map((formPreference) => (
        <FormPreferenceContext.Provider
          key={formPreference._id}
          value={{ formPreference }}
        >
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>{formPreference.name}</ItemTitle>
              <ItemDescription className="flex gap-2">
                <FormPreferenceFormatTags />
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="ghost" size="xs" asChild>
                <Link
                  from="/o/$orgSlug/dashboard/form-preferences/"
                  to="$id"
                  params={{
                    id: formPreference._id,
                  }}
                >
                  Edit
                </Link>
              </Button>
              <ActivateFormPreference variant="outline" size="xs" />
              <RemoveFormPreference variant="destructive" size="xs" />
            </ItemActions>
          </Item>
        </FormPreferenceContext.Provider>
      ))}
    </div>
  );
}
