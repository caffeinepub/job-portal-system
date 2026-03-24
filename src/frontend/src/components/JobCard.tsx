import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { Briefcase, Building2, DollarSign, MapPin } from "lucide-react";
import type { JobListing } from "../backend.d";

interface JobCardProps {
  job: JobListing;
  index?: number;
}

export default function JobCard({ job, index = 1 }: JobCardProps) {
  const initials = job.company
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <Card
      className="shadow-card hover:shadow-md transition-shadow border border-border bg-card"
      data-ocid={`jobs.item.${index}`}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Company logo placeholder */}
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-bold text-sm">
              {initials || <Building2 className="w-5 h-5 text-primary" />}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-base leading-tight mb-1 truncate">
              {job.title}
            </h3>
            <p className="text-muted-foreground text-sm mb-3 truncate">
              {job.company}
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                {job.salary}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                <Briefcase className="w-3 h-3 mr-1" />
                {job.category}
              </Badge>
              <Button
                asChild
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-ocid={`jobs.view_detail.button.${index}`}
              >
                <Link to="/jobs/$jobId" params={{ jobId: job.id.toString() }}>
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
