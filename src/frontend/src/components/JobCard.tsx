import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { motion } from "motion/react";
import type { JobListing, JobType } from "../backend.d";

interface JobCardProps {
  job: JobListing;
  index?: number;
}

const JOB_TYPE_LABELS: Record<JobType, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  remote: "Remote",
  internship: "Internship",
  freelance: "Freelance",
};

const CATEGORY_COLORS: Record<
  string,
  { border: string; bg: string; text: string; dot: string }
> = {
  Technology: {
    border: "oklch(0.64 0.19 221)",
    bg: "oklch(0.64 0.19 221 / 0.10)",
    text: "oklch(0.55 0.20 228)",
    dot: "oklch(0.64 0.19 221)",
  },
  Finance: {
    border: "oklch(0.60 0.18 145)",
    bg: "oklch(0.60 0.18 145 / 0.10)",
    text: "oklch(0.48 0.18 148)",
    dot: "oklch(0.60 0.18 145)",
  },
  Healthcare: {
    border: "oklch(0.68 0.18 182)",
    bg: "oklch(0.68 0.18 182 / 0.10)",
    text: "oklch(0.52 0.17 186)",
    dot: "oklch(0.68 0.18 182)",
  },
  Creative: {
    border: "oklch(0.65 0.22 310)",
    bg: "oklch(0.65 0.22 310 / 0.10)",
    text: "oklch(0.52 0.20 310)",
    dot: "oklch(0.65 0.22 310)",
  },
  Sales: {
    border: "oklch(0.72 0.18 68)",
    bg: "oklch(0.72 0.18 68 / 0.10)",
    text: "oklch(0.55 0.17 70)",
    dot: "oklch(0.72 0.18 68)",
  },
  Engineering: {
    border: "oklch(0.65 0.20 30)",
    bg: "oklch(0.65 0.20 30 / 0.10)",
    text: "oklch(0.52 0.18 30)",
    dot: "oklch(0.65 0.20 30)",
  },
};

const DEFAULT_COLOR = {
  border: "oklch(0.55 0.22 264)",
  bg: "oklch(0.55 0.22 264 / 0.10)",
  text: "oklch(0.45 0.20 264)",
  dot: "oklch(0.55 0.22 264)",
};

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, oklch(0.64 0.19 221), oklch(0.55 0.22 264))",
  "linear-gradient(135deg, oklch(0.60 0.18 145), oklch(0.55 0.18 175))",
  "linear-gradient(135deg, oklch(0.65 0.22 310), oklch(0.55 0.22 264))",
  "linear-gradient(135deg, oklch(0.72 0.18 68), oklch(0.65 0.20 30))",
  "linear-gradient(135deg, oklch(0.68 0.18 182), oklch(0.64 0.19 221))",
  "linear-gradient(135deg, oklch(0.65 0.20 30), oklch(0.72 0.18 68))",
];

export default function JobCard({ job, index = 1 }: JobCardProps) {
  const initials = job.company
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  const colors = CATEGORY_COLORS[job.category] ?? DEFAULT_COLOR;
  const avatarGradient =
    AVATAR_GRADIENTS[(index - 1) % AVATAR_GRADIENTS.length];
  const isNew = Date.now() - Number(job.postedAt) < 7 * 24 * 60 * 60 * 1000;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group bg-card rounded-2xl overflow-hidden relative cursor-pointer"
      style={{
        boxShadow: "0 2px 12px 0 rgba(8,15,42,0.08)",
        border: "1px solid oklch(0.90 0.010 248)",
        transition: "box-shadow 0.2s ease",
      }}
      data-ocid={`jobs.item.${index}`}
    >
      {/* Left accent border */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{ background: colors.border }}
      />

      <div className="pl-5 pr-5 pt-5 pb-4">
        {/* Header row */}
        <div className="flex items-start gap-3 mb-3">
          {/* Avatar */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
            style={{ background: avatarGradient }}
          >
            {initials || "?"}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <h3 className="font-semibold text-foreground text-base leading-tight truncate">
                {job.title}
              </h3>
              {isNew && (
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 text-white"
                  style={{
                    background:
                      "linear-gradient(90deg, oklch(0.64 0.19 221), oklch(0.55 0.22 264))",
                  }}
                >
                  NEW
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-sm font-medium truncate">
              {job.company}
            </p>
          </div>
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ background: colors.bg, color: colors.text }}
          >
            {job.category}
          </span>
          {job.jobType && (
            <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border">
              {JOB_TYPE_LABELS[job.jobType] ?? job.jobType}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full">
            <MapPin className="w-3 h-3" />
            {job.location}
          </span>
          {job.salary && (
            <span
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{
                background: "oklch(0.60 0.18 145 / 0.10)",
                color: "oklch(0.48 0.18 148)",
              }}
            >
              {job.salary}
            </span>
          )}
        </div>

        {/* Description preview */}
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">
          {job.description}
        </p>

        {/* Action */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {new Date(Number(job.postedAt)).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
          <Button
            asChild
            size="sm"
            className="text-white font-semibold text-xs px-4"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.64 0.19 221), oklch(0.55 0.22 264))",
            }}
            data-ocid={`jobs.view_detail.button.${index}`}
          >
            <Link to="/jobs/$jobId" params={{ jobId: job.id.toString() }}>
              View Details
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
