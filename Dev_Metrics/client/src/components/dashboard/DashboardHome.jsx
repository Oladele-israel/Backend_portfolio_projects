import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { EllipsisVertical } from "lucide-react";
import { useAuthContext } from "../../contexts/authContext.jsx";
import axios from "axios";
import io from "socket.io-client"; // Import Socket.IO client

const baseURL = import.meta.env.VITE_API;

const DashboardHome = () => {
  const { message, userDetails } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [lastStatusChecks, setLastStatusChecks] = useState([]);
  const socketRef = useRef(null); // Use a ref to store the socket instance

  // State to manage which website's dropdown is open
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  // Ref to track the dropdown container
  const dropdownRef = useRef(null);

  // Function to toggle the dropdown
  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  // Function to close the dropdown
  const closeDropdown = () => {
    setOpenDropdownIndex(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch website details from the database
  useEffect(() => {
    const websiteDetails = async () => {
      if (!userDetails?.id) return; // Ensure userDetails.id is available

      try {
        setLoading(true);
        const response = await axios.get(
          `${baseURL}/v1/web/userWebsites/${userDetails.id}`,
          {
            withCredentials: true,
          }
        );

        const websiteData = response.data.data;
        console.log("Fetched website data:", websiteData);

        // Get the most recent data helper
        const extractLastStatusCheck = (websites) => {
          return websites.map((website) => {
            const lastStatusCheck =
              website.statusChecks[website.statusChecks.length - 1];
            return {
              url: website.url,
              isUp: lastStatusCheck.isUp,
              responseTime: lastStatusCheck.responseTime,
              checkedAt: lastStatusCheck.checkedAt,
            };
          });
        };

        const lastStatusChecks = extractLastStatusCheck(websiteData);
        setLastStatusChecks(lastStatusChecks); // Update state with last status checks
      } catch (error) {
        console.log("Error fetching website details:", error);
      } finally {
        setLoading(false);
      }
    };
    websiteDetails();
  }, [userDetails]); // Add userDetails as a dependency

  // Set up Socket.IO connection
  useEffect(() => {
    if (!userDetails?.id) return; // Ensure userDetails.id is available

    // Initialize Socket.IO connection with correct options
    socketRef.current = io(baseURL, {
      transports: ["websocket"], // Ensure WebSocket transport is prioritized
      withCredentials: true, // Ensure credentials are sent if needed
      query: { userId: userDetails.id }, // Send userId to the server
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to WebSocket server:", socketRef.current.id);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("WebSocket connection error:", err);
    });

    // Listen for real-time updates
    socketRef.current.on("websiteStatusUpdate", (data) => {
      console.log("Received real-time update: =====>", data);

      // Update state with the new status
      setLastStatusChecks((prev) => {
        const updatedStatusChecks = prev.map((website) =>
          website.url === data.url
            ? { ...website, isUp: data.isUp, checkedAt: data.checkedAt }
            : website
        );
        console.log("Updated status checks:", updatedStatusChecks);
        return updatedStatusChecks;
      });
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("Disconnected from WebSocket");
      }
    };
  }, [userDetails]);

  return (
    <div className="text-white pt-10 max-w-7xl">
      {/* Greetings Section */}
      <div className="bg-black relative p-4">
        {/* Overlay with opacity */}
        <div className="absolute inset-0 bg-blue-50 opacity-5 rounded-md"></div>

        {/* Content */}
        <div className="relative z-10 p-5">
          <div className="text-2xl text-white font-bold">
            Greetings, {userDetails?.name || "User"}{" "}
            {/* Handle null userDetails */}
          </div>
          <Link
            to="/dashboard/create_monitor"
            className="text-black bg-[#51E0CF] hover:bg-[#339c90] w-36 p-2 text-center rounded-md font-bold capitalize mt-5 block"
          >
            create monitor
          </Link>
        </div>
      </div>

      {/* Monitors Section */}
      <div className="bg-black relative p-4 mt-4 rounded-md w-[95vw] max-w-5xl mx-auto">
        {/* Overlay with opacity */}
        <div className="absolute inset-0 bg-blue-50 opacity-5 rounded-md"></div>

        {/* Content */}
        <div className="relative z-10">
          {/* Title */}
          <div className="p-2 w-full border-b border-b-zinc-900 text-white">
            Monitors
          </div>

          {/* List of monitored websites */}
          {lastStatusChecks.map((website, index) => (
            <div
              key={index}
              className="flex items-center justify-between mt-4 w-[95%] border-b pb-5 border-b-zinc-900 hover:bg-zinc-400 hover:bg-opacity-10 transition-colors duration-200 p-2"
            >
              {/* Status Indicator */}
              <div
                className={`w-2 h-2 rounded-full ${
                  website.isUp ? "bg-green-400" : "bg-red-400"
                }`}
              ></div>

              {/* Website Details */}
              <div className="flex gap-2 text-white">
                <div>{website.url}</div>
                <div className="flex gap-2">
                  <span>{website.isUp ? "Up" : "Down"}</span>
                  <span className="text-gray-300">
                    {new Date(website.checkedAt).toLocaleString()}
                  </span>
                  {/* Vertical Dots Icon */}
                  <div className="relative" ref={dropdownRef}>
                    <EllipsisVertical
                      className="ml-6 cursor-pointer"
                      onClick={() => toggleDropdown(index)}
                    />
                    {/* Dropdown Menu */}
                    {openDropdownIndex === index && (
                      <div className="absolute right-0 mt-2 w-48 bg-zinc-900 text-slate-200 rounded-md shadow-lg z-10 p-2 capitalize">
                        <Link
                          to="#"
                          className="block px-4 py-2 hover:bg-zinc-800 rounded-md"
                          onClick={closeDropdown} // Close dropdown on link click
                        >
                          View Incidents
                        </Link>
                        <Link
                          to="#"
                          className="block px-4 py-2 hover:bg-zinc-800 rounded-md"
                          onClick={closeDropdown} // Close dropdown on link click
                        >
                          view web Details
                        </Link>
                        <Link
                          to="#"
                          className="block px-4 py-2 hover:bg-zinc-800 rounded-md text-red-500 font-bold "
                          onClick={closeDropdown} // Close dropdown on link click
                        >
                          Remove site
                        </Link>
                      </div>
                    )}
                  </div>
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
