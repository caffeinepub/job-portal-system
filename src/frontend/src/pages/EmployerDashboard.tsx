import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  Briefcase,
  DollarSign,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "sonner";
import { ApplicationStatus, type JobListing, JobType } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllJobs,
  useApplicationsByJob,
  useCallerProfile,
  useDeleteJob,
  usePostJob,
  useUpdateApplicationStatus,
  useUpdateJob,
} from "../hooks/useQueries";

const CATEGORIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Creative",
  "Sales",
  "Engineering",
];

const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: JobType.full_time, label: "Full-time" },
  { value: JobType.part_time, label: "Part-time" },
  { value: JobType.contract, label: "Contract" },
  { value: JobType.remote, label: "Remote" },
  { value: JobType.internship, label: "Internship" },
  { value: JobType.freelance, label: "Freelance" },
];

const JOB_TYPE_LABELS: Record<JobType, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  remote: "Remote",
  internship: "Internship",
  freelance: "Freelance",
};

const STATUS_OPTS = [
  { value: ApplicationStatus.pending, label: "Pending" },
  { value: ApplicationStatus.reviewed, label: "Reviewed" },
  { value: ApplicationStatus.accepted, label: "Accepted" },
  { value: ApplicationStatus.rejected, label: "Rejected" },
];

const STATUS_COLORS: Record<string, string> = {
  [ApplicationStatus.pending]: "bg-gray-100 text-gray-700",
  [ApplicationStatus.reviewed]: "bg-yellow-100 text-yellow-700",
  [ApplicationStatus.accepted]: "bg-green-100 text-green-700",
  [ApplicationStatus.rejected]: "bg-red-100 text-red-700",
};

type JobFormData = {
  title: string;
  company: string;
  location: string;
  description: string;
  salary: string;
  category: string;
  jobType: JobType | "";
};

const EMPTY_FORM: JobFormData = {
  title: "",
  company: "",
  location: "",
  description: "",
  salary: "",
  category: "",
  jobType: "",
};

