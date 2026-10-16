import { createFileRoute, redirect } from "@tanstack/react-router";
import Footnote from "@/components/footnote";
import Navbar from "./-components/navbar";
import OrganizationList from "./-components/organization-list";

export const Route = createFileRoute("/")({
  component: Home,
  loader: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({
        to: "/sign-in",
      });
    }
  },
});

function Home() {
  return (
    <div className="flex flex-col min-h-screen ">
      <Navbar />
      <main className="flex flex-col w-full flex-1 py-12 px-8 max-w-5xl mx-auto">
        <OrganizationList />
      </main>
      <Footnote />
    </div>
  );
}
