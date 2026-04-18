import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/navbar";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center py-24 px-8 gap-y-12 max-w-3xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold">
            Welcome to Testimonials Submission Product!
          </h1>
        </div>
      </main>
    </>
  );
}
