import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Briefcase, Layers, MapPin, Search, X } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { JobType } from "../backend.d";
import JobCard from "../components/JobCard";
import { useAllJobs } from "../hooks/useQueries";

const CATEGORIES = [
  "All",
  "Technology",
  "Finance",
  "Healthcare",
  "Creative",
  "Sales",
  "Engineering",
];

const JOB_TYPES: { value: string; label: string }[] = [
  { value: "All", label: "All Types" },
  { value: JobType.full_time, label: "Full-time" },
  { value: JobType.part_time, label: "Part-time" },
  { value: JobType.contract, label: "Contract" },
  { value: JobType.remote, label: "Remote" },
  { value: JobType.internship, label: "Internship" },
  { value: JobType.freelance, label: "Freelance" },
];

export default function JobsPage() {
  const search = useSearch({ strict: false }) as {
    q?: string;
    location?: string;
    category?: string;
  };
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState(search.q || "");
  const [location, setLocation] = useState(search.location || "");
  const [category, setCategory] = useState(search.category || "All");
  const [jobType, setJobType] = useState("All");

  const { data: allJobs, isLoading } = useAllJobs();

  const filtered = useMemo(() => {
    if (!allJobs) return [];
    return allJobs.filter((job) => {
      const kw = keyword.toLowerCase();
      const loc = location.toLowerCase();
      const matchKw =
        !kw ||
        job.title.toLowerCase().includes(kw) ||
        job.company.toLowerCase().includes(kw) ||
        job.description.toLowerCase().includes(kw);
      const matchLoc = !loc || job.location.toLowerCase().includes(loc);
      const matchCat =
        !category || category === "All" || job.category === category;
      const matchType =
        !jobType || jobType === "All" || job.jobType === jobType;
      return matchKw && matchLoc && matchCat && matchType;
    });
  }, [allJobs, keyword, location, category, jobType]);

  function clearFilters() {
    setKeyword("");
    setLocation("");
    setCategory("All");
    setJobType("All");
    navigate({ to: "/jobs" });
  }

  const hasFilters =
    keyword ||
    location ||
    (category && category !== "All") ||
    (jobType && jobType !== "All");

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="bg-navy text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Browse Jobs</h1>
          <p className="text-white/70">
            Discover opportunities that match your skills and interests
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-xs border border-border p-4 mb-8 flex flex-col md:flex-row gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-1 border border-border rounded-lg px-3 py-2 min-w-[160px]">
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <Input
              placeholder="Job title, keyword, or company"
              className="border-0 shadow-none p-0 h-auto focus-visible:ring-0"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              data-ocid="jobs.search_input"
            />
          </div>
          <div className="flex items-center gap-2 flex-1 border border-border rounded-lg px-3 py-2 min-w-[140px]">
            <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <Input
              placeholder="Location"
              className="border-0 shadow-none p-0 h-auto focus-visible:ring-0"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              data-ocid="jobs.location_input"
            />
          </div>
          <div className="flex-1 min-w-[140px]">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger data-ocid="jobs.category.select">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-muted-foreground" />
                  <SelectValue placeholder="Category" />
                </div>
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
          <div className="flex-1 min-w-[140px]">
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger data-ocid="jobs.job_type.select">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <SelectValue placeholder="Job Type" />
                </div>
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
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground"
              data-ocid="jobs.clear_filters.button"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {isLoading
              ? "Loading jobs..."
              : `${filtered.length} job${filtered.length !== 1 ? "s" : ""} found`}
          </p>
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="jobs.loading_state"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20" data-ocid="jobs.empty_state">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              No jobs found
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Try adjusting your filters or search terms
            </p>
            <Button
              variant="outline"
              onClick={clearFilters}
              data-ocid="jobs.reset.button"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((job, i) => (
              <motion.div
                key={job.id.toString()}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <JobCard job={job} index={i + 1} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
