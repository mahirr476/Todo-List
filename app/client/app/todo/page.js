"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentTodoId, setCurrentTodoId] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/todos?_limit=5")
      .then((res) => setTodos(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleTodo = async (e) => {
    e.preventDefault();
    if (editMode) {
      try {
        const res = await axios.put(
          `https://jsonplaceholder.typicode.com/todos/${currentTodoId}`,
          {
            title: newTodo,
            completed: todos.find((todo) => todo.id === currentTodoId).completed,
          }
        );
        setTodos(todos.map((t) => (t.id === currentTodoId ? res.data : t)));
        setEditMode(false);
        setNewTodo("");
        toast({ title: "Success!", description: "Todo updated successfully", duration: 2000 });
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const res = await axios.post("https://jsonplaceholder.typicode.com/todos", {
          title: newTodo,
          completed: false,
        });
        setTodos([res.data, ...todos]);
        setNewTodo("");
        toast({ title: "Success!", description: "Todo added successfully", duration: 2000 });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const editTodo = (id, title) => {
    setEditMode(true);
    setNewTodo(title);
    setCurrentTodoId(id);
  };

  const toggleTodo = async (id) => {
    const todo = todos.find((todo) => todo.id === id);
    try {
      const res = await axios.put(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        ...todo,
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t.id === id ? res.data : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
      toast({ title: "Deleted", description: "Todo deleted successfully", duration: 2000 });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Todo List</h2>

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

        <ul className="space-y-3">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`flex items-center justify-between p-3 rounded-lg border bg-gray-50 shadow-sm ${
                todo.completed ? "line-through text-gray-500" : ""
              }`}
            >
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => toggleTodo(todo.id)}
                className="mr-3"
              />
              <span className="flex-grow">{todo.title}</span>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => editTodo(todo.id, todo.title)}>
                  Edit
                </Button>
                <Button variant="outline" onClick={() => deleteTodo(todo.id)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoApp;
