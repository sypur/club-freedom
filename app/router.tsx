import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient } from "@tanstack/react-query";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { ConvexReactClient } from "convex/react";
import ErrorBoundary from "@/components/error-boundary";
import NotFound from "@/components/not-found";
import { env } from "@/env/client";
import { routeTree } from "./routeTree.gen";
import { createRouter } from "@tanstack/react-router";

export function getRouter() {
  const CONVEX_URL = env.VITE_CONVEX_URL;

  if (!CONVEX_URL) {
    throw new Error("missing VITE_CONVEX_URL envar");
  }

  const convex = new ConvexReactClient(CONVEX_URL, {
    unsavedChangesWarning: false,
  });

  const convexQueryClient = new ConvexQueryClient(convex, {
    expectAuth: true,
  });

  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
      },
    },
  });
  convexQueryClient.connect(queryClient);

  const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
    context: { queryClient, convexQueryClient, convexClient: convex },
    defaultNotFoundComponent: NotFound,
    notFoundMode: "root",
    defaultErrorComponent: (props) => <ErrorBoundary {...props} />,
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
}
