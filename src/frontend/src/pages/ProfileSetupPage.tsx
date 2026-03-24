import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { Building, Loader2, Plus, Users, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useCreateEmployerProfile,
  useCreateJobSeekerProfile,
} from "../hooks/useQueries";

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Creative",
  "Sales",
  "Engineering",
  "Education",
  "Marketing",
  "Operations",
];

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"seeker" | "employer">("seeker");

  // Seeker state
  const [seekerName, setSeekerName] = useState("");
  const [seekerBio, setSeekerBio] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [expInput, setExpInput] = useState("");
  const [experiences, setExperiences] = useState<string[]>([]);

  // Employer state
  const [empName, setEmpName] = useState("");
  const [empBio, setEmpBio] = useState("");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");

  const createSeeker = useCreateJobSeekerProfile();
  const createEmployer = useCreateEmployerProfile();

  function addSkill() {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) setSkills((prev) => [...prev, s]);
    setSkillInput("");
  }

  function addExperience() {
    const e = expInput.trim();
    if (e) setExperiences((prev) => [...prev, e]);
    setExpInput("");
  }

  async function handleSubmit() {
    if (role === "seeker") {
      if (!seekerName.trim()) {
        toast.error("Please enter your name");
        return;
      }
      await createSeeker.mutateAsync({
        name: seekerName,
        bio: seekerBio,
        skills,
        experience: experiences,
      });
      toast.success("Profile created!");
      navigate({ to: "/dashboard/seeker" });
    } else {
      if (!empName.trim() || !company.trim() || !industry) {
        toast.error("Please fill all required fields");
        return;
      }
      await createEmployer.mutateAsync({
        name: empName,
        bio: empBio,
        company,
        industry,
      });
      toast.success("Employer profile created!");
      navigate({ to: "/dashboard/employer" });
    }
  }

  const isPending = createSeeker.isPending || createEmployer.isPending;

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            Complete Your Profile
          </h1>
          <p className="text-muted-foreground mt-1">
            Tell us a bit about yourself to get started
          </p>
        </div>

        {/* Role toggle */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setRole("seeker")}
            className={`p-3 rounded-xl border-2 flex items-center gap-2 justify-center font-medium text-sm transition-all ${
              role === "seeker"
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-muted-foreground hover:border-primary/40"
            }`}
            data-ocid="profile_setup.seeker.toggle"
          >
            <Users className="w-4 h-4" />
            Job Seeker
          </button>
          <button
            type="button"
            onClick={() => setRole("employer")}
            className={`p-3 rounded-xl border-2 flex items-center gap-2 justify-center font-medium text-sm transition-all ${
              role === "employer"
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-muted-foreground hover:border-primary/40"
            }`}
            data-ocid="profile_setup.employer.toggle"
          >
            <Building className="w-4 h-4" />
            Employer
          </button>
        </div>

        <Card className="border border-border shadow-card">
          <CardHeader>
            <CardTitle>
              {role === "seeker" ? "Job Seeker Profile" : "Employer Profile"}
            </CardTitle>
            <CardDescription>Fill in your details below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {role === "seeker" ? (
              <>
                <div>
                  <Label htmlFor="s-name">Full Name *</Label>
                  <Input
                    id="s-name"
                    value={seekerName}
                    onChange={(e) => setSeekerName(e.target.value)}
                    placeholder="Jane Smith"
                    className="mt-1"
                    data-ocid="profile_setup.name.input"
                  />
                </div>
                <div>
                  <Label htmlFor="s-bio">Bio</Label>
                  <Textarea
                    id="s-bio"
                    value={seekerBio}
                    onChange={(e) => setSeekerBio(e.target.value)}
                    placeholder="Tell employers about yourself..."
                    className="mt-1"
                    rows={3}
                    data-ocid="profile_setup.bio.textarea"
                  />
                </div>
                <div>
                  <Label>Skills</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Add a skill"
                      onKeyDown={(e) => e.key === "Enter" && addSkill()}
                      data-ocid="profile_setup.skill.input"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addSkill}
                      size="sm"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((s) => (
                      <Badge key={s} variant="secondary" className="gap-1">
                        {s}
                        <button
                          type="button"
                          onClick={() =>
                            setSkills(skills.filter((x) => x !== s))
                          }
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Experience</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={expInput}
                      onChange={(e) => setExpInput(e.target.value)}
                      placeholder="e.g. Software Engineer at Acme (2020-2022)"
                      onKeyDown={(e) => e.key === "Enter" && addExperience()}
                      data-ocid="profile_setup.experience.input"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addExperience}
                      size="sm"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {experiences.map((e, i) => (
                      <li
                        // biome-ignore lint/suspicious/noArrayIndexKey: stable ordered list
                        key={i}
                        className="flex items-center justify-between text-sm bg-muted rounded px-3 py-1"
                      >
                        <span>{e}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setExperiences(
                              experiences.filter((_, j) => j !== i),
                            )
                          }
                        >
                          <X className="w-3 h-3 text-muted-foreground" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="e-name">Your Name *</Label>
                  <Input
                    id="e-name"
                    value={empName}
                    onChange={(e) => setEmpName(e.target.value)}
                    placeholder="John Recruiter"
                    className="mt-1"
                    data-ocid="profile_setup.emp_name.input"
                  />
                </div>
                <div>
                  <Label htmlFor="e-company">Company Name *</Label>
                  <Input
                    id="e-company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Acme Corporation"
                    className="mt-1"
                    data-ocid="profile_setup.company.input"
                  />
                </div>
                <div>
                  <Label>Industry *</Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger
                      className="mt-1"
                      data-ocid="profile_setup.industry.select"
                    >
                      <SelectValue placeholder="Select industry" />
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
                <div>
                  <Label htmlFor="e-bio">Company Bio</Label>
                  <Textarea
                    id="e-bio"
                    value={empBio}
                    onChange={(e) => setEmpBio(e.target.value)}
                    placeholder="About your company..."
                    className="mt-1"
                    rows={3}
                    data-ocid="profile_setup.emp_bio.textarea"
                  />
                </div>
              </>
            )}

            <Button
              type="button"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleSubmit}
              disabled={isPending}
              data-ocid="profile_setup.submit.button"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
