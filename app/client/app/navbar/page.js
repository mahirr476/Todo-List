import Link from "next/link";
import LogoutButton from "../logout/page";

const Navbar = () => {
  return (
    <nav className=" p-4">
      <ul className="flex space-x-6 justify-center">
        <li>
          <Link href="/dashboard" >
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/settings" >
            Settings
          </Link>
        </li>
        <li>
          <Link href="/" >
            <LogoutButton/>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
