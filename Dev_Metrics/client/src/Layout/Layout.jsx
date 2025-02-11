import SideNav from "../components/SideNav.jsx";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-1 ">
      <aside className="w-full lg:w-[20%] ">
        <SideNav />
      </aside>
      <main className="flex-1 lg:mr-10">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
