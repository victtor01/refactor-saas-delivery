"use client";

import { ViewTransitions } from "next-view-transitions";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ViewTransitions>{children}</ViewTransitions>;
}
