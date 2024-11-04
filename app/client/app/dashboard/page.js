"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ProtectedRoute from "../protectedRoute/page";
import Header from "../header/page";
import Navbar from "../navbar/page";

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([{ text: newTodo, completed: false }, ...todos]);
      setNewTodo("");
    }
  };

  const toggleTodo = (index) => {
    setTodos(
      todos.map((todo, i) =>
        i === index ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <ProtectedRoute>
        <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 shadow-lg fixed top-0 left-0 right-0 z-10">
          <div className="container mx-auto flex justify-between items-center">
            <Header />
            <Navbar />
          </div>
        </header>
      </ProtectedRoute>

      {/* Main Content Section */}
      <main className="flex py-24 justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4 text-center">
            Todo List
          </h2>

          {/* Add New Todo */}
          <form onSubmit={addTodo} className="flex mb-4">
            <Input
              type="text"
              placeholder="Add a new todo"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="mr-2 w-full"
            />
            <Button type="submit" className="bg-blue-500 text-white">
              Add
            </Button>
          </form>

          {/* Todo List */}
          <ul className="space-y-3">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={`flex items-center justify-between p-3 rounded-lg bg-gray-50 shadow-md ${
                  todo.completed ? "line-through text-gray-500" : ""
                } transition-all duration-300`}
              >
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(index)}
                  className="mr-3"
                />
                <span className="flex-grow">{todo.text}</span>
                <Button
                  variant="ghost"
                  onClick={() => deleteTodo(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
