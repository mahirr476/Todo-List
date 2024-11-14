const db = require('../config/db');

class TodoService {
    async createTodo(title, userId) {
        const checkQuery = 'SELECT * FROM todos WHERE title = ? AND created_by = ?';
        const insertQuery = 'INSERT INTO todos (title, created_by) VALUES (?, ?)';

        return new Promise((resolve, reject) => {
            db.query(checkQuery, [title, userId], (err, results) => {
                if (err) reject(err);
                if (results.length > 0) reject(new Error('Title already exists'));

                db.query(insertQuery, [title, userId], (err, result) => {
                    if (err) reject(err);
                    resolve({ id: result.insertId, title, created_by: userId });
                });
            });
        });
    }

    async getUserTodos(userId, isAdmin = false) {
        let query;
        let params;
    
        if (isAdmin) {
            query = 'SELECT todos.id, title, completed, todos.created_at, users.name FROM todos join users ON users.id = todos.created_by';
            params = [];
        } else {
            query = 'SELECT * FROM todos WHERE created_by = ?';
            params = [userId];
        }
    
        return new Promise((resolve, reject) => {
            db.query(query, params, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    async updateTodo(id, title, completed, userId, isAdmin) {
        const checkQuery = 'SELECT completed, created_by FROM todos WHERE id = ?';
        const updateQuery = 'UPDATE todos SET title = ?, completed = ?, updated_by = ?, updated_at = NOW() WHERE id = ?';

        return new Promise((resolve, reject) => {
            db.query(checkQuery, [id], (err, results) => {
                if (err) reject(err);
                if (results.length === 0) reject(new Error('Todo not found'));

                // Check for non-admin users
                if (!isAdmin && results[0].created_by !== userId) {
                    return reject(new Error('Not authorized to update this todo'));
                }

                // Check if  todo is already completed
                // if (results[0].completed) reject(new Error('Cannot update a completed todo'));

                db.query(updateQuery, [title, completed, userId, id], (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                });
            });
        });
    }

    async deleteTodo(id, userId) {
        const query = 'DELETE FROM todos WHERE id = ? AND created_by = ?';
        
        return new Promise((resolve, reject) => {
            db.query(query, [id, userId], (err, result) => {
                if (err) reject(err);
                if (result.affectedRows === 0) reject(new Error('Todo not found'));
                resolve(result);
            });
        });
    }
}

module.exports = new TodoService();