"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (token) {
      router.push("/dashboard");
    }
  }, [token, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://api.escuelajs.co/api/v1/auth/login", { email, password });
      toast({ title: "Login", description: "Logged in successfully" });
      localStorage.setItem("token", res.data.access_token);
      router.push("/dashboard");
    } catch (error) {
      toast({ title: "Login failed", description: "Incorrect credentials", variant: "destructive" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-pink-700 to-indigo-900">
      <form onSubmit={handleLogin} className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-4xl font-extrabold text-center text-purple-800 mb-6">Login</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-5 py-3 mb-4 border rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300"
          style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-5 py-3 mb-4 border rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300"
          style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
        />
        <button
          type="submit"
          className="w-full py-3 text-white font-bold bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-pink-500 transition duration-300"
        >
          Login
        </button>
        <p className="text-center text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link href="/register" className="text-purple-300 hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
