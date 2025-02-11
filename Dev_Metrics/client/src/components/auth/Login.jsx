import authBg from "../../assets/images/authbg.png";
import { ArrowLeft } from "lucide-react";

const Login = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-gradient-to-tl from-black to-slate-50 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      <div className="absolute inset-0 bg-black opacity-70"></div>
      <div className="text-slate-300 relative self-start flex items-center p-2 pt-10 gap-4 ">
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

        <form action="">
          <div className="flex flex-col mt-5 space-y-2 mb-2 ">
            <label htmlFor="Email" className="text-slate-300 text-lg">
              E-mail
            </label>
            <input
              type="email"
              required
              placeholder="Your Work E-mail"
              className="p-3 rounded-md text-black"
            />
          </div>
          <div className="flex flex-col mt-5 space-y-2 mb-2 ">
            <label htmlFor="Password" className="text-slate-300 text-lg">
              Password
            </label>
            <input
              type="email"
              required
              placeholder="*********"
              className="p-3 rounded-md text-black"
            />
          </div>
          <button
            type="submit"
            className="mt-5 bg-[#51E0CF] hover:bg-[#339c90] text-center p-3 text-black capitalize rounded-lg w-full font-bold"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
