import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/auth-client";

export const Route = createFileRoute("/sign-out")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    void authClient.signOut().then(async () => {
      queryClient.removeQueries();
      await router.invalidate();
      await router.navigate({
        to: "/sign-in",
      });
    });
  }, [router, queryClient]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 h-screen">
      <Spinner className="size-8" />
      <span>Signing out...</span>
    </div>
  );
}
