import { useState } from "react";
import {
  Globe,
  TriangleAlert,
  Settings,
  ChartNoAxesCombined,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const getInitials = (name) => {
  if (!name) return "";
  const parts = name.trim().split(" ");
  const initials = parts.map((part) => part[0].toUpperCase()).join("");
  return initials;
};

const SideNav = () => {
  const [activeIcon, setActiveIcon] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);

  const icons = [
    {
      id: "house",
      component: <Globe />,
      desc: "Monitors",
    },
    {
      id: "Accidents",
      component: <TriangleAlert />,
      color: "text-green-400",
      desc: "Accidents",
    },

    {
      id: "settings",
      component: <Settings />,
      desc: "Settings",
    },
    // bg-[#FFFFFF]
  ];

  return (
    <>
      {/* this is the mobile */}
      <div className="relative">
        {/* Hamburger Menu Button */}
        <button
          className="lg:hidden p-2 text-white bg-zinc-900 rounded-md"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={28} />
        </button>

        {/* Overlay for Sidebar */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMenuOpen(false)}
          ></div>
        )}

        {/* Sidebar Navigation */}
        <nav
          className={`fixed top-0 left-0 h-screen w-[14rem] bg-black text-slate-200 shadow-lg border-2 border-neutral-800 transition-transform ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          } lg:hidden z-50`}
        >
          {/* Overlay with opacity */}
          <div className="absolute inset-0 bg-[#FFFFFF] opacity-5 rounded-md z-0"></div>

          {/* Nav Content */}
          <div className="relative w-full h-full flex flex-col p-6">
            <button
              className="absolute top-4 right-4 text-white  cursor-pointer"
              onClick={() => setMenuOpen(false)}
            >
              <X size={28} />
            </button>
            {/* Nav logo */}
            <div className="text-2xl text-center mt-10 p-2 mb-5">
              <div className="flex items-center justify-center">
                <span>Dev</span>
                <ChartNoAxesCombined className="text-[#51E0CF]" />
                <span>
                  Metrics <span className="text-green-600">.</span>
                </span>
              </div>
            </div>

            {/* Nav icons */}
            <div className="border-b border-b-gray-800 flex flex-col gap-7 pb-10 w-full">
              {icons.map((icon) => (
                <div
                  key={icon.id}
                  onClick={() => {
                    setActiveIcon(icon.id);
                    setMenuOpen(false); // Close menu on icon click
                  }}
                  className={`flex items-center cursor-pointer transition-transform transform gap-3 pl-6 ${
                    activeIcon === icon.id
                      ? "text-[#51E0CF] scale-110 border-l-4 pl-6 border-l-[#51E0CF]"
                      : ""
                  }`}
                >
                  <div className="text-xl">{icon.component}</div>
                  <p className="text-sm">{icon.desc}</p>
                </div>
              ))}
            </div>

            {/* Logout Section */}
            <div className="mt-auto flex flex-col items-center gap-10 w-full p-2">
              <div className="flex items-center gap-4 w-full p-2">
                <div className="flex items-center justify-center gap-2 rounded-full bg-black w-12 h-12 text-center text-slate-200 font-medium">
                  OL
                </div>
                <button className="flex items-center gap-2 cursor-pointer text-slate-200 hover:text-white transition-colors">
                  <LogOut size={20} />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* this is the desktop nav */}

      <nav className=" w-[14rem] h-screen fixed left-0 rounded-md lg:flex flex-col items-start gap-4 text-slate-200 hidden shadow-lg px-4 border-2 border-neutral-800">
        {/* Overlay with opacity */}
        <div className="absolute inset-0 bg-[#FFFFFF] opacity-5 rounded-md z-0"></div>

        {/* Nav content */}
        <div className="relative z-10 w-full h-full flex flex-col">
          {/* Nav logo */}
          <div className="text-2xl text-center mt-10 p-2 mb-5">
            <div className="flex items-center">
              <span> Dev </span>
              <ChartNoAxesCombined className="text-[#51E0CF]" />
              <span>
                Metrics <span className="text-green-600">.</span>
              </span>
            </div>
          </div>

          {/* Nav icons */}
          <div className="border-b  border-b-gray-800 flex flex-col gap-7 pb-10 w-full ">
            {icons.map((icon) => (
              <div
                key={icon.id}
                onClick={() => setActiveIcon(icon.id)}
                className={`flex items-center cursor-pointer transition-transform transform gap-3 pl-6 ${
                  activeIcon === icon.id
                    ? `text-[#51E0CF] scale-110 border-l-4 pl-6 border-l-[#51E0CF]`
                    : ""
                }`}
              >
                <div className="text-xl">{icon.component}</div>
                <p className="text-sm">{icon.desc}</p>
              </div>
            ))}
          </div>

          {/* Logout and initials at the bottom */}
          <div className="mt-auto flex flex-col items-center gap-10 w-full p-2">
            <div className="flex items-center gap-4 w-full p-2">
              <div className="flex items-center justify-center gap-2 rounded-full bg-black w-12 h-12 text-center text-slate-200 font-medium">
                OL
              </div>
              <button className="flex items-center gap-2 cursor-pointer text-slate-200 hover:text-white transition-colors">
                <LogOut size={20} />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default SideNav;
