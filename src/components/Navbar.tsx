import { useState } from "react";
import { Link } from "react-router-dom";
// import {
//   Bell,
//   Menu,
//   Search,
//   Settings,
// User,
// LogOut,
//   X,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: "Explore", to: "/explore" },
    { name: "Problems", to: "/problems" },
    { name: "Contest", to: "/contest" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#3e3e3e] bg-[#1a1a1a]">
      <div className="container flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <img
              src="/logo.png"
              alt="logo"
              className="h-50 md:h-40 lg:h-55 w-auto object-contain"
            />
          </Link>

          <nav className="hidden md:flex space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={""}
                className="px-3 py-2 text-sm font-medium text-gray-400 hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" className="md:hidden text-gray-400">
            <Search className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="md:hidden text-gray-400" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <Bell className="hidden md:block h-5 w-5 text-gray-400 cursor-pointer hover:text-primary" />

          <div className="hidden md:flex items-center gap-1 text-gray-400">
            <Settings className="h-5 w-5 cursor-pointer hover:text-primary" />
            <span>0</span>
          </div> */}

        {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-sm">U</div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#2d2d2d] border-gray-700 text-white">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="font-medium">Username</span>
              </div>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem className="focus:bg-[#3a3a3a] focus:text-white cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-[#3a3a3a] focus:text-white cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem className="focus:bg-[#3a3a3a] focus:text-white text-red-400 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        {/* </div> */}
      </div>

      {isMenuOpen && (
        <div className="md:hidden px-4 py-3 space-y-1 bg-[#2d2d2d] border-t border-[#3e3e3e]">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              className="block px-3 py-2 text-sm font-medium text-gray-400 hover:text-primary hover:bg-[#3a3a3a] rounded-md"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
