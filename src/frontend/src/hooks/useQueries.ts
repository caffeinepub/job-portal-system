import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ApplicationStatus,
  type JobApplication,
  type JobListing,
  JobType,
  type UserProfile,
  UserRole,
} from "../backend.d";
import { useActor } from "./useActor";

export function useAllJobs() {
  const { actor, isFetching } = useActor();
  return useQuery<JobListing[]>({
    queryKey: ["jobs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllJobs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useJobsByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<JobListing[]>({
    queryKey: ["jobs", "category", category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getJobsByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useCallerProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getCallerUserProfile();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApplicationsByApplicant(applicant: Principal | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<JobApplication[]>({
    queryKey: ["applications", "applicant", applicant?.toString()],
    queryFn: async () => {
      if (!actor || !applicant) return [];
      return actor.getApplicationsByApplicant(applicant);
    },
    enabled: !!actor && !isFetching && !!applicant,
  });
}

export function useApplicationsByJob(jobId: bigint | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<JobApplication[]>({
    queryKey: ["applications", "job", jobId?.toString()],
    queryFn: async () => {
      if (!actor || jobId === undefined) return [];
      return actor.getApplicationsByJob(jobId);
    },
    enabled: !!actor && !isFetching && jobId !== undefined,
  });
}

export function usePostJob() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      company: string;
      location: string;
      description: string;
      salary: string;
      category: string;
      jobType: JobType;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.postJob(
        data.title,
        data.company,
        data.location,
        data.description,
        data.salary,
        data.category,
        data.jobType,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
}

export function useUpdateJob() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      jobId: bigint;
      title: string;
      company: string;
      location: string;
      description: string;
      salary: string;
      category: string;
      jobType: JobType;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateJob(
        data.jobId,
        data.title,
        data.company,
        data.location,
        data.description,
        data.salary,
        data.category,
        data.jobType,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
}

export function useDeleteJob() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (jobId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteJob(jobId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
}

export function useApplyToJob() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      jobId,
      coverLetter,
    }: { jobId: bigint; coverLetter: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.applyToJob(jobId, coverLetter);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["applications"] }),
  });
}

export function useUpdateApplicationStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      applicationId,
      status,
    }: { applicationId: bigint; status: ApplicationStatus }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateApplicationStatus(applicationId, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["applications"] }),
  });
}

export function useCreateJobSeekerProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      bio: string;
      skills: string[];
      experience: string[];
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createJobSeekerProfile(
        data.name,
        data.bio,
        data.skills,
        data.experience,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
}

export function useCreateEmployerProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      bio: string;
      company: string;
      industry: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createEmployerProfile(
        data.name,
        data.bio,
        data.company,
        data.industry,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
}

export { ApplicationStatus, JobType, UserRole };
export type { JobListing, JobApplication, UserProfile };
