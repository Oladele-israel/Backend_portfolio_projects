// import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { useAuthContext } from "../../contexts/authContext.jsx";

const DashboardHome = () => {
  const { userDetails, statusCheck } = useAuthContext();

  console.log("this is the website ---->", statusCheck);

  return (
    <div className="text-white pt-10 max-w-7xl">
      <div className="bg-black relative p-4">
        <div className="absolute inset-0 bg-blue-50 opacity-5 rounded-md"></div>
        <div className="relative z-10 p-5">
          <div className="text-2xl text-white font-bold">
            Greetings, {userDetails?.name || "User"}
          </div>
          <Link
            to="/dashboard/create_monitor"
            className="text-black bg-[#51E0CF] hover:bg-[#339c90] w-36 p-2 text-center rounded-md font-bold capitalize mt-5 block"
          >
            create monitor
          </Link>
        </div>
      </div>

      <div className="bg-black relative p-4 mt-4 rounded-md w-[95vw] max-w-5xl mx-auto">
        <div className="absolute inset-0 bg-blue-50 opacity-5 rounded-md"></div>
        <div className="relative z-10">
          <div className="p-2 w-full border-b border-b-zinc-900 text-white">
            Monitors
          </div>

          {statusCheck.map((website) => (
            <div
              key={website.id}
              className="flex items-center justify-between mt-4 w-[95%] border-b pb-5 border-b-zinc-900 hover:bg-zinc-400 hover:bg-opacity-10 transition-colors duration-200 p-2"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  website.isUp ? "bg-green-400" : "bg-red-400"
                }`}
              ></div>

              <div className="flex gap-2 text-white">
                <Link to={`/dashboard/web_details/${website.id}`}>
                  {website.url}
                </Link>
                <div className="flex gap-2">
                  <span>{website.isUp ? "Up" : "Down"}</span>
                  <span className="text-gray-300">
                    {new Date(website.checkedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
