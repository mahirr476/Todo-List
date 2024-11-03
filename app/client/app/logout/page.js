"use client";
import { useRouter } from "next/navigation";
const LogoutButton = () => {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };
  return (
    <button
      onClick={handleLogout}
      className="mt-4 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
