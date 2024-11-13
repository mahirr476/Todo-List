// routes/todoRoutes.js
const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");
const authenticateJWT = require("../middleware/authenticateJWT");

router.use(authenticateJWT);

router.post("/", todoController.create.bind(todoController));
router.get("/", todoController.getAllUserTodos.bind(todoController));
router.put("/:id", todoController.updateTodo.bind(todoController));
router.put("/status/:id", todoController.updateStatus.bind(todoController));
router.delete("/:id", todoController.deleteTodo.bind(todoController));

module.exports = router;
