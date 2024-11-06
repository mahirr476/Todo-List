// services/todoService.js
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

    async getUserTodos(userId) {
        const query = 'SELECT * FROM todos WHERE created_by = ?';
        
        return new Promise((resolve, reject) => {
            db.query(query, [userId], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    async updateTodo(id, title, completed, userId) {
        const checkQuery = 'SELECT completed FROM todos WHERE id = ? AND created_by = ?';
        const updateQuery = 'UPDATE todos SET title = ?, completed = ? WHERE id = ? AND created_by = ?';

        return new Promise((resolve, reject) => {
            db.query(checkQuery, [id, userId], (err, results) => {
                if (err) reject(err);
                if (results.length === 0) reject(new Error('Todo not found'));
                if (results[0].completed) reject(new Error('Cannot update a completed todo'));

                db.query(updateQuery, [title, completed, id, userId], (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                });
            });
        });
    }

    async updateTodoStatus(id, completed, userId) {
        const query = 'UPDATE todos SET completed = ? WHERE id = ? AND created_by = ?';
        
        return new Promise((resolve, reject) => {
            db.query(query, [completed, id, userId], (err, result) => {
                if (err) reject(err);
                if (result.affectedRows === 0) reject(new Error('Todo not found'));
                resolve(result);
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