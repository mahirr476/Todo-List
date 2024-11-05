"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Header from "../header/page"; // Adjust the path based on your structure
import Navbar from "../navbar/page"; // Adjust the path based on your structure
import { Eye, EyeOff } from "lucide-react"; // Import icons from lucide-react or any icon library

export default function Settings() {
  const { toast } = useToast();
  const router = useRouter();


  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

 
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail"); 
    if (userEmail) {
      setEmail(userEmail);
    } else {
      toast({
        title: "Error",
        description: "User data not found. Please log in again.",
        variant: "destructive",
      });
      router.push("/login"); 
    }
  }, [router, toast]);

  const handleSave = (e) => {
    e.preventDefault();

    // Validation: All fields required
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "All fields are required!",
        variant: "destructive",
      });
      return;
    }

    // Validation: New passwords match
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match!",
        variant: "destructive",
      });
      return;
    }

    // Simulate successful save (replace with actual save logic)
    toast({
      title: "Success!",
      description: "Changes saved successfully!",
      variant: "success",
    });

    // Clear form fields after save
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <>
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
              type="email"
              value={email}
              placeholder="User Email"
              className="w-full"
              readOnly
            />
            <div className="relative">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current Password"
                className="w-full pr-10" // Add padding for the icon
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showCurrentPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full pr-10" 
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showNewPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
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
