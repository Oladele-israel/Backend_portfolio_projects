import React from "react";
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

const WebsiteDetails = () => {
  // Mock data for the website
  const website = {
    name: "example.com",
    status: "Up",
    created: "2023-10-01T12:00:00Z", // ISO format
    lastChecked: "2023-10-25T14:30:00Z", // ISO format
    incidents: 3,
    responseTimes: [
      { time: "2023-10-25T10:00:00Z", responseTime: 120 },
      { time: "2023-10-25T11:00:00Z", responseTime: 150 },
      { time: "2023-10-25T12:00:00Z", responseTime: 200 },
      { time: "2023-10-25T13:00:00Z", responseTime: 180 },
      { time: "2023-10-25T14:00:00Z", responseTime: 160 },
    ],
    tlsDataTransfer: 512, // in MB
    dnsLookupTime: 50, // in ms
  };

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

  return (
    <div className="text-white p-6">
      {/* Website Name and Status */}
      <div className="bg-black p-6 rounded-md mb-6">
        <h1 className="text-2xl font-bold">{website.name}</h1>
        <p className="text-sm text-gray-300">
          Status:{" "}
          <span
            className={
              website.status === "Up" ? "text-green-400" : "text-red-400"
            }
          >
            {website.status}
          </span>
        </p>
      </div>

      {/* Test Alert Button */}
      <div className="bg-black p-6 rounded-md mb-6">
        <button className="bg-[#51E0CF] text-black px-4 py-2 rounded-md hover:bg-[#339c90] transition-colors">
          Send Test Alert
        </button>
      </div>

      {/* Monitoring Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-black p-6 rounded-md">
          <h2 className="text-lg font-bold">Monitoring Duration</h2>
          <p className="text-sm text-gray-300">
            {getMonitoringDuration(website.created)}
          </p>
        </div>
        <div className="bg-black p-6 rounded-md">
          <h2 className="text-lg font-bold">Last Checked</h2>
          <p className="text-sm text-gray-300">
            {formatDate(website.lastChecked)}
          </p>
        </div>
        <div className="bg-black p-6 rounded-md">
          <h2 className="text-lg font-bold">Incidents</h2>
          <p className="text-sm text-gray-300">{website.incidents}</p>
        </div>
      </div>

      {/* Response Time Graph */}
      <div className="bg-black p-6 rounded-md mb-6">
        <h2 className="text-lg font-bold mb-4">Response Time (ms)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={website.responseTimes}>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black p-6 rounded-md">
          <h2 className="text-lg font-bold">TLS Data Transfer</h2>
          <p className="text-sm text-gray-300">{website.tlsDataTransfer} MB</p>
        </div>
        <div className="bg-black p-6 rounded-md">
          <h2 className="text-lg font-bold">DNS Lookup Time</h2>
          <p className="text-sm text-gray-300">{website.dnsLookupTime} ms</p>
        </div>
      </div>
    </div>
  );
};

export default WebsiteDetails;
