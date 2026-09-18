import {
  type ErrorComponentProps,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Bug,
  ChevronDown,
  Home,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

export default function ErrorBoundary({ error }: ErrorComponentProps) {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });
  const [showDetails, setShowDetails] = useState(false);

  const isDev = import.meta.env.DEV;
  const isError = error instanceof Error;

  const errorMessage =
    (isDev && isError && error.message) || "An unexpected error occurred";

  const errorStack = isError ? (error.stack ?? "") : "";
  const hasStack = errorStack.length > 0;

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-xl">Something went wrong</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                We encountered an unexpected error. Please try again.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Alert */}
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="font-medium">
              {errorMessage}
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => router.invalidate()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>

            {isRoot ? (
              <Button variant="outline" asChild>
                <Link to="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Go to Home
                </Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
            )}
          </div>

          {/* Error Details (Collapsible) */}
          {hasStack && isDev && (
            <Collapsible open={showDetails} onOpenChange={setShowDetails}>
              <CollapsibleTrigger asChild className="mb-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <Bug className="h-4 w-4" />
                  Technical Details
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${showDetails ? "rotate-180" : ""}`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="text-sm font-medium mb-2">
                    Error Stack Trace:
                  </h4>
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap wrap-break-words max-h-40 overflow-y-auto">
                    {errorStack}
                  </pre>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
