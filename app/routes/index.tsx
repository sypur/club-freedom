import { createFileRoute } from "@tanstack/react-router";
import Footnote from "@/components/footnote";
import Navbar from "@/components/navbar";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="flex flex-col min-h-screen ">
      <Navbar />
      <main className="flex-1 py-24 px-8 max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold">
            Welcome to Testimonials Submission Product!
          </h1>
        </div>
      </main>
      <Footnote />
    </div>
  );
}
