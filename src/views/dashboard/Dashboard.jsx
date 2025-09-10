"use client";
import StatsHeader from "./components/Stats/StatsHeader";
import StatActivities from "./components/Stats/StatActivities";

export default function Dashboard() {

  return (
          <div className="px-4 sm:px-6 lg:px-8">
            <StatsHeader />
            <StatActivities />
          {/*   <StatsEntreprise /> */}
          </div>
      
  );
}
