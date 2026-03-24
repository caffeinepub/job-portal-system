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
  ArrowDown,
  ArrowRight,
  BarChart3,
  Briefcase,
  Building,
  CheckCircle2,
  Layers,
  MapPin,
  Quote,
  Search,
  Star,
  Trophy,
  UserPlus,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { type JobListing, JobType } from "../backend.d";
import JobCard from "../components/JobCard";
import { useAllJobs } from "../hooks/useQueries";

const INDUSTRIES = [
  {
    name: "Technology",
    image: "/assets/generated/industry-tech.dim_600x400.jpg",
    count: "4,200+ jobs",
  },
  {
    name: "Finance",
    image: "/assets/generated/industry-finance.dim_600x400.jpg",
    count: "1,800+ jobs",
  },
  {
    name: "Healthcare",
    image: "/assets/generated/industry-health.dim_600x400.jpg",
    count: "2,500+ jobs",
  },
  {
    name: "Creative",
    image: "/assets/generated/industry-creative.dim_600x400.jpg",
    count: "900+ jobs",
  },
  {
    name: "Sales",
    image: "/assets/generated/industry-sales.dim_600x400.jpg",
    count: "1,400+ jobs",
  },
  {
    name: "Engineering",
    image: "/assets/generated/industry-engineering.dim_600x400.jpg",
    count: "1,600+ jobs",
  },
];

const TRUSTED_COMPANIES = [
  "Google",
  "Microsoft",
  "Amazon",
  "Meta",
  "Stripe",
  "Airbnb",
  "Netflix",
  "Apple",
  "Spotify",
  "Uber",
];

const STATS = [
  {
    icon: <Briefcase className="w-6 h-6" />,
    value: 12400,
    suffix: "+",
    label: "Active Jobs",
  },
  {
    icon: <Building className="w-6 h-6" />,
    value: 3200,
    suffix: "+",
    label: "Companies",
  },
  {
    icon: <Users className="w-6 h-6" />,
    value: 890,
    suffix: "K+",
    label: "Job Seekers",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    value: 94,
    suffix: "%",
    label: "Placement Rate",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "CareerHub completely changed my job search. I landed my dream role at a top tech company within 3 weeks of signing up. The platform is intuitive and the job quality is excellent.",
    name: "Sarah Chen",
    title: "Senior Software Engineer",
    company: "TechVision Inc.",
    initials: "SC",
    color:
      "linear-gradient(135deg, oklch(0.64 0.19 221), oklch(0.55 0.22 264))",
  },
  {
    quote:
      "As an employer, the quality of candidates we receive through CareerHub is unmatched. The dashboard makes managing applications effortless. We've made 12 hires this year alone.",
    name: "Marcus Williams",
    title: "Head of Talent Acquisition",
    company: "GrowthLabs",
    initials: "MW",
    color:
      "linear-gradient(135deg, oklch(0.60 0.18 145), oklch(0.55 0.18 175))",
  },
  {
    quote:
      "Switched from three other job platforms to CareerHub and never looked back. The salary transparency and company culture insights helped me negotiate a 40% raise in my new position.",
    name: "Priya Patel",
    title: "Product Marketing Manager",
    company: "DesignStudio",
    initials: "PP",
    color: "linear-gradient(135deg, oklch(0.72 0.18 68), oklch(0.65 0.20 30))",
  },
];

