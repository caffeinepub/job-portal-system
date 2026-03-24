import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  DollarSign,
  Loader2,
  MapPin,
  Send,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAllJobs, useApplyToJob } from "../hooks/useQueries";

export default function JobDetailPage() {
  const { jobId } = useParams({ strict: false }) as { jobId: string };
  const navigate = useNavigate();
  const { identity, loginStatus } = useInternetIdentity();
  const { data: allJobs, isLoading } = useAllJobs();
  const applyMutation = useApplyToJob();
  const [coverLetter, setCoverLetter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const job = allJobs?.find((j) => j.id.toString() === jobId);
  const isLoggedIn = loginStatus === "success" && !!identity;

  async function handleApply() {
    if (!coverLetter.trim()) {
      toast.error("Please write a cover letter");
      return;
    }
    try {
      await applyMutation.mutateAsync({ jobId: BigInt(jobId), coverLetter });
      toast.success("Application submitted successfully!");
      setDialogOpen(false);
      setCoverLetter("");
    } catch {
      toast.error("Failed to submit application");
    }
  }

  if (isLoading) {
    return (
      <div
        className="container mx-auto px-4 py-12"
        data-ocid="job_detail.loading_state"
      >
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!job) {
    return (
      <div
        className="container mx-auto px-4 py-20 text-center"
        data-ocid="job_detail.error_state"
      >
        <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
        <p className="text-muted-foreground mb-6">
          This job listing may have been removed.
        </p>
        <Button type="button" onClick={() => navigate({ to: "/jobs" })}>
          Browse Jobs
        </Button>
      </div>
    );
  }

  const postedDate = new Date(
    Number(job.postedAt) / 1_000_000,
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-navy text-white py-8">
        <div className="container mx-auto px-4">
          <button
            type="button"
            onClick={() => navigate({ to: "/jobs" })}
            className="flex items-center gap-1 text-white/70 hover:text-white text-sm mb-4 transition-colors"
            data-ocid="job_detail.back.button"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Jobs
          </button>
          <h1 className="text-3xl font-bold mb-1">{job.title}</h1>
          <p className="text-white/80 text-lg">{job.company}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl border border-border p-6 shadow-xs">
              <h2 className="text-lg font-bold text-foreground mb-4">
                Job Description
              </h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-xl border border-border p-6 shadow-xs">
              <h3 className="font-semibold text-foreground mb-4">
                Job Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Company:</span>
                  <span className="font-medium text-foreground">
                    {job.company}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium text-foreground">
                    {job.location}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Salary:</span>
                  <span className="font-medium text-foreground">
                    {job.salary}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Category:</span>
                  <Badge variant="secondary">{job.category}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Posted:</span>
                  <span className="font-medium text-foreground">
                    {postedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Apply button */}
            {isLoggedIn ? (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    data-ocid="job_detail.apply.open_modal_button"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Apply Now
                  </Button>
                </DialogTrigger>
                <DialogContent data-ocid="job_detail.apply.dialog">
                  <DialogHeader>
                    <DialogTitle>Apply for {job.title}</DialogTitle>
                    <DialogDescription>
                      Write a compelling cover letter to stand out from other
                      applicants.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="cover-letter">Cover Letter *</Label>
                    <Textarea
                      id="cover-letter"
                      className="mt-2"
                      rows={6}
                      placeholder="Explain why you're the perfect fit for this role..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      data-ocid="job_detail.cover_letter.textarea"
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                      data-ocid="job_detail.apply.cancel_button"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleApply}
                      disabled={applyMutation.isPending}
                      className="bg-primary text-primary-foreground"
                      data-ocid="job_detail.apply.submit_button"
                    >
                      {applyMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <Button
                type="button"
                className="w-full bg-primary text-primary-foreground"
                onClick={() => navigate({ to: "/auth" })}
                data-ocid="job_detail.login_to_apply.button"
              >
                Login to Apply
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
