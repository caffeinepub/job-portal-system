# Job Portal System

## Current State
Full-stack job portal with Motoko backend and React frontend. Features: login via Internet Identity, employer dashboard (post/edit/delete jobs, review applicants), job seeker dashboard (browse & apply), job detail page with apply dialog, profile setup page.

## Requested Changes (Diff)

### Add
- Error handling in ProfileSetupPage handleSubmit (try-catch)
- isError handling in AuthPage for profile query failures
- Graceful fallback in useCallerProfile when backend call fails

### Modify
- AuthPage.tsx: treat undefined profile (error/unloaded state) properly — only navigate when profile data is definitively loaded or confirmed errored; if errored treat as no profile and redirect to profile-setup
- ProfileSetupPage.tsx: wrap mutateAsync calls in try-catch and show toast.error on failure
- useQueries.ts: useCallerProfile should catch errors and return null so the UI can react gracefully

### Remove
- Nothing removed

## Implementation Plan
1. Wrap `useCallerProfile` queryFn in try-catch, return null on error
2. In AuthPage.tsx, read isError from useCallerProfile; if isError treat same as null (redirect to profile-setup)
3. In ProfileSetupPage.tsx, wrap both mutateAsync calls in try-catch with toast.error
