import { Link } from "@tanstack/react-router";
import { Briefcase } from "lucide-react";

const footerLinks = {
  About: ["Our Story", "Team", "Blog", "Press"],
  Employers: ["Post a Job", "Employer Dashboard", "Pricing", "Partnerships"],
  "Job Seekers": [
    "Find Jobs",
    "Career Resources",
    "Resume Tips",
    "Salary Guide",
  ],
  Resources: ["Help Center", "Guides", "Webinars", "API"],
  Support: ["Contact Us", "FAQ", "Privacy Policy", "Terms"],
};

const SOCIAL = ["T", "L", "F"];
const SOCIAL_LABELS = ["Twitter", "LinkedIn", "Facebook"];

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="bg-navy text-white pt-12 pb-6">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 pb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link
              to="/"
              className="flex items-center gap-2 font-bold text-xl text-white mb-3"
            >
              <Briefcase className="w-5 h-5 text-blue-300" />
              CareerHub
            </Link>
            <p className="text-white/60 text-sm max-w-xs">
              Connecting talented professionals with leading companies
              worldwide.
            </p>
            <div className="flex gap-3 mt-4">
              {SOCIAL.map((s, i) => (
                <span
                  key={SOCIAL_LABELS[i]}
                  className="text-white/50 hover:text-blue-300 text-xs transition-colors cursor-pointer"
                  role="img"
                  aria-label={SOCIAL_LABELS[i]}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([col, links]) => (
            <div key={col}>
              <h4 className="font-semibold text-sm mb-3 text-white/90">
                {col}
              </h4>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l}>
                    <span className="text-white/55 hover:text-white text-sm transition-colors cursor-pointer">
                      {l}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-4 flex flex-col md:flex-row items-center justify-between gap-2 text-white/40 text-xs">
          <span>© {year} CareerHub. All rights reserved.</span>
          <span>
            Built with ❤️ using{" "}
            <a
              href={caffeineUrl}
              className="hover:text-white transition-colors underline"
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
