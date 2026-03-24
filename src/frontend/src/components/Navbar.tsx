import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "@tanstack/react-router";
import { Briefcase, ChevronDown, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
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
    <header
      className="sticky top-0 z-50"
      style={{
        background: "oklch(0.12 0.045 264 / 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 1px 24px 0 rgba(0,0,0,0.25)",
      }}
    >
      {/* Gradient border bottom line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.64 0.19 221 / 0.6), oklch(0.55 0.22 264 / 0.6), transparent)",
        }}
      />

      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 font-extrabold text-xl text-white group"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.64 0.19 221), oklch(0.55 0.22 264))",
            }}
          >
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="tracking-tight">
            Career<span className="text-gradient-blue">Hub</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <Link
            to="/jobs"
            className="px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/8 transition-all"
            data-ocid="nav.jobs.link"
          >
            Find Jobs
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/8 transition-all">
              Employers <ChevronDown className="w-3.5 h-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card text-foreground border-border">
              <DropdownMenuItem asChild>
                <Link to="/auth">Post a Job</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/employer">Employer Dashboard</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/8 transition-all cursor-pointer">
            Pricing
          </span>
          <span className="px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/8 transition-all cursor-pointer">
            Resources
          </span>
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Button
                type="button"
                variant="ghost"
                className="text-white/80 hover:text-white hover:bg-white/10"
                onClick={handleDashboard}
                data-ocid="nav.dashboard.button"
              >
                Dashboard
              </Button>
              <Button
                type="button"
                className="text-white border border-white/20 bg-white/8 hover:bg-white/15 transition-all"
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
                className="text-white/70 hover:text-white text-sm px-3 py-2 transition-colors"
                data-ocid="nav.login.link"
              >
                Login
              </button>
              <Button
                asChild
                className="font-semibold text-white"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.64 0.19 221), oklch(0.55 0.22 264))",
                  boxShadow: "0 0 16px 0 rgba(14,165,233,0.30)",
                }}
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
          className="md:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="md:hidden overflow-hidden"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              <Link
                to="/jobs"
                className="text-white/80 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/8 transition-all"
                onClick={() => setMobileOpen(false)}
              >
                Find Jobs
              </Link>
              <Link
                to="/auth"
                className="text-white/80 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/8 transition-all"
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
                    className="text-white/80 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/8 transition-all text-left"
                  >
                    Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="text-white/80 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/8 transition-all text-left"
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
                  className="text-white/80 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/8 transition-all text-left"
                >
                  Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
