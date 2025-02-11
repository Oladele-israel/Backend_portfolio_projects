import authBg from "../../assets/images/authbg.png";
import { ArrowLeft } from "lucide-react";

const Onboarding = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center bg-gradient-to-tl from-black to-slate-50 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      <div className="absolute inset-0 bg-black opacity-70"></div>
      <div className="text-slate-300 relative self-start flex items-center p-2 pt-10 gap-4 mb-5">
        <ArrowLeft className="cursor-pointer" />
        <p>Back to Dev_metrics</p>
      </div>

      <div className="bg-black border-[1px] border-[#51E0CF] p-8 rounded-lg shadow-lg w-[95vw] max-w-md relative mt-auto  flex flex-col text-white mb-10">
        <div className="text-white text-center text-3xl">Dev_Metrics</div>
        <div className="mt-2 text-center text-2xl font-bold text-slate-300">
          Welcome On baord
        </div>
        <div className="mt-2 text-center mb-2 text-lg text-slate-300">
          just a few more settings to set up your account 😉
        </div>

        <form action="">
          <div className="flex flex-col mt-5 space-y-2 mb-2 ">
            <label htmlFor="Email" className="text-slate-300 text-lg">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="Enter your full name"
              className="p-3 rounded-md text-black"
            />
          </div>
          <div className="flex flex-col mt-5 space-y-2 mb-2 ">
            <label htmlFor="password" className="text-slate-300 text-lg">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Enter a strong password"
              className="p-3 rounded-md text-black"
            />
          </div>
          <div className="flex flex-col mt-5 space-y-2 mb-2 ">
            <label htmlFor="company_name" className="text-slate-300 text-lg">
              Company name
            </label>
            <input
              type="text"
              required
              placeholder="Enter company name "
              className="p-3 rounded-md text-black"
            />
          </div>
          <div className="flex flex-col mt-5 space-y-2 mb-2 ">
            <label htmlFor="company_name" className="text-slate-300 text-lg">
              company Size
            </label>
            <select name="" id="" className="text-slate-800 p-2 rounded-md">
              <option value="">Just me</option>
              <option value="">Less than 5</option>
              <option value="">Above 5</option>
              <option value="">Above 50</option>
            </select>
          </div>
          <div className="flex flex-col mt-5 space-y-2 mb-2 ">
            <label htmlFor="company_name" className="text-slate-300 text-lg">
              Role
            </label>
            <select name="" id="" className="text-slate-800 p-2 rounded-md">
              <option value="">Intern</option>
              <option value="">Software engineer</option>
              <option value="">Product Manager</option>
              <option value="">Technical support</option>
            </select>
          </div>
          <button
            type="submit"
            className="mt-5 bg-[#51E0CF] hover:bg-[#339c90] text-center p-3 text-black capitalize rounded-lg w-full font-bold"
          >
            Finish Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
