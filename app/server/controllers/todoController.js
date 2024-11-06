// controllers/todoController.js
const todoService = require('../services/todoService');

class TodoController {
    async create(req, res) {
        try {
            const { title } = req.body;
            const userId = req.user.id;
            
            if (!title) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            const todo = await todoService.createTodo(title, userId);
            res.status(201).json(todo);
        } catch (error) {
            if (error.message === 'Title already exists') {
                return res.status(409).json({ message: 'Title already exists' });
            }
            res.status(500).json({ message: 'Error creating todo' });
        }
    }

    async getAllUserTodos(req, res) {
        try {
            const todos = await todoService.getUserTodos(req.user.id);
            res.json(todos);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving todos' });
        }
    }

    async updateTodo(req, res) {
        try {
            const { title, completed } = req.body;
            if (!title) {
                return res.status(400).json({ message: 'Fields are required' });
            }

            await todoService.updateTodo(req.params.id, title, completed, req.user.id);
            res.json({ message: 'Todo updated successfully' });
        } catch (error) {
            if (error.message === 'Todo not found') {
                return res.status(404).json({ message: 'Todo not found' });
            }
            if (error.message === 'Cannot update a completed todo') {
                return res.status(400).json({ message: 'Cannot update a completed todo' });
            }
            res.status(500).json({ message: 'Error updating todo' });
        }
    }

    async updateStatus(req, res) {
        try {
            const { completed } = req.body;
            if (typeof completed !== 'boolean') {
                return res.status(400).json({ message: 'Fields are required' });
            }

            await todoService.updateTodoStatus(req.params.id, completed, req.user.id);
            res.json({ message: 'Status updated successfully' });
        } catch (error) {
            if (error.message === 'Todo not found') {
                return res.status(404).json({ message: 'Todo not found' });
            }
            res.status(500).json({ message: 'Error updating status' });
        }
    }

    async deleteTodo(req, res) {
        try {
            await todoService.deleteTodo(req.params.id, req.user.id);
            res.json({ message: 'Todo deleted successfully' });
        } catch (error) {
            if (error.message === 'Todo not found') {
                return res.status(404).json({ message: 'Todo not found' });
            }
            res.status(500).json({ message: 'Error deleting todo' });
        }
    }
}

module.exports = new TodoController();