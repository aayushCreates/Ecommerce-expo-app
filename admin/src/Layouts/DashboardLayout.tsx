import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  return (
    <div>
      <div className="drawer lg:drawer-open">
        <input
          id="my-drawer"
          type="checkbox"
          className="drawer-toggle"
          defaultChecked
        />

        <div className="drawer-content">
          <Navbar />
          <main className="p-6">
            <Outlet />
          </main>
        </div>
        <Sidebar />
      </div>
    </div>
  );
};

export default DashboardLayout;
