// services/userService.js
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class UserService {
  async registerUser(name, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO users (name, password, email) VALUES (?, ?, ?)";

    return new Promise((resolve, reject) => {
      db.query(query, [name, hashedPassword, email], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
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
      "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?";

    return new Promise((resolve, reject) => {
      db.query(
        query,
        [name, email || null, hashedPassword, userId],
        (err, result) => {
          if (err) {
            // Log the error details for debugging purposes
            console.error("Error in query:", err);
            reject(err);
          }
          resolve(result);
        }
      );
    });
  }

  async loginUser(email, password) {
    const query = "SELECT * FROM users WHERE email = ?";

    return new Promise((resolve, reject) => {
      db.query(query, [email], async (err, results) => {
        if (err) reject(err);
        if (results.length === 0) reject(new Error("User not found"));

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) reject(new Error("Invalid credentials"));

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "2h",
        });
        resolve({ token, user }); // Returning both token and user
      });
    });
  }

  // async updateUser(userId, name, email, password) {
  //   let hashedPassword = password ? await bcrypt.hash(password, 10) : null;
  //   const query =
  //     "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?";

  //   return new Promise((resolve, reject) => {
  //     db.query(
  //       query,
  //       [name, email || null, hashedPassword, userId],
  //       (err, result) => {
  //         if (err) reject(err);
  //         resolve(result);
  //       }
  //     );
  //   });
  // }
  // async updateUser(userId, name, email, password) {
  //     try {
  //       // Hash the password if provided
  //       let hashedPassword = password ? await bcrypt.hash(password, 10) : null;

  //       // SQL query to update user data
  //       const query =
  //         "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?";

  //       // If email is null, we pass the current email value
  //       // If the email is not provided, we assume we keep the old email.
  //       const user = await this.getUserById(userId); // Make sure to retrieve the current user info
  //       const finalEmail = email || user.email; // fallback to current email if email is not provided

  //       return new Promise((resolve, reject) => {
  //         db.query(
  //           query,
  //           [name, finalEmail, hashedPassword || user.password, userId], // update password only if it is provided
  //           (err, result) => {
  //             if (err) {
  //               reject({
  //                 message: "Error updating user",
  //                 error: err,
  //               });
  //             } else {
  //               resolve(result);
  //             }
  //           }
  //         );
  //       });
  //     } catch (err) {
  //       throw new Error("Internal Server Error: " + err.message);
  //     }
  //   }

  // async loginUser(email, password) {
  //     const query = 'SELECT * FROM users WHERE email = ?';

  //     return new Promise((resolve, reject) => {
  //         db.query(query, [email], async (err, results) => {
  //             if (err) reject(err);
  //             if (results.length === 0) reject(new Error('User not found'));

  //             const user = results[0];
  //             const isMatch = await bcrypt.compare(password, user.password);
  //             if (!isMatch) reject(new Error('Invalid credentials'));

  //             const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });
  //             resolve({ token, user });
  //         });
  //     });
  // }
  //   async loginUser(email, password) {
  //     const query = "SELECT * FROM users WHERE email = ?";

  //     return new Promise((resolve, reject) => {
  //       db.query(query, [email], async (err, results) => {
  //         if (err) return reject(err);
  //         if (results.length === 0) return reject(new Error("User not found"));

  //         const user = results[0];
  //         console.log("User fetched:", user);

  //         try {
  //           const isMatch = await bcrypt.compare(password, user.password);
  //           if (!isMatch) return reject(new Error("Invalid credentials"));

  //           console.log(
  //             "JWT_SECRET before token generation:",
  //             process.env.JWT_SECRET
  //           );

  //           // Generate token
  //           const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
  //             expiresIn: "2h",
  //           });

  //           console.log("Generated token:", token);

  //           if (!token) {
  //             return reject(new Error("Token generation failed"));
  //           }

  //           resolve({ token, user });
  //         } catch (error) {
  //           console.error("Error during token generation:", error);
  //           reject(error);
  //         }
  //       });
  //     });
  //   }
}

module.exports = new UserService();
