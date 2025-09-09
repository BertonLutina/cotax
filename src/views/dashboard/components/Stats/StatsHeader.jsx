import React from "react";
import { stats } from "../../../../utilities/fakedata";
import { classNames } from "../../../../utilities/cssfunction";

const StatsHeader = () => {
  return (
    <dl className="mx-auto grid border rounded-lg px-1 grid-cols-1 gap-px bg-neutral-100 sm:grid-cols-2 lg:grid-cols-4 mb-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8"
        >
          <dt className="text-sm/6 font-medium text-gray-500">{stat.name}</dt>
          <dd
            className={classNames(
              stat.changeType === "negative"
                ? "text-rose-600"
                : "text-green-700",
              "text-xs font-medium"
            )}
          >
            {stat.change}
          </dd>
          <dd className="w-full flex-none text-3xl/10 font-medium tracking-tight text-gray-900">
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
};

export default StatsHeader;
