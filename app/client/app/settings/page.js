"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Header from "../header/page";
import Navbar from "../navbar/page";
import ProtectedRoute from "../protectedRoute/page";

export default function Settings() {
  const { toast } = useToast();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Fetch user details from localStorage or session storage
    const userEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("userName"); // Assuming name is stored in localStorage
    if (userEmail) {
      setEmail(userEmail);
      setName(userName || ""); // Set name if available in localStorage
    } else {
      toast({
        title: "Error",
        description: "User data not found. Please log in again.",
        variant: "destructive",
      });
      router.push("/login"); // Redirect if user is not logged in
    }
  }, [router, toast]);

  const handleSave = async (e) => {
    e.preventDefault();

    // Get the userId from localStorage or other source
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast({
        title: "Error",
        description: "User ID is missing.",
        variant: "destructive",
      });
      return;
    }

    // Validation: Ensure all fields are filled
    if (!name || !email || !password) {
      toast({
        title: "Error",
        description: "All fields are required!",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication token is missing.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`http://localhost:5000/api/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success!",
          description: "User updated successfully.",
          variant: "success",
        });
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", name);
      } else {
        toast({
          title: "Error",
          description: data.message || "Error updating user.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating user.",
        variant: "destructive",
      });
    }

    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <>
      {" "}
      <ProtectedRoute>
        <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 shadow-lg fixed top-0 left-0 right-0 z-10">
          <div className="container mx-auto flex justify-between items-center">
            <Header />
            <Navbar />
          </div>
        </header>

        <main className="flex justify-center items-center min-h-screen bg-gray-100 pt-20">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Settings
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="User Name"
                className="w-full"
              />
              <Input
                type="email"
                value={email}
                placeholder="User Email"
                className="w-full"
                readOnly
              />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full"
              />
              <Button
                type="submit"
                className="bg-blue-500 text-white w-full mt-4"
              >
                Save Changes
              </Button>
            </form>
          </div>
        </main>
      </ProtectedRoute>
    </>
  );
}
