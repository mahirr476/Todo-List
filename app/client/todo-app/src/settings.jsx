import { useState } from 'react';
import Navbar from './navbar';

const Settings = () => {
  const [username, setUsername] = useState("currentUsername"); // Default value
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    setError(""); 

    // Simple validation
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match!");
      return;
    }

    if (!username || !currentPassword || !newPassword) {
      setError("All fields are required!");
      return;
    }

    // Simulate a save operation
    setMessage("Changes saved successfully!");
    setUsername(newPassword); // Simulate changing the username
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4 text-center">Settings</h1>
          <form onSubmit={handleSave} className="space-y-4">
            {error && <div className="text-red-500 text-center">{error}</div>}
            {message && <div className="text-green-500 text-center">{message}</div>}
            
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
            
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current Password"
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
            
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
            
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
            
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600 transition duration-300"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Settings;
