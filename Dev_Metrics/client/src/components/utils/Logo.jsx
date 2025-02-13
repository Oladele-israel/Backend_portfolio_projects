import { ChartNoAxesCombined } from "lucide-react";

const Logo = () => {
  return (
    <div className="text-2xl text-center p-2">
      <div className="flex items-center">
        <span> Dev </span>
        <ChartNoAxesCombined className="text-[#51E0CF]" />
        <span>
          Metrics <span className="text-green-600">.</span>
        </span>
      </div>
    </div>
  );
};

export default Logo;
