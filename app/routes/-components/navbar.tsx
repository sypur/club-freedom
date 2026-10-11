import Logo from "@/components/logo";
import UserDropdown from "@/components/user-dropdown";

export default function Navbar() {
  return (
    <header className="border-b px-4 md:px-6 flex justify-between items-center sticky top-0 bg-background z-10">
      <div className="flex items-center gap-4">
        <Logo />
      </div>
      <UserDropdown />
    </header>
  );
}
