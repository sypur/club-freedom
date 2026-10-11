import { convexQuery } from "@convex-dev/react-query";
import {
  createFileRoute,
  Link,
  notFound,
  redirect,
} from "@tanstack/react-router";
import { InviteSignInForm } from "@/components/auth/invite-sign-in-form";
import { InviteSignUpForm } from "@/components/auth/invite-sign-up-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth/auth-client";

export const Route = createFileRoute("/_auth/accept-invite/$inviteId")({
  ssr: false,
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const invitation = await context.queryClient.ensureQueryData(
      convexQuery(api.organization.findInvitationById, {
        id: params.inviteId,
      }),
    );
    if (!invitation) {
      throw notFound();
    }

    if (invitation.status === "accepted") {
      throw redirect({
        to: "/o/$orgSlug",
        params: { orgSlug: invitation.organization.slug },
      });
    }

    const currentUser = await context.queryClient.ensureQueryData(
      convexQuery(api.auth.getCurrentUser),
    );

    if (currentUser?.email === invitation.email) {
      await authClient.organization.acceptInvitation({
        invitationId: invitation._id,
      });
      throw redirect({
        to: "/o/$orgSlug",
        params: { orgSlug: invitation.organization.slug },
      });
    }

    await authClient.signOut();
    context.queryClient.removeQueries({ queryKey: ["organizations"] });
    const userExists = await context.queryClient.query({
      ...convexQuery(api.auth.checkEmailExists, { email: invitation.email }),
      staleTime: "static",
    });

    return {
      invitation,
      userExists,
    };
  },
});

function RouteComponent() {
  const { invitation, userExists } = Route.useLoaderData();

  if (invitation.expiresAt < Date.now()) {
    return <ExpiredInvitation />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Accept invite</CardTitle>
        <CardDescription>
          You're about to join <strong>{invitation.organization.name}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {userExists ? <InviteSignInForm /> : <InviteSignUpForm />}
      </CardContent>
    </Card>
  );
}

function ExpiredInvitation() {
  const { invitation } = Route.useLoaderData();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Invitation Expired</CardTitle>
        <CardDescription>
          Your invitation for <strong>{invitation.organization.name}</strong>{" "}
          has expired.
        </CardDescription>
      </CardHeader>
      <CardAction>
        <Button asChild>
          <Link
            to="/o/$orgSlug"
            params={{ orgSlug: invitation.organization.slug }}
          >
            Go to organization
          </Link>
        </Button>
      </CardAction>
    </Card>
  );
}
