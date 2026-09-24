import type { Metadata } from "next";
import { LayoutDashboard } from "lucide-react";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = {
  title: "Dashboard | JobPilot",
};

export default function DashboardPage() {
  return (
    <ComingSoon
      icon={LayoutDashboard}
      title="Your dashboard is on the way"
      description="Stats, recent activity, and match analytics will show here. Complete your profile now so your first matches are ready."
    />
  );
}
