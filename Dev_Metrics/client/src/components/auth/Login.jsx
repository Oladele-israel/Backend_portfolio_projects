import { useState } from "react";
import axios from "axios";
import authBg from "../../assets/images/authbg.png";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const response = await axios.post(
        "http://localhost:8000/user/login",
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log("Login successful:", response.data);
      if (response.data.success) {
        navigate("/");
      } else {
        console.error("login failed:", response.data.message);
        alert(response.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      // Handle axios errors
      console.error("Error during signup:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        alert(
          error.response.data.message || "Signup failed. Please try again."
        );
      } else if (error.request) {
        // The request was made but no response was received
        alert("No response from the server. Please try again.");
      } else {
        // Something happened in setting up the request
        alert("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false); // Set loading back to false when the request is complete
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-gradient-to-tl from-black to-slate-50 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      <div className="absolute inset-0 bg-black opacity-70"></div>
      <div className="text-slate-300 relative self-start flex items-center p-2 pt-10 gap-4">
        <ArrowLeft className="cursor-pointer" />
        <p>Back to Dev_metrics</p>
      </div>

      <div className="bg-black border-[1px] border-[#51E0CF] p-8 rounded-lg shadow-lg w-[95vw] max-w-md relative mt-auto mb-auto flex flex-col text-white">
        <div className="text-white text-center text-3xl">Dev_Metrics</div>
        <div className="mt-2 text-center text-2xl font-bold text-slate-300">
          Welcome Back
        </div>
        <div className="mt-2 text-center mb-2 text-lg text-slate-300">
          First time here? Sign up for free
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mt-5 space-y-2 mb-2">
            <label htmlFor="email" className="text-slate-300 text-lg">
              E-mail
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="Your Work E-mail"
              value={formData.email}
              className="p-3 rounded-md text-black"
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col mt-5 space-y-2 mb-2">
            <label htmlFor="password" className="text-slate-300 text-lg">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="******"
              className="p-3 rounded-md text-black"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <button
            type="submit"
            className="mt-5 bg-[#51E0CF] hover:bg-[#339c90] text-center p-3 text-black capitalize rounded-lg w-full font-bold"
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
                Logging in.....
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
