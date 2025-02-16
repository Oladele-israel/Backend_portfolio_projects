import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import axios from "axios"; // Import axios for data fetching
import authBg from "../../assets/images/authbg.png";
import { ArrowLeft } from "lucide-react";
import Logo from "../utils/Logo.jsx";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API;

const Signup = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Use a single useState to manage form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

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
      const response = await axios.post(
        `${API_BASE_URL}/user/signup`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        navigate("/login");
      } else {
        console.error("Signup failed:", response.data.message);
        alert(response.data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      if (error.response) {
        alert(
          error.response.data.message || "Signup failed. Please try again."
        );
      } else if (error.request) {
        alert("No response from the server. Please try again.");
      } else {
        alert("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-gradient-to-tl from-black to-slate-50 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      <div className="absolute inset-0 bg-black opacity-70"></div>
      <div className="text-slate-300 relative self-start flex items-center p-2 pt-10 gap-4 ">
        <ArrowLeft className="cursor-pointer" />
        <Link to="/">Back to Dev_metrics</Link>
      </div>

      <div className="bg-black border-[1px] border-[#51E0CF] p-8 rounded-lg shadow-lg w-[95vw] max-w-md relative mt-auto mb-auto flex flex-col text-white">
        <div className="self-center">
          <Logo />
        </div>

        <div className="mt-2 text-center text-2xl font-bold text-slate-300">
          Sign up for free
        </div>
        <div className="mt-2 text-center mb-2 text-lg text-slate-300">
          already have an account? <Link to="/login">Login</Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mt-5 space-y-2 mb-2 ">
            <label htmlFor="Name" className="text-slate-300 text-lg">
              Name
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Your Work E-mail"
              className="p-3 rounded-md text-white bg-zinc-900 focus:ring-[#51E0CF]k"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col mt-5 space-y-2 mb-2 ">
            <label htmlFor="email" className="text-slate-300 text-lg">
              E-mail
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="Your Work E-mail"
              className="p-3 rounded-md text-white bg-zinc-900 focus:ring-[#51E0CF]"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col mt-5 space-y-2 mb-2 ">
            <label htmlFor="password" className="text-slate-300 text-lg">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="******"
              className="p-3 rounded-md text-white bg-zinc-900 focus:ring-[#51E0CF]k"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          <button
            type="submit"
            className="mt-5 bg-[#51E0CF] hover:bg-[#339c90] text-center p-3 text-black capitalize rounded-lg w-full font-bold flex items-center justify-center"
            disabled={loading} // Disable the button while loading
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
                Signing up...
              </>
            ) : (
              "Sign up"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
