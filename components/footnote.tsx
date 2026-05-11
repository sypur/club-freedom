export default function Footnote() {
  return (
    <footer className="border-t px-4 md:px-6 flex justify-center items-center bg-background z-10 relative bottom-0">
      <p className="text-muted-foreground text-sm leading-normal font-normal mt-3 mb-3">
        Having issues? Contact us at{" "}
        <span className="font-bold">
          <a href="mailto:support@sypur.io" className="underline">
            support@sypur.io
          </a>
        </span>
      </p>
    </footer>
  );
}
