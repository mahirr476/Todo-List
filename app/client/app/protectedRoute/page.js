"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const token = isClient ? localStorage.getItem("token") : null;

  useEffect(() => {
    setIsClient(true); // Ensures this runs only on the client
    if (isClient && !token) {
      router.push("/login");
    }
  }, [token, router, isClient]);

  return isClient && token ? children : null;
};

export default ProtectedRoute;
