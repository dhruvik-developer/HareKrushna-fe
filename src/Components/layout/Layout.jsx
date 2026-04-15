import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";

const Layout = () => {
  const navigate = useNavigate();
  const { token, logout } = useContext(UserContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      logout();
      navigate("/login");
    }
  }, [token, navigate, logout]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="p-3 sm:p-5 flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
