import type { Metadata } from "next";
import { Search } from "lucide-react";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = {
  title: "Find Jobs | JobPilot",
};

export default function FindJobsPage() {
  return (
    <ComingSoon
      icon={Search}
      title="Job search is on the way"
      description="Soon you can search for roles and get a match score for each job. Complete your profile now so every match uses your skills."
    />
  );
}
