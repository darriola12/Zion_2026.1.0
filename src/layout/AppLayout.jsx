import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Footer from "../components/footer";
import "../styles/layout.css"

const AppLayout = () => {
  return (
    <div className="layout-grid">
      <Sidebar />
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;

