// services/userService.js
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class UserService {

  async registerUser(name, email, password, role_id = 2) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const checkEmail = "SELECT id FROM users WHERE email = ?";
    const query = "INSERT INTO users (name, password, email, role_id) VALUES (?, ?, ?, ?)";

    try {
      // Check if email already exists
      const [results] = await db.promise().query(checkEmail, [email]);
      if (results.length > 0) {
        throw new Error('Email already registered');
      }

      await db.promise().query(query, [name, hashedPassword, email, role_id]);
    } catch (err) {
      // Ensure the error message aligns with what's expected in the controller
      throw new Error(err.message || 'Database error');
    }
  }
  async getAllUsers() {
    const query = "SELECT id, name, email FROM users";

    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  }

  async updateUser(userId, name, email, password) {
    let hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const query =
      "UPDATE users SET name = ?, email = ?, password = ?, updated_at = NOW() WHERE id = ?";

    return new Promise((resolve, reject) => {
      db.query(
        query,
        [name, email || null, hashedPassword, userId],
        (err, result) => {
          if (err) {
            console.error("Error in query:", err);
            reject(err);
          }
          resolve(result);
        }
      );
    });
  }

  async loginUser(email, password) {
    const query = 'SELECT * FROM users WHERE email = ?';
    
    return new Promise((resolve, reject) => {
        db.query(query, [email], async (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                return reject(new Error('Database query error'));
            }

            if (results.length === 0) {
                return reject(new Error('User not found'));
            }

            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return reject(new Error('Invalid credentials'));
            }

            // Generating JWT token
            const token = jwt.sign({ 
                id: user.id, 
                role: user.role_id === 1 ? 'admin' : 'user'  // Assuming 1 is admin, 2 is user
            }, process.env.JWT_SECRET, { expiresIn: '10h' });

            // Returning the token and user object
            resolve({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role_id === 1 ? 'admin' : 'user',  // Including role in the response
                }
            });
        });
    });
}

  async getUserPermissions(userId) {
    const query = `
        SELECT permissions.name
        FROM users
        JOIN roles ON users.role_id = roles.id
        JOIN role_permissions ON roles.id = role_permissions.role_id
        JOIN permissions ON role_permissions.permission_id = permissions.id
        WHERE users.id = ?`;

    return new Promise((resolve, reject) => {
        db.query(query, [userId], (err, results) => {
            if (err) reject(err);
            if (results.length === 0) {
                reject(new Error('No permissions found for this user'));
            }
            const permissions = results.map(result => result.name);
            resolve(permissions);
        });
    });
  }

  async getUserRole(userId) {
    const query = 'SELECT roles.name FROM users JOIN roles ON users.role_id = roles.id WHERE users.id = ?';
    return new Promise((resolve, reject) => {
        db.query(query, [userId], (err, results) => {
            if (err) reject(err);
            if (results.length === 0) reject(new Error('User not found'));
            resolve(results[0].name);
        });
    });
}


}

module.exports = new UserService();
