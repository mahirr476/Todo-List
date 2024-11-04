"use client"

import { useState, useEffect, createContext, useContext } from 'react';


const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]); 

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('https://api.freeapi.app/api/v1/todos');
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      setTodos(Array.isArray(data) ? data : []); 
      console.log("Fetched Todos: ", data); 
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  const addTodo = async (todo) => {
    try {
      const response = await fetch('https://api.freeapi.app/api/v1/todos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo),
      });
      const newTodo = await response.json();
      console.log("Added Todo: ", newTodo); 
      setTodos((prev) => [...prev, newTodo]);
    } catch (err) {
      setError('Failed to add todo');
      console.error(err);
    }
  };

  const updateTodo = async (id, updatedTodo) => {
    await fetch(`https://api.freeapi.app/api/v1/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTodo),
    });
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, ...updatedTodo } : todo)));
  };

  const deleteTodo = async (id) => {
    await fetch(`https://api.freeapi.app/api/v1/todos/${id}`, { method: 'DELETE' });
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, updateTodo, deleteTodo, error }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => useContext(TodoContext);


const TodoPage = () => {
  const { todos, addTodo, updateTodo, deleteTodo, error } = useTodos();
  const [text, setText] = useState('');

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (text) {
      addTodo({ title: text });
      setText(''); // Clear input field
    }
  };

  const handleUpdate = (id) => {
    const newText = prompt("Update your todo:");
    if (newText) {
      updateTodo(id, { title: newText });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">Todo App</h1>
      {error && <p className="text-red-500 text-center">{error}</p>} {/* Display error message */}
      <form className="flex mb-4" onSubmit={handleAddTodo}>
        <input 
          className="flex-1 border border-gray-300 rounded-l-md px-4 py-2"
          type="text" 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          placeholder="Add a new todo" 
          required 
        />
        <button className="bg-blue-500 text-white rounded-r-md px-4 py-2" type="submit">Add</button>
      </form>
      <ul className="space-y-2">
        {todos.length === 0 ? (
          <li className="text-gray-500 text-center">No todos available.</li>
        ) : (
          todos.map((todo) => (
            <li key={todo.id} className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
              <span>{todo.title}</span>
              <div>
                <button className="bg-yellow-400 text-white px-2 py-1 rounded-md mr-2" onClick={() => handleUpdate(todo.id)}>Update</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded-md" onClick={() => deleteTodo(todo.id)}>Delete</button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};


export default function App() {
  return (
    <TodoProvider>
      <TodoPage />
    </TodoProvider>
  );
}