const SAMPLE_JOBS: JobListing[] = [
  {
    id: 1n,
    title: "Senior Frontend Engineer",
    company: "TechVision Inc.",
    location: "San Francisco, CA",
    description:
      "Build scalable web applications using React and TypeScript in a collaborative team environment.",
    salary: "$120K \u2013 $160K",
    category: "Technology",
    jobType: JobType.full_time,
    postedAt: BigInt(Date.now() - 86400000),
    postedBy: "" as unknown as import("@icp-sdk/core/principal").Principal,
  },
  {
    id: 2n,
    title: "Product Marketing Manager",
    company: "GrowthLabs",
    location: "New York, NY",
    description:
      "Lead go-to-market strategy for our SaaS products and drive pipeline growth.",
    salary: "$95K \u2013 $125K",
    category: "Sales",
    jobType: JobType.full_time,
    postedAt: BigInt(Date.now() - 2 * 86400000),
    postedBy: "" as unknown as import("@icp-sdk/core/principal").Principal,
  },
  {
    id: 3n,
    title: "Data Scientist",
    company: "AnalyticsPro",
    location: "Austin, TX",
    description:
      "Develop ML models for predictive analytics and provide actionable insights.",
    salary: "$110K \u2013 $145K",
    category: "Technology",
    jobType: JobType.remote,
    postedAt: BigInt(Date.now() - 86400000),
    postedBy: "" as unknown as import("@icp-sdk/core/principal").Principal,
  },
  {
    id: 4n,
    title: "UX/UI Designer",
    company: "DesignStudio",
    location: "Remote",
    description:
      "Create intuitive and beautiful user experiences for millions of users worldwide.",
    salary: "$85K \u2013 $115K",
    category: "Creative",
    jobType: JobType.remote,
    postedAt: BigInt(Date.now() - 3 * 86400000),
    postedBy: "" as unknown as import("@icp-sdk/core/principal").Principal,
  },
  {
    id: 5n,
    title: "Financial Analyst",
    company: "Capital Partners",
    location: "Chicago, IL",
    description:
      "Analyze financial data and prepare detailed reports for executive leadership.",
    salary: "$80K \u2013 $105K",
    category: "Finance",
    jobType: JobType.contract,
    postedAt: BigInt(Date.now() - 5 * 86400000),
    postedBy: "" as unknown as import("@icp-sdk/core/principal").Principal,
  },
  {
    id: 6n,
    title: "Mechanical Engineer",
    company: "BuildTech Corp",
    location: "Seattle, WA",
    description:
      "Design and test mechanical systems for cutting-edge industrial applications.",
    salary: "$90K \u2013 $120K",
    category: "Engineering",
    jobType: JobType.full_time,
    postedAt: BigInt(Date.now() - 4 * 86400000),
    postedBy: "" as unknown as import("@icp-sdk/core/principal").Principal,
  },
];

