import { Link, useNavigate, useLocation } from "react-router-dom";
import Timer from "./Timer";
import { ChevronLeft, ChevronRight, List, Menu } from "lucide-react";
import { useAuthStore } from "@/store/store";
import { useQuery } from "@tanstack/react-query";
import { allProblemAvaiableInTheDatabase } from "@/http/api";
import { useState, useRef, useEffect } from "react";

type TopbarProps = {
  problemPage?: boolean;
  problemId?: string;
};

const Topbar: React.FC<TopbarProps> = ({ problemPage, problemId }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ["problemList"],
    queryFn: async () => {
      const response = await allProblemAvaiableInTheDatabase();
      return response.data.data;
    },
  });

  const problems = data?.problems ?? [];

  const handleProblemChange = (isForward: boolean) => {
    if (!problems.length || !problemId) return;

    const currentProblem = problems.find(
      (p: any) => p.id.trim() === problemId.trim()
    );
    if (!currentProblem) return;

    const nextProblemNumber =
      currentProblem.problemNumber + (isForward ? 1 : -1);
    const nextProblem = problems.find(
      (p: any) => p.problemNumber === nextProblemNumber
    );

    if (nextProblem) {
      navigate(`/auth/problems/${nextProblem.id}`);
    } else {
      // Loop around
      if (isForward) {
        const firstProblem = problems.reduce(
          (min: any, p: any) => (p.problemNumber < min.problemNumber ? p : min),
          problems[0]
        );
        if (firstProblem) {
          navigate(`/auth/problems/${firstProblem.id}`);
        }
      } else {
        const lastProblem = problems.reduce(
          (max: any, p: any) => (p.problemNumber > max.problemNumber ? p : max),
          problems[0]
        );
        if (lastProblem) {
          navigate(`/auth/problems/${lastProblem.id}`);
        }
      }
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Home", to: "/" },
    { name: "Favorite", to: "/favorite" },
    { name: "Article", to: "/article" },
  ];

  const isActiveLink = (to: string) => location.pathname === to;

  return (
    <nav className="relative flex h-[50px] w-full items-center px-4 md:px-6 bg-gray-500 shadow-sm dark:bg-dark-layer-2 dark:shadow-none">
      <div
        className={`flex w-full items-center max-w-[1200px] mx-auto justify-between`}
      >
        {/* Left: Logo + Nav */}
        <div
          className={`flex items-center space-x-3 md:space-x-6 flex-1 transition-all duration-300`}
          style={{ marginLeft: user ? undefined : "-20px" }}
        >
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            {/* <img
              src="/logo192.png"
              alt="Logo"
              className="h-8 w-8 object-contain"
            /> */}
            {/* Hide app name on small screens */}
            <span className="hidden sm:inline font-semibold text-lg text-gray-800 dark:text-white select-none">
              LEETHUB
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium cursor-pointer transition-colors duration-200 ${
                  isActiveLink(link.to)
                    ? "text-brand-orange border-b-2 border-brand-orange"
                    : "text-gray-600 hover:text-brand-orange dark:text-gray-300 dark:hover:text-brand-orange"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Center problem controls */}
        {problemPage && (
          <div className="hidden md:flex items-center gap-4 flex-1 justify-center min-w-[220px]">
            <button
              onClick={() => handleProblemChange(false)}
              className="flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8 cursor-pointer"
              aria-label="Previous Problem"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <Link
              to="/"
              className="flex items-center gap-2 font-medium max-w-[170px] text-dark-gray-8 cursor-pointer select-none"
            >
              <List />
              <p>Problem List</p>
            </Link>
            <button
              onClick={() => handleProblemChange(true)}
              className="flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8 cursor-pointer"
              aria-label="Next Problem"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center space-x-3 md:space-x-4 flex-1 justify-end min-w-[130px]">
          {/* PREMIUM button: only visible md and up */}
          <a
            href="https://www.buymeacoffee.com/burakorkmezz"
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-block bg-dark-fill-3 py-1.5 px-3 rounded text-brand-orange hover:bg-dark-fill-2 whitespace-nowrap"
          >
            Premium
          </a>

          {/* Sign In: visible md and up and when no user */}
          {!user && (
            <Link
              to="/loginPage"
              className="hidden md:inline-block whitespace-nowrap"
            >
              <button className="py-1 px-3 rounded bg-brand-orange text-white hover:bg-orange-600 transition">
                Sign In
              </button>
            </Link>
          )}

          {/* Show Timer if user and on problem page */}
          {user && problemPage && <Timer />}

          {/* User avatar dropdown */}
          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center space-x-2 focus:outline-none"
                onClick={() => setDropdownOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <img
                  src={user?.avatar?.url || "/default-avatar.png"}
                  alt="User Avatar"
                  className="h-8 w-8 rounded-full object-cover border-2 border-brand-orange"
                />
                <svg
                  className={`w-4 h-4 ml-1 text-gray-600 dark:text-gray-300 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>

              {/* Dropdown menu */}
              <div
                className={`absolute right-0 mt-2 w-40 bg-white dark:bg-dark-layer-1 rounded-md shadow-lg z-50 transform transition-all duration-200 ${
                  dropdownOpen
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-fill-2 rounded-t-md"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                    navigate("/");
                  }}
                  className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-fill-2 rounded-b-md"
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* Mobile hamburger menu button */}
          <div className="md:hidden flex items-center relative">
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle Menu"
              aria-expanded={mobileMenuOpen}
              className="p-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange"
            >
              <Menu className="w-6 h-6 text-gray-800 dark:text-white" />
            </button>

            {/* Mobile menu dropdown */}
            <div
              ref={mobileMenuRef}
              className={`absolute top-full right-0 mt-2 w-48 bg-white dark:bg-dark-layer-1 rounded-md shadow-lg z-50 transform transition-all duration-200 origin-top-right ${
                mobileMenuOpen
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-fill-2 cursor-pointer ${
                    isActiveLink(link.to)
                      ? "text-brand-orange font-semibold"
                      : ""
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Show login button inside mobile menu if no user */}
              {!user && (
                <Link
                  to="/loginPage"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 mt-1 bg-brand-orange text-white rounded hover:bg-orange-600 text-center"
                >
                  Sign In
                </Link>
              )}

              {/* If user is logged in, show Logout option here too for convenience */}
              {user && (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate("/");
                  }}
                  className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-fill-2 cursor-pointer rounded"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
