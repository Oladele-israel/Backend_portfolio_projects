import { Outlet } from "react-router-dom";
import Dashboardnav from "../components/dashboard/Dashboardnav";
import DashboardFooter from "../components/dashboard/DashboardFooter";

const DashboardLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Dashboardnav />
      <div className="flex-1">
        <Outlet />
      </div>
      <DashboardFooter />
    </div>
  );
};

export default DashboardLayout;
