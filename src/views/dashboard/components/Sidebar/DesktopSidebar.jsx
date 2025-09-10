import React, { useState } from "react";
import { navigation, teams } from "../../../../utilities/fakedata";
import { classNames } from "../../../../utilities/cssfunction";
import { useNavigate } from "react-router-dom";

const DesktopSidebar = ({ client = 1 }) => {
  const [selectedItem, setSelectedItem] = useState(navigation(client)[0]);
  const navigate = useNavigate();

  function changePage(item) {
    setSelectedItem(item);
    navigate(item.href);
  }

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col bg-white ">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-100 bg-white px-6 dark:border-white/10 dark:bg-neutral-200">
        <div className="flex h-16 shrink-0 items-center">
          <img
            alt="Your Company"
            src={require("../../../../assets/logo/cotaxlogo.png")}
            className="h-12 w-auto dark:hidden"
          />
          <img
            alt="Your Company"
            src={require("../../../../assets/logo/cotaxlogo.png")}
            className="h-12 w-auto not-dark:hidden"
          />
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation(client).map((item) => (
                      <li onClick={() => changePage(item)} key={item.name}>
                        <a
                          //href={item.href}
                          className={classNames(
                            item.name === selectedItem?.name
                              ? "bg-white text-blue-950"
                              : "text-gray-950 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white",
                            "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={classNames(
                              item.name === selectedItem?.name
                                ? "text-blue-950"
                                : "text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-white",
                              "size-6 shrink-0"
                            )}
                          />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <div className="text-xs/6 font-semibold text-gray-400" />
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {teams(client).map((team) => (
                      <li onClick={() => changePage(team)} key={team.name}>
                        <a
                          className={classNames(
                            team.name === selectedItem?.name
                              ? "cursor-pointer bg-white text-blue-950"
                              : "cursor-pointer text-gray-950 hover:bg-gray-50 hover:text-white-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white",
                            "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                          )}
                        >
                          <div
                            className={classNames(
                              team.name === selectedItem?.name
                                ? "bg-blue-600 border-3 text-indigo-600 dark:text-gray-900"
                                : "border-gray-700 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600 dark:border-white/10 dark:group-hover:border-white/20 dark:group-hover:text-white",
                              "flex size-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium dark:bg-white/5"
                            )}
                          >
                            {team.initial}
                          </div>
                          <span className="truncate">{team.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </li>
            <li className="-mx-6 mt-auto p-4">
              <img
                alt="RDCongo"
                src={require("../../../../assets/flag.png")}
                className="mx-auto h-8 w-auto rounded-md shadow"
              />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default DesktopSidebar;
