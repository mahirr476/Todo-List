"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useEffect, useState } from "react";

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentTodoId, setCurrentTodoId] = useState(null);
  const { toast } = useToast();

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(res.data);
    } catch (err) {
      console.error("Failed to fetch todos:", err);
      toast({
        title: "Error",
        description: "Failed to fetch todos. Please check the server or API endpoint.",
        duration: 2000,
      });
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleTodo = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const todoData = {
      title: newTodo,
      completed: editMode
        ? todos.find((todo) => todo.id === currentTodoId).completed
        : false,
    };

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (editMode) {
        setTodos((prevTodos) =>
          prevTodos.map((t) =>
            t.id === currentTodoId ? { ...t, title: newTodo } : t
          )
        );
        
        const res = await axios.put(
          `http://localhost:5000/api/todos/${currentTodoId}`,
          todoData,
          config
        );
        setEditMode(false);
      } else {
        const res = await axios.post("http://localhost:5000/api/todos", todoData, config);
        setTodos((prevTodos) => [res.data, ...prevTodos]);
      }
      setNewTodo("");
      toast({
        title: "Success!",
        description: editMode ? "Todo updated successfully" : "Todo added successfully",
        duration: 2000,
      });
    } catch (err) {
      console.error("Failed to save todo:", err);
      toast({
        title: "Error",
        description: "Failed to save todo. Please try again.",
        duration: 2000,
      });
    }
  };

  const editTodo = (id, title) => {
    setEditMode(true);
    setNewTodo(title);
    setCurrentTodoId(id);
  };

  const toggleTodo = async (id) => {
    const todo = todos.find((todo) => todo.id === id);
    const token = localStorage.getItem("token");
    try {
      setTodos((prevTodos) =>
        prevTodos.map((t) =>
          t.id === id ? { ...t, completed: !todo.completed } : t
        )
      );

      const res = await axios.put(
        `http://localhost:5000/api/todos/${id}`,
        { ...todo, completed: !todo.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to toggle todo:", err);
      toast({
        title: "Error",
        description: "Failed to toggle todo. Please try again.",
        duration: 2000,
      });
    }
  };

  const deleteTodo = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      toast({
        title: "Deleted",
        description: "Todo deleted successfully",
        duration: 2000,
      });
    } catch (err) {
      console.error("Failed to delete todo:", err);
      toast({
        title: "Error",
        description: "Failed to delete todo. Please try again.",
        duration: 2000,
      });
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Todo List
        </h2>

        <form onSubmit={handleTodo} className="flex mb-4">
          <Input
            type="text"
            placeholder={editMode ? "Edit todo..." : "Add a new todo"}
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="mr-2 w-full"
          />
          <Button type="submit" variant="default">
            {editMode ? "Update" : "Add"}
          </Button>
        </form>

        {todos.length === 0 ? (
          <div className="text-center text-gray-500">There are no todo items</div>
        ) : (
          <ul className="space-y-3">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-gray-50 shadow-sm"
              >
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                  className="mr-3"
                />
                <span
                  className={`flex-grow ${todo.completed ? "line-through text-gray-500" : ""}`}
                >
                  {todo.title}
                </span>
                <div className="flex space-x-2">
                  {!todo.completed && (
                    <Button
                      variant="outline"
                      onClick={() => editTodo(todo.id, todo.title)}
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => deleteTodo(todo.id)}
                    className={todo.completed ? "text-gray-400" : ""}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TodoApp;
