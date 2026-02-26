import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import type { ConvexQueryClient } from "@convex-dev/react-query";
import { PostHogProvider } from "@posthog/react";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  useRouteContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { createServerFn } from "@tanstack/react-start";
import type { ConvexReactClient } from "convex/react";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/env/client";
import { authClient } from "@/lib/auth/auth-client";
import { getToken } from "@/lib/auth/auth-server";
import appCss from "../globals.css?url";
import { MediaWorkerProvider } from "@/contexts/media-worker-context";

const getAuth = createServerFn({ method: "GET" }).handler(async () => {
  return await getToken();
});

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  convexClient: ConvexReactClient;
  convexQueryClient: ConvexQueryClient;
}>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  beforeLoad: async (ctx) => {
    // all queries, mutations and action made with TanStack Query will be
    // authenticated by an identity token.
    const token = await getAuth();
    // During SSR only (the only time serverHttpClient exists),
    // set the auth token to make HTTP queries with.
    if (token) {
      ctx.context.convexQueryClient.serverHttpClient?.setAuth(token);
    }
    return { isAuthenticated: !!token, token };
  },
  component: RootComponent,
});

const postHogOptions = {
  api_host: env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: "2025-11-30",
} as const;

function RootComponent() {
  const context = useRouteContext({ from: Route.id });
  return (
    <PostHogProvider
      apiKey={env.VITE_PUBLIC_POSTHOG_KEY}
      options={postHogOptions}
    >
      <NuqsAdapter>
        <ConvexBetterAuthProvider
          client={context.convexClient}
          authClient={authClient}
          initialToken={context.token}
        >
          <MediaWorkerProvider>
            <RootDocument>
              <Outlet />
              <Toaster richColors position="bottom-center" />
            </RootDocument>
          </MediaWorkerProvider>
        </ConvexBetterAuthProvider>
      </NuqsAdapter>
    </PostHogProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        {children}
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <Scripts />
      </body>
    </html>
  );
}
