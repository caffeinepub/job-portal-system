import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { Briefcase, Building, Loader2, ShieldCheck, Users } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { UserRole } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCallerProfile } from "../hooks/useQueries";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
  } = useCallerProfile();
  const [selectedRole, setSelectedRole] = useState<
    "seeker" | "employer" | null
  >(null);

  const isLoggedIn = loginStatus === "success" && !!identity;

  useEffect(() => {
    if (!isLoggedIn || profileLoading) return;
    if (profile === null || profileError) {
      navigate({ to: "/profile-setup" });
    } else if (profile?.role === UserRole.employer) {
      navigate({ to: "/dashboard/employer" });
    } else if (profile?.role === UserRole.job_seeker) {
      navigate({ to: "/dashboard/seeker" });
    }
    // If profile is undefined and no error, wait for it to load
  }, [isLoggedIn, profile, profileLoading, profileError, navigate]);

  if (isInitializing || (isLoggedIn && profileLoading)) {
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        data-ocid="auth.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome to CareerHub
          </h1>
          <p className="text-muted-foreground mt-2">
            Sign in securely with Internet Identity
          </p>
        </div>

        <Card className="border border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Get Started</CardTitle>
            <CardDescription>
              Choose your account type to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("seeker")}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  selectedRole === "seeker"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
                data-ocid="auth.seeker.toggle"
              >
                <Users className="w-5 h-5 text-primary mb-2" />
                <p className="font-semibold text-sm text-foreground">
                  Job Seeker
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Find your dream job
                </p>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("employer")}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  selectedRole === "employer"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
                data-ocid="auth.employer.toggle"
              >
                <Building className="w-5 h-5 text-primary mb-2" />
                <p className="font-semibold text-sm text-foreground">
                  Employer
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Hire top talent
                </p>
              </button>
            </div>

            <Button
              type="button"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11"
              onClick={() => login()}
              disabled={loginStatus === "logging-in"}
              data-ocid="auth.login.button"
            >
              {loginStatus === "logging-in" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Connecting...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Sign in with Internet Identity
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Secure, passwordless authentication. No email or password
              required.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
