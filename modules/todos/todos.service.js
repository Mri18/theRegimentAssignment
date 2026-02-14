const Todo = require('./todos.model');

const createTodo = async (data) => {
    const todo = new Todo(data);
    return await todo.save();
};

const getMyTodos = async (userId, query) => {

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;

    const skip = (page - 1) * limit;

    const todos = await Todo.find({ user: userId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await Todo.countDocuments({ user: userId });

    return {
        data: todos,
        meta: {
            total,
            page,
            totalPages: Math.ceil(total / limit)
        }
    };
};

const updateTodo = async (todoId, userId, updates) => {

    const allowed = ['title', 'description', 'status'];
    const safeUpdates = {};

    allowed.forEach(field => {
        if (updates[field] !== undefined) {
            safeUpdates[field] = updates[field];
        }
    });

    const todo = await Todo.findOneAndUpdate(
        { _id: todoId, user: userId }, // ⭐ ownership check
        safeUpdates,
        { new: true, runValidators: true }
    );

    if (!todo) throw new Error('Todo not found');

    return todo;
};

const deleteTodo = async (todoId, userId) => {

    const todo = await Todo.findOneAndDelete({
        _id: todoId,
        user: userId
    });

    if (!todo) throw new Error('Todo not found');
};

module.exports = {
    createTodo,
    getMyTodos,
    updateTodo,
    deleteTodo
};