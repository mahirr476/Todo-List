import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <div>
      <nav className="bg-gray-800 text-white p-4 shadow-md flex justify-between items-center">
        <div className="text-xl font-bold">MyApp</div> {/* Logo */}
        <div className="flex space-x-4">
          <a href="/dashboard" className="hover:text-gray-300">
            Dashboard
          </a>
          <a href="/settings" className="hover:text-gray-300">
            Settings
          </a>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-400"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
