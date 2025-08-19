"use client";

import { useState } from "react";
import { TopNavigation } from "@/components/top-navigation";
import { EventsSection } from "@/components/event/events-section";
import { MerchandiseSection } from "@/components/merchandise/merchandise-section";
import { MembershipsSection } from "@/components/membership/memberships-section";
import { SettingsSection } from "@/components/settings-section";

export function Dashboard() {
  const [activeSection, setActiveSection] = useState<
    "events" | "merchandise" | "memberships" | "settings"
  >("events");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      <TopNavigation
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <main className="flex-1 container mx-auto px-2 md:px-4 pb-20">
        {activeSection === "events" && <EventsSection />}
        {activeSection === "merchandise" && <MerchandiseSection />}
        {activeSection === "memberships" && <MembershipsSection />}
        {activeSection === "settings" && <SettingsSection />}
      </main>
    </div>
  );
}