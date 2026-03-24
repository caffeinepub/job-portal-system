import { Link } from "@tanstack/react-router";
import { Briefcase, Github, Linkedin, Twitter } from "lucide-react";

const footerLinks = {
  Company: ["About Us", "Our Story", "Blog", "Press", "Careers"],
  "Job Seekers": [
    "Find Jobs",
    "Career Resources",
    "Resume Tips",
    "Salary Guide",
    "Job Alerts",
  ],
  Employers: [
    "Post a Job",
    "Employer Dashboard",
    "Talent Search",
    "Pricing",
    "Partnerships",
  ],
  Contact: [
    "Help Center",
    "FAQ",
    "Privacy Policy",
    "Terms of Service",
    "Contact Us",
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer
      className="text-white relative overflow-hidden"
      style={{ background: "oklch(0.09 0.040 264)" }}
    >
      {/* Grid texture overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Top gradient accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.64 0.19 221 / 0.5), oklch(0.55 0.22 264 / 0.5), transparent)",
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 py-14">
          {/* Brand col */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="flex items-center gap-2.5 font-extrabold text-xl text-white mb-4"
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
              Career
              <span
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.72 0.19 221), oklch(0.65 0.22 264))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Hub
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs mb-6">
              Connecting talented professionals with leading companies
              worldwide. Your next career move starts here.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {[
                { icon: <Twitter className="w-4 h-4" />, label: "Twitter" },
                { icon: <Linkedin className="w-4 h-4" />, label: "LinkedIn" },
                { icon: <Github className="w-4 h-4" />, label: "GitHub" },
              ].map(({ icon, label }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white/40 hover:text-white transition-all"
                  style={{
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.04)",
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([col, links]) => (
            <div key={col}>
              <h4 className="font-semibold text-sm text-white/90 mb-4 tracking-wide uppercase text-xs">
                {col}
              </h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l}>
                    <span className="text-white/45 hover:text-white/80 text-sm transition-colors cursor-pointer">
                      {l}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 py-5 text-white/35 text-xs"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span>© {year} CareerHub. All rights reserved.</span>
          <span>
            Built with ❤️ using{" "}
            <a
              href={caffeineUrl}
              className="hover:text-white/70 transition-colors underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
