import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  DollarSign,
  Eye,
  MapPin,
  Search,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { ApplicationStatus, type JobType } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllJobs,
  useApplicationsByApplicant,
  useCallerProfile,
} from "../hooks/useQueries";

const JOB_TYPE_LABELS: Record<JobType, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  remote: "Remote",
  internship: "Internship",
  freelance: "Freelance",
};

const STATUS_CONFIG = {
  [ApplicationStatus.pending]: {
    label: "Pending",
    color: "bg-gray-100 text-gray-700 border-gray-200",
  },
  [ApplicationStatus.reviewed]: {
    label: "Reviewed",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  [ApplicationStatus.accepted]: {
    label: "Accepted",
    color: "bg-green-100 text-green-700 border-green-200",
  },
  [ApplicationStatus.rejected]: {
    label: "Rejected",
    color: "bg-red-100 text-red-700 border-red-200",
  },
};

const STATUS_ICONS = {
  [ApplicationStatus.pending]: <Clock className="w-3 h-3" />,
  [ApplicationStatus.reviewed]: <Eye className="w-3 h-3" />,
  [ApplicationStatus.accepted]: <CheckCircle2 className="w-3 h-3" />,
  [ApplicationStatus.rejected]: <XCircle className="w-3 h-3" />,
};

export default function JobSeekerDashboard() {
  const { identity, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useCallerProfile();
  const { data: allJobs } = useAllJobs();
  const principal = identity?.getPrincipal();
  const { data: applications, isLoading: appsLoading } =
    useApplicationsByApplicant(principal);

  const isLoggedIn = loginStatus === "success" && !!identity;

  useEffect(() => {
    if (!isLoggedIn && loginStatus !== "logging-in") {
      navigate({ to: "/auth" });
    }
  }, [isLoggedIn, loginStatus, navigate]);

  function getJobForApp(jobId: bigint) {
    return allJobs?.find((j) => j.id === jobId);
  }

  const seekerName = profile?.jobSeekerProfile?.name || "Job Seeker";

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-navy text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Welcome back, {seekerName}!</h1>
          <p className="text-white/70 mt-1">
            Track your job applications and career progress
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Applied",
              value: applications?.length ?? 0,
              color: "text-primary",
            },
            {
              label: "Pending",
              value:
                applications?.filter(
                  (a) => a.status === ApplicationStatus.pending,
                ).length ?? 0,
              color: "text-gray-600",
            },
            {
              label: "Reviewed",
              value:
                applications?.filter(
                  (a) => a.status === ApplicationStatus.reviewed,
                ).length ?? 0,
              color: "text-yellow-600",
            },
            {
              label: "Accepted",
              value:
                applications?.filter(
                  (a) => a.status === ApplicationStatus.accepted,
                ).length ?? 0,
              color: "text-green-600",
            },
          ].map(({ label, value, color }) => (
            <Card key={label} className="border border-border shadow-xs">
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${color}`}>{value}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Applications */}
        <Card className="border border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">My Applications</CardTitle>
            <Button
              type="button"
              variant="outline"
              asChild
              size="sm"
              data-ocid="seeker_dashboard.browse_jobs.button"
            >
              <a href="/jobs">
                <Search className="w-4 h-4 mr-1" />
                Browse Jobs
              </a>
            </Button>
          </CardHeader>
          <CardContent>
            {appsLoading || profileLoading ? (
              <div
                className="space-y-3"
                data-ocid="seeker_dashboard.loading_state"
              >
                {Array.from({ length: 3 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader
                  <Skeleton key={i} className="h-20 rounded-lg" />
                ))}
              </div>
            ) : applications?.length === 0 ? (
              <div
                className="text-center py-12"
                data-ocid="seeker_dashboard.applications.empty_state"
              >
                <Briefcase className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-1">
                  No applications yet
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Start applying to jobs to see them here
                </p>
                <Button
                  type="button"
                  asChild
                  className="bg-primary text-primary-foreground"
                >
                  <a href="/jobs">Browse Jobs</a>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {applications?.map((app, i) => {
                  const job = getJobForApp(app.jobId);
                  const statusCfg = STATUS_CONFIG[app.status];
                  return (
                    <motion.div
                      key={app.id.toString()}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4 p-4 rounded-lg border border-border bg-white hover:shadow-xs transition-shadow"
                      data-ocid={`seeker_dashboard.applications.item.${i + 1}`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">
                          {job?.title || "Unknown Job"}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
                          {job?.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {job.location}
                            </span>
                          )}
                          {job?.salary && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              {job.salary}
                            </span>
                          )}
                          {job?.jobType && (
                            <span className="flex items-center gap-1 font-medium text-foreground/70 bg-muted px-1.5 py-0.5 rounded">
                              <Clock className="w-3 h-3" />
                              {JOB_TYPE_LABELS[job.jobType] ?? job.jobType}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge
                        className={`${statusCfg.color} border flex items-center gap-1 text-xs`}
                      >
                        {STATUS_ICONS[app.status]}
                        {statusCfg.label}
                      </Badge>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
