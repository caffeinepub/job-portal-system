# Job Portal System

## Current State
New project. No existing application code.

## Requested Changes (Diff)

### Add
- Public homepage with hero section, job search, featured listings, industry categories
- Job seeker flow: register/login, browse jobs, apply to jobs, track application status
- Employer flow: register/login, post jobs, manage job listings, view and manage applicants
- Admin-style role separation (job seeker vs employer) using authorization
- Job listings with title, company, location, description, salary range, category
- Job applications with cover letter, status tracking (pending, reviewed, accepted, rejected)
- Industry/category filtering and keyword search

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend: Authorization with two roles (job_seeker, employer). Stable storage for jobs, applications, user profiles.
2. Backend APIs: postJob, getJobs, searchJobs, applyToJob, getApplications, updateApplicationStatus, getUserProfile, updateUserProfile
3. Frontend: Homepage with hero + search + featured jobs. Auth pages (login/register with role selection). Job seeker dashboard (browse, apply, my applications). Employer dashboard (post job, my listings, view applicants).
