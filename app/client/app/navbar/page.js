"use client"; 

import Link from "next/link";
import LogoutButton from "../logout/page";
import { usePathname } from "next/navigation"; 

const Navbar = () => {
  const pathname = usePathname(); // Use usePathname instead of useRouter

  return (
    <nav className="p-2">
      <ul className="flex space-x-2 justify-center items-center">
        <li>
          <Link
            href="/dashboard"
            className={`p-2 rounded ${pathname === "/dashboard" ? "bg-blue-100 font-bold text-red-600" : ""}`}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/settings"
            className={`p-2 rounded ${pathname === "/settings" ? "bg-blue-100 font-bold text-red-600" : ""}`}
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
