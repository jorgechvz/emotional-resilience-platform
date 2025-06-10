import { type RouteObject } from "react-router-dom";
import { Paths } from "./path.routes";
import Home from "@/pages/public/home";
import PrivacyPolicy from "@/pages/public/privacy";
import TermsOfService from "@/pages/public/terms";
import { SignInPage } from "@/pages/auth/sign-in";
import CoursesPage from "@/pages/courses/courses";
import CoursePlatformPage from "@/pages/platform/course-platform";
import { BlogPage } from "@/pages/blogs/blog";
import StoryPage from "@/pages/blogs/[storyId]/page";
import ResilienceMeetingsPage from "@/pages/meetings/page";
import NewBlogPage from "@/pages/blogs/new-blog";
import { SignUpPage } from "@/pages/auth/sign-up";

export const AppRoutes: RouteObject[] = [
  {
    path: Paths.platform.COURSE,
    element: <CoursePlatformPage />,
  },
  {
    path: Paths.platform.NEW_BLOG,
    element: <NewBlogPage />,
  },
];

export const AuhtRoutes: RouteObject[] = [
  { path: Paths.auth.LOGIN, element: <SignInPage /> },
  { path: Paths.auth.REGISTER, element: <SignUpPage /> },
];

export const PublicRoutes: RouteObject[] = [
  {
    path: Paths.public.HOME,
    element: <Home />,
  },
  {
    path: Paths.public.PRIVACY,
    element: <PrivacyPolicy />,
  },
  {
    path: Paths.public.TERMS,
    element: <TermsOfService />,
  },
  {
    path: Paths.public.ABOUT,
    element: <div></div>,
  },
  {
    path: Paths.public.COURSE,
    element: <CoursesPage />,
  },
  {
    path: Paths.public.STORY,
    element: <BlogPage />,
  },
  {
    path: Paths.public.STORYID,
    element: <StoryPage />,
  },
  {
    path: Paths.public.RESILIENCE_CIRCLES,
    element: <ResilienceMeetingsPage />,
  },
];
