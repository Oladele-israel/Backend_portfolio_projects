import { CircleHelp } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_API;

const CreateMonitor = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    url: "",
    alert_when: "URL becomes unavailable",
    contact_mode: "E-mail",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${baseURL}/v1/web/monitor`, formData, {
        withCredentials: true,
      });
      console.log(response);

      if (response.data.success) {
        alert("Monitor created successfully!");
        navigate("/dashboard");
      } else {
        alert("Failed to create monitor. Please try again.");
      }
    } catch (error) {
      console.error("Error creating monitor:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="text-white p-4 lg:max-w-4xl lg:pt-12">
      <div className="text-2xl font-bold mb-14">Create monitor</div>
      <div className="font-semibold text-lg mb-3">What to monitor</div>
      <div className="text-zinc-200 mb-4 lg:text-sm">
        Configure the target website you wish to monitor after this the website
        will be pinged every 5mins to check if it is active and in case of any
        incident it reports to your mail.
      </div>
      {/* the form to take the website input */}
      <form onSubmit={handleSubmit}>
        <div className="bg-zinc-900 p-4 rounded-md border border-zinc-400 flex flex-col gap-2 mb-7">
          <label
            htmlFor="alert_when"
            className="font-semibold flex items-center gap-2"
          >
            <span>Alert us when</span>
            <CircleHelp className="w-4 self-center" />
          </label>
          <select
            name="alert_when"
            id="alert_when"
            value={formData.alert_when}
            onChange={handleInputChange}
            className="text-white bg-black p-3 border border-[#339c90] rounded-md"
          >
            <option value="URL becomes unavailable">
              URL becomes unavailable
            </option>
            <option value="URL returns HTTP status other than 200">
              URL returns HTTP status other than 200
            </option>
          </select>
          <label htmlFor="alert_when" className="text-sm text-zinc-300">
            We strongly recommend selecting "URL becomes unavailable" for now.
          </label>
        </div>

        <div className="bg-zinc-900 p-4 rounded-md border border-zinc-400 flex flex-col gap-2 mb-7">
          <label
            htmlFor="url"
            className="font-semibold flex items-center gap-2"
          >
            <span>URL to monitor</span>
            <CircleHelp className="w-4 self-center" />
          </label>
          <input
            type="text"
            name="url"
            required
            placeholder="https://"
            value={formData.url}
            onChange={handleInputChange}
            className="text-white bg-black p-3 border border-[#339c90] rounded-md"
          />
          <label htmlFor="url" className="text-sm text-zinc-300">
            This must be a valid URL
          </label>
        </div>

        {/* the escalation when the site is down */}
        <div className="font-semibold text-lg mb-3">
          Means to communicate incidents
        </div>
        <div className="text-zinc-200 mb-4 lg:text-sm">
          Set up the means to notify you when an incident occurs
        </div>
        <div className="bg-zinc-900 p-4 rounded-md border border-zinc-400 flex flex-col gap-2 mb-7">
          <label
            htmlFor="contact_mode"
            className="font-semibold flex items-center gap-2"
          >
            <span>When there is a new incident</span>
            <CircleHelp className="w-4 self-center" />
          </label>
          <select
            name="contact_mode"
            id="contact_mode"
            value={formData.contact_mode}
            onChange={handleInputChange}
            className="text-white bg-black p-3 border border-[#339c90] rounded-md"
          >
            <option value="SMS">SMS</option>
            <option value="E-mail">E-mail</option>
            <option value="Push notification">Push notification</option>
          </select>
        </div>

        {/* the submit button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 mb-10 bg-[#51E0CF] hover:bg-[#339c90] text-center p-3 text-black capitalize rounded-lg w-full font-bold"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-3 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating .....
            </>
          ) : (
            "Create monitor"
          )}
        </button>
      </form>
    </section>
  );
};

export default CreateMonitor;
