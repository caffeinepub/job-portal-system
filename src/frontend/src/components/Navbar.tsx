import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "@tanstack/react-router";
import { Briefcase, ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { UserRole } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCallerProfile } from "../hooks/useQueries";

export default function Navbar() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: profile } = useCallerProfile();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoggedIn = loginStatus === "success" && !!identity;

  function handleLogin() {
    login();
  }

  function handleLogout() {
    clear();
    navigate({ to: "/" });
  }

  function handleDashboard() {
    if (profile?.role === UserRole.employer) {
      navigate({ to: "/dashboard/employer" });
    } else {
      navigate({ to: "/dashboard/seeker" });
    }
  }

  return (
    <header className="bg-navy text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl text-white"
        >
          <Briefcase className="w-6 h-6 text-blue-300" />
          CareerHub
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            to="/jobs"
            className="hover:text-blue-300 transition-colors"
            data-ocid="nav.jobs.link"
          >
            Find Jobs
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 hover:text-blue-300 transition-colors">
              Employers <ChevronDown className="w-3.5 h-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white text-foreground">
              <DropdownMenuItem asChild>
                <Link to="/auth">Post a Job</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/employer">Employer Dashboard</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="hover:text-blue-300 transition-colors cursor-pointer">
            Pricing
          </span>
          <span className="hover:text-blue-300 transition-colors cursor-pointer">
            Resources
          </span>
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Button
                type="button"
                variant="ghost"
                className="text-white hover:text-white hover:bg-white/10"
                onClick={handleDashboard}
                data-ocid="nav.dashboard.button"
              >
                Dashboard
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-white/30 text-white bg-transparent hover:bg-white/10"
                onClick={handleLogout}
                data-ocid="nav.logout.button"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleLogin}
                className="text-white/80 hover:text-white text-sm transition-colors"
                data-ocid="nav.login.link"
              >
                Login
              </button>
              <Button
                asChild
                className="bg-blue-accent hover:bg-blue-accent/90 text-white"
                data-ocid="nav.post_job.button"
              >
                <Link to="/auth">Post a Job</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="md:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-navy border-t border-white/10 px-4 pb-4 flex flex-col gap-3">
          <Link
            to="/jobs"
            className="text-white/80 hover:text-white py-2"
            onClick={() => setMobileOpen(false)}
          >
            Find Jobs
          </Link>
          <Link
            to="/auth"
            className="text-white/80 hover:text-white py-2"
            onClick={() => setMobileOpen(false)}
          >
            Post a Job
          </Link>
          {isLoggedIn ? (
            <>
              <button
                type="button"
                onClick={() => {
                  handleDashboard();
                  setMobileOpen(false);
                }}
                className="text-white/80 hover:text-white py-2 text-left"
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="text-white/80 hover:text-white py-2 text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                handleLogin();
                setMobileOpen(false);
              }}
              className="text-white/80 hover:text-white py-2 text-left"
            >
              Login
            </button>
          )}
        </div>
      )}
    </header>
  );
}
