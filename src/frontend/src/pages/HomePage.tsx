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
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  Building,
  CheckCircle2,
  Layers,
  MapPin,
  Search,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { JobListing } from "../backend.d";
import JobCard from "../components/JobCard";
import { useAllJobs } from "../hooks/useQueries";

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Creative",
  "Sales",
  "Engineering",
];
const INDUSTRY_COLORS = [
  "bg-blue-50 border-blue-200 hover:bg-blue-100",
  "bg-green-50 border-green-200 hover:bg-green-100",
  "bg-rose-50 border-rose-200 hover:bg-rose-100",
  "bg-purple-50 border-purple-200 hover:bg-purple-100",
  "bg-orange-50 border-orange-200 hover:bg-orange-100",
  "bg-teal-50 border-teal-200 hover:bg-teal-100",
];

// Sample jobs for initial load (before backend data)
const SAMPLE_JOBS: JobListing[] = [
  {
    id: 1n,
    title: "Senior Frontend Engineer",
    company: "TechVision Inc.",
    location: "San Francisco, CA",
    description: "Build scalable web applications using React and TypeScript.",
    salary: "$120K – $160K",
    category: "Technology",
    postedAt: BigInt(Date.now()),
    postedBy: "" as unknown as import("@icp-sdk/core/principal").Principal,
  },
  {
    id: 2n,
    title: "Product Marketing Manager",
    company: "GrowthLabs",
    location: "New York, NY",
    description: "Lead go-to-market strategy for our SaaS products.",
    salary: "$95K – $125K",
    category: "Sales",
    postedAt: BigInt(Date.now()),
    postedBy: "" as unknown as import("@icp-sdk/core/principal").Principal,
  },
  {
    id: 3n,
    title: "Data Scientist",
    company: "AnalyticsPro",
    location: "Austin, TX",
    description: "Develop ML models for predictive analytics.",
    salary: "$110K – $145K",
    category: "Technology",
    postedAt: BigInt(Date.now()),
    postedBy: "" as unknown as import("@icp-sdk/core/principal").Principal,
  },
  {
    id: 4n,
    title: "UX/UI Designer",
    company: "DesignStudio",
    location: "Remote",
    description: "Create intuitive and beautiful user experiences.",
    salary: "$85K – $115K",
    category: "Creative",
    postedAt: BigInt(Date.now()),
    postedBy: "" as unknown as import("@icp-sdk/core/principal").Principal,
  },
  {
    id: 5n,
    title: "Financial Analyst",
    company: "Capital Partners",
    location: "Chicago, IL",
    description: "Analyze financial data and prepare reports for leadership.",
    salary: "$80K – $105K",
    category: "Finance",
    postedAt: BigInt(Date.now()),
    postedBy: "" as unknown as import("@icp-sdk/core/principal").Principal,
  },
  {
    id: 6n,
    title: "Mechanical Engineer",
    company: "BuildTech Corp",
    location: "Seattle, WA",
    description:
      "Design and test mechanical systems for industrial applications.",
    salary: "$90K – $120K",
    category: "Engineering",
    postedAt: BigInt(Date.now()),
    postedBy: "" as unknown as import("@icp-sdk/core/principal").Principal,
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const { data: jobs, isLoading } = useAllJobs();

  const featuredJobs = (jobs && jobs.length > 0 ? jobs : SAMPLE_JOBS).slice(
    0,
    6,
  );

  function handleSearch() {
    const params = new URLSearchParams();
    if (keyword) params.set("q", keyword);
    if (location) params.set("location", location);
    if (category) params.set("category", category);
    navigate({ to: "/jobs", search: Object.fromEntries(params) });
  }

  return (
    <div>
      {/* Hero */}
      <section
        className="relative min-h-[560px] flex items-center justify-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(11,62,95,0.72), rgba(11,62,95,0.85)), url('/assets/generated/hero-office.dim_1600x900.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4 text-center z-10">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
          >
            Find Your Dream Job Today
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg md:text-xl text-white/80 mb-10 max-w-xl mx-auto"
          >
            Connect with top employers and discover thousands of career
            opportunities across every industry.
          </motion.p>

          {/* Search form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-xl p-4 md:p-5 max-w-3xl mx-auto flex flex-col md:flex-row gap-3"
          >
            <div className="flex items-center gap-2 flex-1 border border-border rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <Input
                placeholder="Job title or keyword"
                className="border-0 shadow-none p-0 h-auto focus-visible:ring-0 text-foreground placeholder:text-muted-foreground"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                data-ocid="hero.search_input"
              />
            </div>
            <div className="flex items-center gap-2 flex-1 border border-border rounded-lg px-3 py-2">
              <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <Input
                placeholder="Location"
                className="border-0 shadow-none p-0 h-auto focus-visible:ring-0 text-foreground placeholder:text-muted-foreground"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                data-ocid="hero.location_input"
              />
            </div>
            <div className="flex-1">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger
                  className="border border-border h-full"
                  data-ocid="hero.category.select"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-muted-foreground" />
                    <SelectValue placeholder="Category" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((i) => (
                    <SelectItem key={i} value={i}>
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              onClick={handleSearch}
              className="bg-blue-accent hover:bg-blue-accent/90 text-white px-6 whitespace-nowrap"
              data-ocid="hero.search.button"
            >
              Search Jobs
            </Button>
          </motion.div>

          <p className="mt-5 text-white/60 text-sm">
            Popular: Software Engineer, Marketing Manager, Data Analyst, UX
            Designer
          </p>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Featured Job Listings
            </h2>
            <p className="text-muted-foreground">
              Explore the latest opportunities from top companies
            </p>
          </div>
          {isLoading ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              data-ocid="jobs.loading_state"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader
                <Skeleton key={i} className="h-40 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job, i) => (
                <motion.div
                  key={job.id.toString()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <JobCard job={job} index={i + 1} />
                </motion.div>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Button
              variant="outline"
              asChild
              className="border-primary text-primary hover:bg-primary/5"
              data-ocid="featured_jobs.view_all.button"
            >
              <a href="/jobs">
                View All Jobs <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* For Job Seekers & Employers */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-10">
            Who We Serve
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Job Seekers */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-background rounded-2xl p-8 border border-border"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  For Job Seekers
                </h3>
              </div>
              <ul className="space-y-3 mb-6">
                {[
                  "Browse thousands of verified job listings",
                  "Apply with a single click",
                  "Track application status in real time",
                  "Get notified for matching opportunities",
                  "Build a professional profile",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                type="button"
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
                asChild
                data-ocid="seeker_card.cta.button"
              >
                <a href="/auth">Get Started Free</a>
              </Button>
            </motion.div>

            {/* Employers */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-navy rounded-2xl p-8 text-white"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">For Employers</h3>
              </div>
              <ul className="space-y-3 mb-6">
                {[
                  "Post unlimited job listings",
                  "Reach thousands of qualified candidates",
                  "Manage applications from a central dashboard",
                  "Advanced filtering and screening tools",
                  "Analytics & hiring insights",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-white/80"
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-300 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                type="button"
                className="bg-white text-navy hover:bg-white/90 w-full font-semibold"
                asChild
                data-ocid="employer_card.cta.button"
              >
                <a href="/auth">Post a Job Now</a>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Explore Industries */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-3">
            Explore Industries
          </h2>
          <p className="text-center text-muted-foreground mb-10">
            Find jobs in your field of expertise
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {INDUSTRIES.map((industry, i) => (
              <motion.button
                type="button"
                key={industry}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() =>
                  navigate({ to: "/jobs", search: { category: industry } })
                }
                className={`${INDUSTRY_COLORS[i]} border rounded-full py-3 px-6 text-center text-sm font-semibold text-foreground transition-all cursor-pointer`}
                data-ocid={`industry.${industry.toLowerCase()}.button`}
              >
                {industry}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-navy text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              {
                icon: <Briefcase className="w-6 h-6" />,
                value: "12,400+",
                label: "Active Jobs",
              },
              {
                icon: <Building className="w-6 h-6" />,
                value: "3,200+",
                label: "Companies",
              },
              {
                icon: <Users className="w-6 h-6" />,
                value: "890K+",
                label: "Job Seekers",
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                value: "94%",
                label: "Placement Rate",
              },
            ].map(({ icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className="text-blue-300">{icon}</div>
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-white/60 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
