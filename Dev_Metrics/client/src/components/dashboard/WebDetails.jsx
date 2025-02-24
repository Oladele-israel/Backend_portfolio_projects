import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SendHorizontal, ChevronLeft, ChevronRight } from "lucide-react"; // Import arrow icons
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const baseURL = import.meta.env.VITE_API;

function getLatestStatusCheck(data) {
  if (!data.statusChecks || data.statusChecks.length === 0) {
    return null; // Return null if no status checks are available
  }

  // Sort status checks by `checkedAt` in descending order and return the latest entry
  return data.statusChecks.reduce((latest, current) =>
    new Date(current.checkedAt) > new Date(latest.checkedAt) ? current : latest
  );
}

const WebsiteDetails = () => {
  const { id } = useParams();
  const [website, setWebsite] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1); // Total pages for pagination

  useEffect(() => {
    // Fetch website details based on the ID and current page
    const fetchWebsiteDetails = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/v1/web/websiteCheck/${id}`,
          {
            params: { page: currentPage, limit: itemsPerPage }, // Pass pagination params
            withCredentials: true,
          }
        );
        const data = response.data.data;
        console.log("this is the website details --->", data);
        setWebsite(data);
        setTotalPages(data.pagination.totalPages); // Update total pages from backend
      } catch (error) {
        console.error("Error fetching website details:", error);
      }
    };

    fetchWebsiteDetails();
  }, [id, currentPage, itemsPerPage]); // Re-fetch when page or itemsPerPage changes

  if (!website) {
    return <div>Loading...</div>;
  }

  const lastCheckedDetails = getLatestStatusCheck(website);

  // Format date to local time zone
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Calculate monitoring duration
  const getMonitoringDuration = (created) => {
    const createdDate = new Date(created);
    const now = new Date();
    const diffInMs = now - createdDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    return `${diffInDays} days`;
  };

  // Data for graph
  const graphData = website.statusChecks.map((check) => ({
    time: formatDate(check.checkedAt),
    responseTime: check.responseTime,
    status: check.isUp ? "Up" : "Down",
  }));

  // Pagination logic
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="text-white p-3 lg:mt-4">
      {/* Website Name and Status */}
      <div className="bg-black p-6 rounded-md">
        <h1 className="text-2xl font-bold">{website.url}</h1>
        <p className="text-sm text-gray-300 mt-2">
          Status:{" "}
          <span
            className={
              lastCheckedDetails.isUp ? "text-green-400" : "text-red-400 "
            }
          >
            {website.statusChecks[0].isUp ? "Up" : "Down"}
          </span>
          <span className="text-zinc-400">.Checked every 5mins</span>
        </p>
      </div>

      {/* Test Alert Button */}
      <div className="bg-black p-6 rounded-md -mt-5">
        <button className="bg-[#51E0CF] text-black px-3 py-3 rounded-md hover:bg-[#339c90] transition-colors font-bold flex gap-2 p">
          <span>Send Test Alert</span>
          <SendHorizontal />
        </button>
      </div>

      {/* Monitoring Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-zinc-900 p-6 rounded-md">
          <h2 className="text-lg font-bold">Monitoring Duration</h2>
          <p className="text-sm text-gray-300">
            {getMonitoringDuration(website.createdAt)}
          </p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-md">
          <h2 className="text-lg font-bold">Last Checked</h2>
          <p className="text-sm text-gray-300">
            {formatDate(lastCheckedDetails.checkedAt)}
          </p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-md">
          <h2 className="text-lg font-bold">Incidents</h2>
          <p className="text-sm text-gray-300">
            {" "}
            {website.statusChecks.filter((check) => !check.isUp).length}
          </p>
        </div>
      </div>

      {/* Response Time Graph */}
      <div className=" p-6 rounded-md mb-6">
        <h2 className="text-lg font-bold mb-4">Response Time (ms)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="time" tick={{ fill: "#fff" }} />
            <YAxis tick={{ fill: "#fff" }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#333", color: "#fff" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="responseTime"
              stroke="#51E0CF"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-zinc-900 p-6 rounded-md">
          <h2 className="text-lg font-bold">DNS Lookup Time</h2>
          <p className="text-sm text-gray-300">
            {lastCheckedDetails.dnsTime} ms
          </p>
        </div>
      </div>

      {/* Status Checks Table */}
      <div className="bg-zinc-900 p-6 rounded-md">
        <h2 className="text-lg font-bold mb-4">Status Checks</h2>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="p-2">Time</th>
              <th className="p-2">Status</th>
              <th className="p-2">Response Time (ms)</th>
              <th className="p-2">Status Code</th>
            </tr>
          </thead>
          <tbody>
            {website.statusChecks.map((check, index) => (
              <tr key={index} className="border-b border-zinc-800">
                <td className="p-2">{formatDate(check.checkedAt)}</td>
                <td className="p-2">
                  <span
                    className={check.isUp ? "text-green-400" : "text-red-400"}
                  >
                    {check.isUp ? "Up" : "Down"}
                  </span>
                </td>
                <td className="p-2">{check.responseTime}</td>
                <td className="p-2">{check.statusCode}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination Controls */}
        <div className="flex justify-center mt-4 gap-4">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`p-2 rounded ${
              currentPage === 1
                ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                : "bg-[#51E0CF] text-black hover:bg-[#339c90]"
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`p-2 rounded ${
              currentPage === totalPages
                ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                : "bg-[#51E0CF] text-black hover:bg-[#339c90]"
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebsiteDetails;
