"use client"; 

import Link from "next/link";
import LogoutButton from "../logout/page";
import { useRouter } from "next/navigation"; 

const Navbar = () => {
  const router = useRouter(); 


  console.log("Current pathname:", router.pathname);

  return (
    <nav className="p-4">
      <ul className="flex space-x-6 justify-center">
        <li>
          <Link
            href="/dashboard"
            className={`p-2 rounded ${router.pathname === "/dashboard" ? "bg-blue-100 font-bold text-red-600" : ""}`}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/settings"
            className={`p-2 rounded ${router.pathname === "/settings" ? "bg-blue-100 font-bold text-red-600" : ""}`}
          >
            Settings
          </Link>
        </li>
        <li>
          <Link href="/">
            <LogoutButton />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
