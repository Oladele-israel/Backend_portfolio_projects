import { useState } from "react";
import {
  House,
  MessageCircle,
  BellDot,
  Settings,
  Search,
  Sun,
  Moon,
  LogOut,
  TvMinimalPlay,
} from "lucide-react";

const getInitials = (name) => {
  if (!name) return "";
  const parts = name.trim().split(" ");
  const initials = parts.map((part) => part[0].toUpperCase()).join("");
  return initials;
};

const SideNav = () => {
  let isDarkMode = false;
  const [activeIcon, setActiveIcon] = useState(null);

  const icons = [
    { id: "house", component: <House />, color: "text-blue-400", desc: "Home" },
    {
      id: "message",
      component: <MessageCircle />,
      color: "text-green-400",
      desc: "Chat",
    },
    {
      id: "notifications",
      component: <BellDot />,
      color: "text-yellow-400",
      desc: "Notification",
    },
    {
      id: "settings",
      component: <Settings />,
      color: "text-purple-400",
      desc: "Settings",
    },
    {
      id: "live",
      component: <TvMinimalPlay />,
      color: "text-purple-400",
      desc: "Live match",
    },
  ];

  return (
    <>
      <nav className="w-[95vw] sm:w-[90vw] h-10 fixed top-4 left-1/2 transform -translate-x-1/2 bg-[#222222]/70 backdrop-blur-md rounded-lg flex justify-center items-center gap-12 md:justify-between p-6  text-slate-200 lg:hidden shadow-lg z-50">
        {icons.map((icon) => (
          <div
            key={icon.id}
            onClick={() => setActiveIcon(icon.id)}
            className={`cursor-pointer transition-transform transform hover:scale-125 ${
              activeIcon === icon.id ? `${icon.color} scale-100` : ""
            }`}
          >
            {icon.component}
          </div>
        ))}
      </nav>

      {/* this is the desktop nav */}

      <nav className="bg-[#222222] w-[15rem] h-screen fixed left-0 rounded-md lg:flex flex-col items-start gap-4 text-slate-200 hidden shadow-lg px-4  ">
        <div className="text-2xl text-center mt-10 p-2">LimitlessFootball</div>
        <div className="bg-[#303030] w-full p-2 rounded-md flex gap-4 items-center mb-6">
          <Search size={20} strokeWidth={1.75} />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent flex-1 outline-none  w-[40%] text-slate-200 placeholder:text-slate-200 placeholder:text-center"
          />
        </div>
        <div className="border-b flex flex-col gap-7 pb-10 w-full">
          {icons.map((icon) => (
            <div
              key={icon.id}
              onClick={() => setActiveIcon(icon.id)}
              className={`flex items-center cursor-pointer transition-transform transform hover:scale-110 gap-3 pl-6  ${
                activeIcon === icon.id
                  ? `${icon.color} scale-110 border-l-4 pl-6 border-l-${icon.color} `
                  : ""
              }`}
            >
              <div className="text-xl">{icon.component}</div>
              <p className="text-sm">{icon.desc}</p>
            </div>
          ))}
        </div>
        {/* toogle and logout  */}
        <div className="mt-auto flex flex-col s   items-center gap-10 w-full p-2">
          <button className="flex items-center gap-2 cursor-pointer text-slate-200 hover:text-white transition-colors self-start">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span className="text-sm">
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </span>
          </button>
          <div className="mt-auto flex  items-center gap-4 w-full p-2">
            <div className="flex items-center justify-center gap-2 rounded-full bg-black w-12 h-12 text-center text-slate-200 font-medium">
              OL
            </div>
            <button className="flex items-center gap-2 cursor-pointer text-slate-200 hover:text-white transition-colors">
              <LogOut size={20} />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default SideNav;
