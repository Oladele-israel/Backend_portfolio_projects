import { useState } from "react";
import axios from "axios";
import authBg from "../../assets/images/authbg.png";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../utils/Logo.jsx";
import { useAuthContext } from "../../contexts/authContext.jsx";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { loginUser, loading, setLoading, error } = useAuthContext();

  axios.defaults.withCredentials = true;

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
      await loginUser({ email: formData.email, password: formData.password });
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
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
      <div
        className="text-slate-300 relative self-start flex items-center p-2 pt-10 gap-4 cursor-pointer"
        onClick={() => navigate("/dashbaord")}
      >
        <ArrowLeft />
        <Link to="/">Back to Dev_metrics</Link>
      </div>

      <div className="bg-black border-[1px] border-[#51E0CF] p-8 rounded-lg shadow-lg w-[95vw] max-w-md relative mt-auto mb-auto flex flex-col text-white">
        <div className="self-center">
          <Logo />
        </div>
        <div className="mt-2 text-center text-2xl font-bold text-slate-300">
          Welcome Back
        </div>
        <div className="mt-2 text-center mb-2 text-lg text-slate-300">
          First time here? <Link to="/signup"> Sign up for free </Link>
        </div>

        {error && (
          <div className="text-red-500 text-center mb-4">
            {error.response?.data?.message || "Login failed. Please try again."}
          </div>
        )}

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
              className="p-3 rounded-md text-white bg-zinc-900 focus:ring-[#51E0CF]"
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
              className="p-3 rounded-md text-white  bg-zinc-900 focus:ring-[#51E0CF]"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <button
            type="submit"
            className="mt-5 bg-[#51E0CF] hover:bg-[#339c90] text-center p-3 text-black capitalize rounded-lg w-full font-bold"
            disabled={loading}
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
