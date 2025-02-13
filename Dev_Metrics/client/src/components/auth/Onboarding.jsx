import { useState } from "react";
import { Settings } from "lucide-react";

const Onboarding = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    companySize: "",
    role: "",
  });

  // Options for company size and role
  const companySizes = [
    { value: "1-10", label: "1-10 employees" },
    { value: "11-50", label: "11-50 employees" },
    { value: "51-200", label: "51-200 employees" },
    { value: "201-500", label: "201-500 employees" },
    { value: "501+", label: "501+ employees" },
  ];

  const roles = [
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Manager" },
    { value: "developer", label: "Developer" },
    { value: "analyst", label: "Analyst" },
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    // Add logic to submit the form data to your backend
  };
  return (
    <div className="text-white p-6 lg:mt-10 lg:max-w-4xl">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Settings />
        <span>Update Profile </span>
      </h1>

      {/* Update Profile Form */}
      <form onSubmit={handleSubmit}>
        {/* Company Name */}
        <div className="bg-black p-2 rounded-md">
          <label
            htmlFor="companyName"
            className="block text-sm font-medium mb-2"
          >
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            className="w-full p-2 bg-neutral-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#51E0CF]"
            placeholder="Enter your company name"
            required
          />
        </div>

        {/* Company Size */}
        <div className="bg-black p-2 rounded-md">
          <label
            htmlFor="companySize"
            className="block text-sm font-medium mb-2"
          >
            Company Size
          </label>
          <select
            id="companySize"
            name="companySize"
            value={formData.companySize}
            onChange={handleInputChange}
            className="w-full p-2 bg-neutral-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#51E0CF]"
            required
          >
            <option value="" disabled>
              Select company size
            </option>
            {companySizes.map((size) => (
              <option key={size.value} value={size.value}>
                {size.label}
              </option>
            ))}
          </select>
        </div>

        {/* Role */}
        <div className="bg-black p-2 rounded-md">
          <label htmlFor="role" className="block text-sm font-medium mb-2">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="w-full p-2 bg-neutral-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#51E0CF]"
            required
          >
            <option value="" disabled>
              Select your role
            </option>
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="bg-black p-2 rounded-md">
          <button
            type="submit"
            className="w-full bg-[#51E0CF] text-black px-4 py-2 rounded-md hover:bg-[#339c90] transition-colors font-bold"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default Onboarding;
