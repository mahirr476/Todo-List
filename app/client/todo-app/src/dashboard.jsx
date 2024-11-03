import React, { useState } from 'react';
import Navbar from './navbar';

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([{ text: newTodo, completed: false }, ...todos]);
      setNewTodo("");
    }
  };

  const toggleCompletion = (index) => {
    const updatedTodos = todos.map((todo, idx) => 
      idx === index ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  const deleteTodo = (index) => {
    const updatedTodos = todos.filter((_, idx) => idx !== index);
    setTodos(updatedTodos);
  };

  return (
    <div>
      <Navbar />

      <div className="p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Dashboard - Todo List- Add Item</h1>
        <div className="mb-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo"
            className="border rounded px-4 py-2 mr-2 w-80"
          />
          <button onClick={addTodo} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add
          </button>
        </div>

        <div className="space-y-2">
          {todos.map((todo, index) => (
            <div key={index} className="flex items-center justify-between border-b py-2">
              <div
                className={`flex items-center ${todo.completed ? "line-through text-gray-400" : ""}`}
                onClick={() => toggleCompletion(index)}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleCompletion(index)}
                  className="mr-2"
                />
                {todo.text}
              </div>
              <button
                onClick={() => deleteTodo(index)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
