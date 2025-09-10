"use client";

import { useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import SmallScreenSidebar from "./components/Sidebar/SmallScreenSidebar";
import DesktopSidebar from "./components/Sidebar/DesktopSidebar";
import StatsHeader from "./components/Stats/StatsHeader";
import StatActivities from "./components/Stats/StatActivities";
import StatsEntreprise from "./components/Stats/StatsEntreprise";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
 
          <div className="px-4 sm:px-6 lg:px-8">
            {/* <StatsHeader /> */}
            <StatActivities />
          {/*   <StatsEntreprise /> */}
          </div>
      
  );
}
