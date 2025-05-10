import  { useState } from "react";
import { Link } from "react-router-dom";
import {
    Bell,
    ChevronDown,
    Code,
    Menu,
    Search,
    Settings,
    User,
    LogOut,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#3e3e3e] bg-[#1a1a1a]">
      <div className="container flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <img src="/logo.png" alt="logo" className="h-60 w-auto" />
      </Link>

          <nav className="hidden md:flex">
            <Link to="#" className="px-3 py-2 text-sm font-medium text-gray-400 hover:text-white">
              Explore
            </Link>
            <Link to="#" className="px-3 py-2 text-sm font-medium text-white border-b-2 border-white">
              Problems
            </Link>
            <Link to="#" className="px-3 py-2 text-sm font-medium text-gray-400 hover:text-white">
              Contest
            </Link>
            <Link to="#" className="px-3 py-2 text-sm font-medium text-gray-400 hover:text-white">
              Discuss
            </Link>
            <Link to="#" className="px-3 py-2 text-sm font-medium text-gray-400 hover:text-white flex items-center">
              Interview
              <ChevronDown className="ml-1 h-4 w-4" />
            </Link>
            <Link
              to="#"
              className="px-3 py-2 text-sm font-medium text-yellow-500 hover:text-yellow-400 flex items-center"
            >
              Store
              <ChevronDown className="ml-1 h-4 w-4" />
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" className="md:hidden text-gray-400">
            <Search className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="md:hidden text-gray-400" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <Bell className="hidden md:block h-5 w-5 text-gray-400 cursor-pointer hover:text-white" />

          <div className="hidden md:flex items-center gap-1 text-gray-400">
            <Settings className="h-5 w-5 cursor-pointer hover:text-white" />
            <span>0</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-sm">U</div>
                <div className="hidden sm:block px-3 py-1 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded text-xs font-medium">
                  Premium
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#2d2d2d] border-gray-700 text-white">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="font-medium">Username</span>
                <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded text-xs font-medium">
                  Premium
                </span>
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
          </DropdownMenu>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden px-4 py-3 space-y-1 bg-[#2d2d2d] border-t border-[#3e3e3e]">
          <Link
            to="#"
            className="block px-3 py-2 text-sm font-medium text-gray-400 hover:text-white rounded-md hover:bg-[#3a3a3a]"
          >
            Explore
          </Link>
          <Link to="#" className="block px-3 py-2 text-sm font-medium text-white rounded-md bg-[#3a3a3a]">
            Problems
          </Link>
          <Link
            to="#"
            className="block px-3 py-2 text-sm font-medium text-gray-400 hover:text-white rounded-md hover:bg-[#3a3a3a]"
          >
            Contest
          </Link>
          <Link
            to="#"
            className="block px-3 py-2 text-sm font-medium text-gray-400 hover:text-white rounded-md hover:bg-[#3a3a3a]"
          >
            Discuss
          </Link>
          <Link
            to="#"
            className="block px-3 py-2 text-sm font-medium text-gray-400 hover:text-white rounded-md hover:bg-[#3a3a3a]"
          >
            Interview
          </Link>
          <Link
            to="#"
            className="block px-3 py-2 text-sm font-medium text-yellow-500 hover:text-yellow-400 rounded-md hover:bg-[#3a3a3a]"
          >
            Store
          </Link>
        </div>
      )}
    </header>
  );
}
