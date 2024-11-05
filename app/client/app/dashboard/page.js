"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ProtectedRoute from "../protectedRoute/page";
import Header from "../header/page";
import Navbar from "../navbar/page";
import TodoApp from "../todo/page";

const Dashboard = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header Section */}
      <ProtectedRoute>
        <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 shadow-lg fixed top-0 left-0 right-0 z-10">
          <div className="container mx-auto flex justify-between items-center">
            <Header />
            <Navbar />
          </div>
        </header>
      </ProtectedRoute>

      {/* Main Content Section */}
      <main className="pt-20 flex justify-center items-start mt-12">
        <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg">
          <TodoApp />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
