"use client";
import { useState } from "react";
import ProtectedRoute from "../protectedRoute/page";
import Header from "../header/page";
import Navbar from "../navbar/page";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Settings() {
  const [username, setUsername] = useState("currentUsername"); // Default value
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match!");
      return;
    }

    if (!username || !currentPassword || !newPassword) {
      setError("All fields are required!");
      return;
    }

    setMessage("Changes saved successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <>
      <ProtectedRoute>
        <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 shadow-lg fixed top-0 left-0 right-0 z-10">
          <div className="container mx-auto flex justify-between items-center">
            <Header />
            <Navbar />
          </div>
        </header>
      </ProtectedRoute>

      <main className="flex justify-center items-center min-h-screen bg-gray-100 pt-20">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Settings
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            {error && <div className="text-red-500">{error}</div>}
            {message && <div className="text-green-500">{message}</div>}

            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full"
            />
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current Password"
              className="w-full"
            />
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="w-full"
            />
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
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
    </>
  );
}
