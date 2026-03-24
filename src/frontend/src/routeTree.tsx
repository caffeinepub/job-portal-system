import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";
import EmployerDashboard from "./pages/EmployerDashboard";
import HomePage from "./pages/HomePage";
import JobDetailPage from "./pages/JobDetailPage";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import JobsPage from "./pages/JobsPage";
import ProfileSetupPage from "./pages/ProfileSetupPage";

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth",
  component: AuthPage,
});

const profileSetupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile-setup",
  component: ProfileSetupPage,
});

const jobsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/jobs",
  component: JobsPage,
});

const jobDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/jobs/$jobId",
  component: JobDetailPage,
});

const seekerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/seeker",
  component: JobSeekerDashboard,
});

const employerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/employer",
  component: EmployerDashboard,
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  authRoute,
  profileSetupRoute,
  jobsRoute,
  jobDetailRoute,
  seekerDashboardRoute,
  employerDashboardRoute,
]);
