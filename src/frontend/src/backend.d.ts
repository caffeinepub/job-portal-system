import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface JobSeekerProfile {
    bio: string;
    name: string;
    experience: Array<string>;
    skills: Array<string>;
}
export interface JobApplication {
    id: bigint;
    status: ApplicationStatus;
    applicant: Principal;
    appliedAt: Time;
    jobId: bigint;
    coverLetter: string;
}
export interface JobListing {
    id: bigint;
    title: string;
    postedAt: Time;
    postedBy: Principal;
    salary: string;
    jobType: JobType;
    description: string;
    company: string;
    category: string;
    location: string;
}
export interface UserProfile {
    employerProfile?: EmployerProfile;
    role: UserRole;
    jobSeekerProfile?: JobSeekerProfile;
}
export interface EmployerProfile {
    bio: string;
    name: string;
    company: string;
    industry: string;
}
export enum ApplicationStatus {
    pending = "pending",
    rejected = "rejected",
    reviewed = "reviewed",
    accepted = "accepted"
}
export enum JobType {
    remote = "remote",
    internship = "internship",
    contract = "contract",
    freelance = "freelance",
    part_time = "part_time",
    full_time = "full_time"
}
export enum UserRole {
    employer = "employer",
    job_seeker = "job_seeker"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    applyToJob(jobId: bigint, coverLetter: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    createEmployerProfile(name: string, bio: string, company: string, industry: string): Promise<void>;
    createJobSeekerProfile(name: string, bio: string, skills: Array<string>, experience: Array<string>): Promise<void>;
    deleteJob(jobId: bigint): Promise<void>;
    getAllJobs(): Promise<Array<JobListing>>;
    getApplicationStatus(applicationId: bigint): Promise<ApplicationStatus>;
    getApplicationsByApplicant(applicant: Principal): Promise<Array<JobApplication>>;
    getApplicationsByJob(jobId: bigint): Promise<Array<JobApplication>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getJobsByCategory(category: string): Promise<Array<JobListing>>;
    getJobsByCompany(company: string): Promise<Array<JobListing>>;
    getJobsByJobType(jobType: JobType): Promise<Array<JobListing>>;
    getJobsByLocation(location: string): Promise<Array<JobListing>>;
    getJobsByTitle(title: string): Promise<Array<JobListing>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    postJob(title: string, company: string, location: string, description: string, salary: string, category: string, jobType: JobType): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateApplicationStatus(applicationId: bigint, status: ApplicationStatus): Promise<void>;
    updateJob(jobId: bigint, title: string, company: string, location: string, description: string, salary: string, category: string, jobType: JobType): Promise<void>;
}