function JobApplicants({ jobId }: { jobId: bigint }) {
  const { data: applications, isLoading } = useApplicationsByJob(jobId);
  const updateStatus = useUpdateApplicationStatus();

  async function handleStatusChange(appId: bigint, status: ApplicationStatus) {
    try {
      await updateStatus.mutateAsync({ applicationId: appId, status });
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  }

  if (isLoading)
    return (
      <Skeleton
        className="h-20"
        data-ocid="employer_dashboard.applicants.loading_state"
      />
    );
  if (!applications?.length)
    return (
      <p
        className="text-sm text-muted-foreground py-4 text-center"
        data-ocid="employer_dashboard.applicants.empty_state"
      >
        No applicants yet for this position.
      </p>
    );

  return (
    <div className="space-y-2 mt-2">
      {applications.map((app, i) => (
        <div
          key={app.id.toString()}
          className="flex items-center justify-between p-3 bg-muted rounded-lg"
          data-ocid={`employer_dashboard.applicants.item.${i + 1}`}
        >
          <div>
            <p className="text-sm font-medium text-foreground">
              {app.applicant.toString().slice(0, 12)}...
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              {app.coverLetter}
            </p>
          </div>
          <Select
            value={app.status}
            onValueChange={(v) =>
              handleStatusChange(app.id, v as ApplicationStatus)
            }
          >
            <SelectTrigger
              className={`w-32 h-7 text-xs ${STATUS_COLORS[app.status]}`}
              data-ocid={`employer_dashboard.status.select.${i + 1}`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTS.map((o) => (
                <SelectItem key={o.value} value={o.value} className="text-xs">
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}

export default function EmployerDashboard() {
  const { identity, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useCallerProfile();
  const { data: allJobs, isLoading: jobsLoading } = useAllJobs();
  const postJob = usePostJob();
  const updateJob = useUpdateJob();
  const deleteJob = useDeleteJob();

  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobListing | null>(null);
  const [form, setForm] = useState<JobFormData>(EMPTY_FORM);
  const [expandedJob, setExpandedJob] = useState<bigint | null>(null);

  const isLoggedIn = loginStatus === "success" && !!identity;

  useEffect(() => {
    if (!isLoggedIn && loginStatus !== "logging-in") {
      navigate({ to: "/auth" });
    }
  }, [isLoggedIn, loginStatus, navigate]);

  const myJobs =
    allJobs?.filter(
      (j) => j.postedBy.toString() === identity?.getPrincipal().toString(),
    ) || [];
  const empName = profile?.employerProfile?.name || "Employer";

  function openNewJob() {
    setEditingJob(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEditJob(job: JobListing) {
    setEditingJob(job);
    setForm({
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      salary: job.salary,
      category: job.category,
      jobType: job.jobType,
    });
    setShowForm(true);
  }

  async function handleFormSubmit() {
    if (
      !form.title ||
      !form.company ||
      !form.location ||
      !form.description ||
      !form.salary ||
      !form.category ||
      !form.jobType
    ) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      if (editingJob) {
        await updateJob.mutateAsync({
          jobId: editingJob.id,
          title: form.title,
          company: form.company,
          location: form.location,
          description: form.description,
          salary: form.salary,
          category: form.category,
          jobType: form.jobType as JobType,
        });
        toast.success("Job updated!");
      } else {
        await postJob.mutateAsync({
          title: form.title,
          company: form.company,
          location: form.location,
          description: form.description,
          salary: form.salary,
          category: form.category,
          jobType: form.jobType as JobType,
        });
        toast.success("Job posted!");
      }
      setShowForm(false);
      setEditingJob(null);
      setForm(EMPTY_FORM);
    } catch {
      toast.error("Failed to save job");
    }
  }

  async function handleDelete(jobId: bigint) {
    try {
      await deleteJob.mutateAsync(jobId);
      toast.success("Job deleted");
    } catch {
      toast.error("Failed to delete job");
    }
  }

  const isPending = postJob.isPending || updateJob.isPending;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-navy text-white py-10">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Employer Dashboard</h1>
            <p className="text-white/70 mt-1">Welcome, {empName}</p>
          </div>
          <Button
            type="button"
            onClick={openNewJob}
            className="bg-white text-navy font-semibold hover:bg-white/90"
            data-ocid="employer_dashboard.post_job.open_modal_button"
          >
            <Plus className="w-4 h-4 mr-2" />
            Post a Job
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Jobs Posted", value: myJobs.length },
            {
              label: "Company",
              value: profile?.employerProfile?.company || "—",
            },
            {
              label: "Industry",
              value: profile?.employerProfile?.industry || "—",
            },
          ].map(({ label, value }) => (
            <Card key={label} className="border border-border shadow-xs">
              <CardContent className="p-4 text-center">
                <div className="text-xl font-bold text-primary">{value}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Job Listings */}
        <Card className="border border-border shadow-xs">
          <CardHeader>
            <CardTitle className="text-lg">My Job Listings</CardTitle>
          </CardHeader>
          <CardContent>
            {jobsLoading || profileLoading ? (
              <div
                className="space-y-4"
                data-ocid="employer_dashboard.jobs.loading_state"
              >
                {Array.from({ length: 3 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                  <Skeleton key={i} className="h-24 rounded-lg" />
                ))}
              </div>
            ) : myJobs.length === 0 ? (
              <div
                className="text-center py-12"
                data-ocid="employer_dashboard.jobs.empty_state"
              >
                <Briefcase className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold mb-1">No jobs posted yet</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Post your first job to start receiving applications
                </p>
                <Button
                  type="button"
                  onClick={openNewJob}
                  className="bg-primary text-primary-foreground"
                  data-ocid="employer_dashboard.post_first_job.button"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Post a Job
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {myJobs.map((job, i) => (
                  <motion.div
                    key={job.id.toString()}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border border-border rounded-xl p-5 bg-white"
                    data-ocid={`employer_dashboard.jobs.item.${i + 1}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {job.salary}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {job.category}
                          </Badge>
                          {job.jobType && (
                            <Badge variant="outline" className="text-xs">
                              {JOB_TYPE_LABELS[job.jobType] ?? job.jobType}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setExpandedJob(
                              expandedJob === job.id ? null : job.id,
                            )
                          }
                          data-ocid={`employer_dashboard.view_applicants.button.${i + 1}`}
                        >
                          <Users className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditJob(job)}
                          data-ocid={`employer_dashboard.edit_job.button.${i + 1}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              data-ocid={`employer_dashboard.delete_job.button.${i + 1}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent data-ocid="employer_dashboard.delete_confirm.dialog">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Job?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently remove the job listing and
                                all associated applications.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel data-ocid="employer_dashboard.delete_confirm.cancel_button">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(job.id)}
                                className="bg-destructive text-destructive-foreground"
                                data-ocid="employer_dashboard.delete_confirm.confirm_button"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>

                    {/* Applicants panel */}
                    {expandedJob === job.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4 pt-4 border-t border-border"
                      >
                        <h4 className="text-sm font-semibold text-foreground mb-2">
                          Applications
                        </h4>
                        <JobApplicants jobId={job.id} />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Post/Edit Job Dialog */}
      <Dialog
        open={showForm}
        onOpenChange={(o) => {
          setShowForm(o);
          if (!o) {
            setEditingJob(null);
            setForm(EMPTY_FORM);
          }
        }}
      >
        <DialogContent
          className="max-w-lg"
          data-ocid="employer_dashboard.job_form.dialog"
        >
          <DialogHeader>
            <DialogTitle>
              {editingJob ? "Edit Job" : "Post a New Job"}
            </DialogTitle>
            <DialogDescription>Fill in the job details below</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Job Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Software Engineer"
                  className="mt-1"
                  data-ocid="employer_dashboard.job_title.input"
                />
              </div>
              <div>
                <Label>Company *</Label>
                <Input
                  value={form.company}
                  onChange={(e) =>
                    setForm({ ...form, company: e.target.value })
                  }
                  placeholder="Company name"
                  className="mt-1"
                  data-ocid="employer_dashboard.company.input"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Location *</Label>
                <Input
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  placeholder="e.g. New York, NY"
                  className="mt-1"
                  data-ocid="employer_dashboard.location.input"
                />
              </div>
              <div>
                <Label>Salary *</Label>
                <Input
                  value={form.salary}
                  onChange={(e) => setForm({ ...form, salary: e.target.value })}
                  placeholder="e.g. $80K–$100K"
                  className="mt-1"
                  data-ocid="employer_dashboard.salary.input"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category *</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm({ ...form, category: v })}
                >
                  <SelectTrigger
                    className="mt-1"
                    data-ocid="employer_dashboard.category.select"
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Job Type *</Label>
                <Select
                  value={form.jobType}
                  onValueChange={(v) =>
                    setForm({ ...form, jobType: v as JobType })
                  }
                >
                  <SelectTrigger
                    className="mt-1"
                    data-ocid="employer_dashboard.job_type.select"
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Description *</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Describe the role, requirements, and benefits..."
                className="mt-1"
                rows={4}
                data-ocid="employer_dashboard.description.textarea"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowForm(false)}
              data-ocid="employer_dashboard.job_form.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleFormSubmit}
              disabled={isPending}
              className="bg-primary text-primary-foreground"
              data-ocid="employer_dashboard.job_form.submit_button"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {editingJob ? "Updating..." : "Posting..."}
                </>
              ) : editingJob ? (
                "Update Job"
              ) : (
                "Post Job"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
