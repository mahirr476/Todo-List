"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (token) {
      router.push("/dashboard");
    }
  }, [token, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      // Assuming the backend now sends both the token and user data
      const { token, user } = res.data; // Get both token and user data

      toast({
        title: "Welcome back!",
        description: "Successfully logged in",
      });

      // Store token and user info in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", email);
      // localStorage.setItem("userPassword", password);
      localStorage.setItem("userId", user.id); // Store user ID

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Incorrect credentials",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 via-blue-600 to-yellow-600">
      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md space-y-6"
      >
        <h2 className="text-4xl font-extrabold text-center text-purple-800 mb-6">
          Login
        </h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full px-5 py-3 mb-4 border rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300"
          style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-5 py-3 mb-4 border rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300 pr-10" // Add padding for the icon
            style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
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
