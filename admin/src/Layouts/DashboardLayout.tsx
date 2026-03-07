import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";

const DashboardLayout = () => {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <Outlet />
    </div>
  )
};

export default DashboardLayout;
