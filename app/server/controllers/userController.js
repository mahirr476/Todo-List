const userService = require("../services/userService");

class UserController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      await userService.registerUser(name, email, password);
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }

  async getAllUsers(req, res) {
    try {
      const results = await userService.getAllUsers();
      if (results.length === 0) {
        return res.status(404).json({ message: "No users found" });
      }
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving users" });
    }
  }

  async updateUser(req, res) {
    try {
      const userId = req.params.id;
      const { name, email, password } = req.body;
      const result = await userService.updateUser(
        userId,
        name,
        email,
        password
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User updated successfully" });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Error updating user" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { token, user } = await userService.loginUser(email, password); // Include user data here
      res.json({ token, user });
    } catch (error) {
      if (
        error.message === "User not found" ||
        error.message === "Invalid credentials"
      ) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      res.status(500).json({ message: "Database error" });
    }
  }

  // async updateUser(req, res) {
  //     try {
  //         const userId = req.params.id;
  //         const { name, email, password } = req.body;
  //         const result = await userService.updateUser(userId, name, email, password);

  //         if (result.affectedRows === 0) {
  //             return res.status(404).json({ message: 'User not found' });
  //         }
  //         res.json({ message: 'User updated successfully' });
  //     } catch (error) {
  //         res.status(500).json({ message: 'Error updating user' });
  //     }
  // }

  // async login(req, res) {
  //     try {
  //         const { email, password } = req.body;
  //         const { token } = await userService.loginUser(email, password);
  //         res.json({ token });
  //     } catch (error) {
  //         if (error.message === 'User not found' || error.message === 'Invalid credentials') {
  //             return res.status(401).json({ message: 'Invalid credentials' });
  //         }
  //         res.status(500).json({ message: 'Database error' });
  //     }
  // }
}

module.exports = new UserController();
