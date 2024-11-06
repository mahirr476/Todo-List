// services/userService.js
const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserService {
    async registerUser(name, email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (name, password, email) VALUES (?, ?, ?)';
        
        return new Promise((resolve, reject) => {
            db.query(query, [name, hashedPassword, email], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    async getAllUsers() {
        const query = 'SELECT id, name, email FROM users';
        
        return new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    async updateUser(userId, name, email, password) {
        let hashedPassword = password ? await bcrypt.hash(password, 10) : null;
        const query = 'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?';
        
        return new Promise((resolve, reject) => {
            db.query(query, [name, email || null, hashedPassword, userId], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    async loginUser(email, password) {
        const query = 'SELECT * FROM users WHERE email = ?';
        
        return new Promise((resolve, reject) => {
            db.query(query, [email], async (err, results) => {
                if (err) reject(err);
                if (results.length === 0) reject(new Error('User not found'));
                
                const user = results[0];
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) reject(new Error('Invalid credentials'));
                
                const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });
                resolve({ token, user });
            });
        });
    }
}

module.exports = new UserService();