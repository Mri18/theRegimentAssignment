const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middlewares/auth.middleware');

const {
  createTodo,
  getMyTodos,
  updateTodo,
  deleteTodo
} = require('./todos.controller');


router.post('/create', authMiddleware, createTodo);
router.get('/get', authMiddleware, getMyTodos);
router.patch('/update/:id', authMiddleware, updateTodo);
router.delete('/delete/:id', authMiddleware, deleteTodo);

module.exports = router;