// Animated counter hook
function useCounter(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatItem({
  icon,
  value,
  suffix,
  label,
}: { icon: React.ReactNode; value: number; suffix: string; label: string }) {
  const [started, setStarted] = useState(false);
  const count = useCounter(value, 1800, started);
  return (
    <motion.div
      className="flex flex-col items-center gap-2 text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onViewportEnter={() => setStarted(true)}
      transition={{ duration: 0.5 }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-1"
        style={{
          background: "oklch(0.64 0.19 221 / 0.15)",
          color: "oklch(0.75 0.18 221)",
        }}
      >
        {icon}
      </div>
      <div className="text-3xl font-extrabold text-white stat-counter tracking-tight">
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-white/50 text-sm font-medium">{label}</div>
    </motion.div>
  );
}

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
    <div className="overflow-x-hidden">
      {/* \u2500\u2500\u2500 HERO \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
      <section
        className="relative min-h-screen flex items-center justify-center text-white"
        style={{
          backgroundImage: `url('/assets/generated/hero-office.dim_1600x900.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, oklch(0.08 0.045 264 / 0.97) 0%, oklch(0.12 0.055 255 / 0.90) 50%, oklch(0.16 0.065 240 / 0.80) 100%)",
          }}
        />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* Floating stat badges */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-24 left-[5%] lg:left-[8%] hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold"
          style={{
            background: "oklch(0.12 0.045 264 / 0.75)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{
              background: "oklch(0.64 0.19 221)",
              boxShadow: "0 0 8px oklch(0.64 0.19 221)",
            }}
          />
          12K+ Active Jobs
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-36 right-[5%] lg:right-[8%] hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold"
          style={{
            background: "oklch(0.12 0.045 264 / 0.75)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{
              background: "oklch(0.72 0.18 68)",
              boxShadow: "0 0 8px oklch(0.72 0.18 68)",
            }}
          />
          3.2K Companies
        </motion.div>

        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-40 left-[5%] lg:left-[10%] hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold"
          style={{
            background: "oklch(0.12 0.045 264 / 0.75)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{
              background: "oklch(0.60 0.18 145)",
              boxShadow: "0 0 8px oklch(0.60 0.18 145)",
            }}
          />
          94% Placement Rate
        </motion.div>

        {/* Main content */}
        <div className="container mx-auto px-4 text-center z-10 py-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8"
            style={{
              background: "oklch(0.64 0.19 221 / 0.15)",
              border: "1px solid oklch(0.64 0.19 221 / 0.30)",
              color: "oklch(0.75 0.18 221)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "oklch(0.64 0.19 221)" }}
            />
            Over 12,000 Jobs Added This Month
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-[1.05] tracking-tight"
          >
            Find Your{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.78 0.19 221), oklch(0.70 0.22 264))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Dream Career
            </span>
            <br />
            <span className="text-white">Starts Here</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg md:text-xl text-white/65 mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Connect with top employers and discover thousands of career
            opportunities across every industry. Your next big move is one
            search away.
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-2xl p-2 max-w-3xl mx-auto flex flex-col md:flex-row gap-2"
            style={{
              boxShadow:
                "0 24px 64px 0 rgba(0,0,0,0.35), 0 4px 16px 0 rgba(14,165,233,0.15)",
            }}
          >
            <div className="flex items-center gap-2 flex-1 rounded-xl px-3 py-2 bg-background/60">
              <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <Input
                placeholder="Job title or keyword\u2026"
                className="border-0 shadow-none p-0 h-auto focus-visible:ring-0 text-foreground placeholder:text-muted-foreground bg-transparent"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                data-ocid="hero.search_input"
              />
            </div>
            <div className="flex items-center gap-2 flex-1 rounded-xl px-3 py-2 bg-background/60">
              <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <Input
                placeholder="City or remote\u2026"
                className="border-0 shadow-none p-0 h-auto focus-visible:ring-0 text-foreground placeholder:text-muted-foreground bg-transparent"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                data-ocid="hero.location_input"
              />
            </div>
            <div className="flex-1">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger
                  className="border-0 bg-background/60 rounded-xl h-full"
                  data-ocid="hero.category.select"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-muted-foreground" />
                    <SelectValue placeholder="All Categories" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((i) => (
                    <SelectItem key={i.name} value={i.name}>
                      {i.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              onClick={handleSearch}
              className="font-bold text-white px-6 py-3 rounded-xl whitespace-nowrap"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.64 0.19 221), oklch(0.55 0.22 264))",
                boxShadow: "0 4px 16px 0 rgba(14,165,233,0.40)",
              }}
              data-ocid="hero.search.button"
            >
              <Search className="w-4 h-4 mr-2" />
              Search Jobs
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-5 text-white/40 text-sm"
          >
            Popular:{" "}
            {[
              "Software Engineer",
              "Marketing Manager",
              "Data Analyst",
              "UX Designer",
            ].map((term, i) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setKeyword(term);
                  handleSearch();
                }}
                className="text-white/60 hover:text-white underline underline-offset-2 transition-colors"
              >
                {term}
                {i < 3 ? "," : ""}{" "}
              </button>
            ))}
          </motion.p>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40"
        >
          <ArrowDown className="w-5 h-5" />
        </motion.div>
      </section>

      {/* \u2500\u2500\u2500 TRUST BAR \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
      <section className="py-5 bg-white border-y border-border overflow-hidden">
        <div className="container mx-auto px-4">
          <p className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            Trusted by talent teams at
          </p>
          <div className="flex items-center justify-center flex-wrap gap-3">
            {TRUSTED_COMPANIES.map((company) => (
              <span
                key={company}
                className="px-4 py-1.5 rounded-full text-sm font-semibold text-muted-foreground bg-muted/60 border border-border"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* \u2500\u2500\u2500 FEATURED JOBS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              style={{
                background: "oklch(0.64 0.19 221 / 0.10)",
                color: "oklch(0.55 0.20 228)",
              }}
            >
              Latest Opportunities
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-3 tracking-tight">
              Featured Job Listings
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Explore hand-picked opportunities from the world's leading
              companies
            </p>
          </motion.div>

          {isLoading ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              data-ocid="jobs.loading_state"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                <Skeleton key={i} className="h-52 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job, i) => (
                <motion.div
                  key={job.id.toString()}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <JobCard job={job} index={i + 1} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Button
              variant="outline"
              asChild
              className="border-2 font-semibold px-6 py-2.5"
              style={{
                borderColor: "oklch(0.64 0.19 221)",
                color: "oklch(0.55 0.20 228)",
              }}
              data-ocid="featured_jobs.view_all.button"
            >
              <a href="/jobs">
                View All Jobs <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* \u2500\u2500\u2500 HOW IT WORKS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
      <section
        className="py-20"
        style={{ background: "oklch(0.97 0.006 248)" }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              style={{
                background: "oklch(0.60 0.18 145 / 0.12)",
                color: "oklch(0.42 0.17 148)",
              }}
            >
              Simple Process
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
              How It Works
            </h2>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            {/* Connector line */}
            <div
              className="absolute top-8 left-[16.67%] right-[16.67%] h-px hidden md:block"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.64 0.19 221), oklch(0.55 0.22 264))",
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  icon: <UserPlus className="w-6 h-6 text-white" />,
                  step: "01",
                  title: "Create Your Profile",
                  desc: "Sign up and build a compelling profile that showcases your skills and experience to top employers.",
                },
                {
                  icon: <Search className="w-6 h-6 text-white" />,
                  step: "02",
                  title: "Browse & Apply",
                  desc: "Search thousands of curated jobs, filter by location, salary, and industry, then apply in one click.",
                },
                {
                  icon: <Trophy className="w-6 h-6 text-white" />,
                  step: "03",
                  title: "Get Hired",
                  desc: "Connect with employers, ace your interviews, and land the role you've always wanted.",
                },
              ].map(({ icon, step, title, desc }, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 relative z-10"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.64 0.19 221), oklch(0.55 0.22 264))",
                      boxShadow: "0 8px 24px 0 rgba(14,165,233,0.35)",
                    }}
                  >
                    {icon}
                    <span
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center text-white"
                      style={{ background: "oklch(0.72 0.18 68)" }}
                    >
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                    {desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* \u2500\u2500\u2500 INDUSTRIES \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              style={{
                background: "oklch(0.55 0.22 264 / 0.10)",
                color: "oklch(0.45 0.20 264)",
              }}
            >
              By Industry
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-3">
              Explore Industries
            </h2>
            <p className="text-muted-foreground text-lg">
              Find specialized roles in your field of expertise
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INDUSTRIES.map((industry, i) => (
              <motion.button
                type="button"
                key={industry.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                onClick={() =>
                  navigate({ to: "/jobs", search: { category: industry.name } })
                }
                className="relative overflow-hidden rounded-2xl aspect-video group cursor-pointer text-left"
                data-ocid={`industry.${industry.name.toLowerCase()}.button`}
              >
                {/* Background image */}
                <img
                  src={industry.image}
                  alt={industry.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Gradient overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(8,15,42,0.90) 0%, rgba(8,15,42,0.40) 50%, rgba(8,15,42,0.15) 100%)",
                  }}
                />
                {/* Content */}
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <div className="flex items-end justify-between">
                    <h3 className="text-white font-bold text-xl tracking-tight">
                      {industry.name}
                    </h3>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                      style={{
                        background: "rgba(14,165,233,0.25)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(14,165,233,0.30)",
                      }}
                    >
                      {industry.count}
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* \u2500\u2500\u2500 WHO WE SERVE \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
      <section className="overflow-hidden">
        <div className="flex flex-col md:flex-row min-h-[480px]">
          {/* Job Seekers */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative flex-1 group overflow-hidden"
          >
            <img
              src="/assets/generated/seeker-profile.dim_800x600.jpg"
              alt="Job Seeker"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.12 0.055 264 / 0.88), oklch(0.16 0.065 255 / 0.72))",
              }}
            />
            <div className="relative z-10 p-10 md:p-14 flex flex-col justify-center h-full text-white min-h-[380px]">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6 self-start"
                style={{
                  background: "oklch(0.64 0.19 221 / 0.20)",
                  border: "1px solid oklch(0.64 0.19 221 / 0.35)",
                }}
              >
                <Users className="w-3.5 h-3.5" /> For Job Seekers
              </div>
              <h3 className="text-3xl md:text-4xl font-extrabold mb-5 leading-tight tracking-tight">
                Land Your Next
                <br />
                Dream Role
              </h3>
              <ul className="space-y-3 mb-8">
                {[
                  "Browse thousands of verified job listings",
                  "Apply with a single click & track status",
                  "Build a professional profile that stands out",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-white/85"
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-accent mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                type="button"
                asChild
                className="self-start font-bold text-white"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.64 0.19 221), oklch(0.55 0.22 264))",
                  boxShadow: "0 4px 16px 0 rgba(14,165,233,0.40)",
                }}
                data-ocid="seeker_card.cta.button"
              >
                <a href="/auth">
                  Get Started Free <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Employers */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative flex-1 group overflow-hidden"
          >
            <img
              src="/assets/generated/employer-profile.dim_800x600.jpg"
              alt="Employer"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.08 0.030 240 / 0.90), oklch(0.14 0.055 270 / 0.78))",
              }}
            />
            <div className="relative z-10 p-10 md:p-14 flex flex-col justify-center h-full text-white min-h-[380px]">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6 self-start"
                style={{
                  background: "oklch(0.72 0.18 68 / 0.20)",
                  border: "1px solid oklch(0.72 0.18 68 / 0.35)",
                }}
              >
                <Building className="w-3.5 h-3.5" /> For Employers
              </div>
              <h3 className="text-3xl md:text-4xl font-extrabold mb-5 leading-tight tracking-tight">
                Hire the Best
                <br />
                Talent Faster
              </h3>
              <ul className="space-y-3 mb-8">
                {[
                  "Post unlimited jobs & reach top candidates",
                  "Manage all applications in one dashboard",
                  "Advanced filtering & hiring analytics",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-white/85"
                  >
                    <CheckCircle2
                      className="w-4 h-4 mt-0.5 flex-shrink-0"
                      style={{ color: "oklch(0.72 0.18 68)" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                type="button"
                asChild
                className="self-start font-bold"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.72 0.18 68), oklch(0.65 0.20 50))",
                  color: "white",
                  boxShadow: "0 4px 16px 0 rgba(245,158,11,0.35)",
                }}
                data-ocid="employer_card.cta.button"
              >
                <a href="/auth">
                  Post a Job Now <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* \u2500\u2500\u2500 STATS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
      <section
        className="py-20 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.10 0.045 264), oklch(0.18 0.08 270))",
        }}
      >
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {STATS.map((stat) => (
              <StatItem key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* \u2500\u2500\u2500 TESTIMONIALS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              style={{
                background: "oklch(0.72 0.18 68 / 0.12)",
                color: "oklch(0.52 0.17 70)",
              }}
            >
              Success Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
              What Our Users Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative rounded-2xl p-7 flex flex-col gap-4"
                style={{
                  background: "rgba(255,255,255,0.70)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid oklch(0.90 0.010 248)",
                  boxShadow: "0 4px 24px 0 rgba(8,15,42,0.07)",
                }}
              >
                <Quote
                  className="w-8 h-8 opacity-15"
                  style={{ color: "oklch(0.64 0.19 221)" }}
                />
                {/* Stars */}
                <div className="flex gap-0.5">
                  {["s1", "s2", "s3", "s4", "s5"].map((k) => (
                    <Star
                      key={k}
                      className="w-4 h-4 fill-current"
                      style={{ color: "oklch(0.72 0.18 68)" }}
                    />
                  ))}
                </div>
                <p className="text-foreground/80 text-sm leading-relaxed flex-1">
                  "{t.quote}"
                </p>
                <div
                  className="flex items-center gap-3 pt-2"
                  style={{ borderTop: "1px solid oklch(0.90 0.010 248)" }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: t.color }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">
                      {t.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {t.title} \u00b7 {t.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* \u2500\u2500\u2500 CTA BANNER \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
      <section
        className="py-20 text-white text-center relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.64 0.19 221), oklch(0.50 0.22 264))",
        }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 50%)",
          }}
        />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
              Ready to Take the Next Step?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Join over 890,000 professionals who found their dream job through
              CareerHub.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="font-bold bg-white hover:bg-white/90 px-8"
                style={{ color: "oklch(0.50 0.22 264)" }}
                data-ocid="cta_banner.seeker.button"
              >
                <a href="/auth">Find Your Dream Job</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="font-bold border-white/40 text-white hover:bg-white/10 px-8"
                data-ocid="cta_banner.employer.button"
              >
                <a href="/auth">Post a Job for Free</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
