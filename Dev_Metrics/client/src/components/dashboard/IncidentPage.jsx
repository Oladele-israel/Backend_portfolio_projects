import { useState } from "react";
import { EllipsisVertical, CloudAlert, Eye, TriangleAlert } from "lucide-react"; // Assuming you're using Lucide React icons

const IncidentPage = () => {
  // Mock data for incidents
  const incidents = [
    {
      id: 1,
      website: "example.com",
      downtime: "2 hours 30 minutes",
    },
    {
      id: 2,
      website: "test.com",
      downtime: "1 day 5 hours",
    },
    {
      id: 3,
      website: "demo.com",
      downtime: "45 minutes",
    },
  ];

  // State to manage which incident's dropdown is open
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Function to toggle the dropdown
  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  // Function to handle actions (Acknowledge or Delete)
  const handleAction = (action, id) => {
    console.log(`${action} incident with id ${id}`);
    setOpenDropdownId(null); // Close the dropdown after action
  };

  return (
    <div className="text-white p-6 lg:pt-12 lg:max-w-6xl">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span>Incidents</span> <CloudAlert className="text-red-500 w-10 h-10" />
      </h1>

      {/* List of Incidents */}
      <div className="space-y-4">
        {incidents.map((incident) => (
          <div
            key={incident.id}
            className="bg-zinc-900 p-6 rounded-md flex justify-between items-center"
          >
            {/* Website Name and Downtime */}
            <div className="flex flex-row gap-2 items-center">
              <TriangleAlert className="text-red-600" />
              <div>
                <h2 className="text-lg font-bold">{incident.website}</h2>
                <p className="text-sm text-gray-300">
                  Downtime: {incident.downtime}
                </p>
              </div>
            </div>

            {/* Three Dots Icon and Dropdown */}
            <div className="relative">
              <EllipsisVertical
                className="cursor-pointer"
                onClick={() => toggleDropdown(incident.id)}
              />
              {/* Dropdown Menu */}
              {openDropdownId === incident.id && (
                <div className="bg-black absolute right-0 mt-2 w-48 text-zic-200 rounded-md shadow-lg z-10">
                  <button
                    onClick={() => handleAction("Acknowledge", incident.id)}
                    className="w-full px-4 py-2 text-left hover:bg-zinc-800 rounded-md flex items-center justify-between"
                  >
                    <span>Acknowledge </span> <Eye />
                  </button>
                  <button
                    onClick={() => handleAction("Delete", incident.id)}
                    className="block w-full px-4 py-2 text-left hover:bg-zinc-800 rounded-md text-red-400"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncidentPage;
