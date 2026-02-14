const todoService = require('./todos.service');
const { getIO } = require('../../socket/io');

const createTodo = async (req, res, next) => {
    try {

        const todo = await todoService.createTodo({
            ...req.body,
            user: req.user.id
        });
        const io = getIO();
        // console.log('Emitting todoCreated event for user:', req.user.id);
        io.to(req.user.id.toString()).emit('todoCreated', todo);

        res.status(201).json({
            success: true,
            todo
        });

    } catch (error) {
        next(error);
    }
};

const getMyTodos = async (req, res, next) => {
    try {

        const result = await todoService.getMyTodos(
            req.user.id,
            req.query
        );

        res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {
        next(error);
    }
};

const updateTodo = async (req, res, next) => {
    try {

        const todo = await todoService.updateTodo(
            req.params.id,
            req.user.id,
            req.body
        );
        const io = getIO();
        io.to(req.user.id.toString()).emit('todoUpdated', todo);

        res.status(200).json({
            success: true,
            todo
        });

    } catch (error) {
        next(error);
    }
};

const deleteTodo = async (req, res, next) => {
    try {

        await todoService.deleteTodo(
            req.params.id,
            req.user.id
        );
        const io = getIO();
        io.to(req.user.id.toString()).emit('todoDeleted', { id: req.params.id });

        res.status(200).json({
            success: true,
            message: 'Todo deleted successfully'
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    createTodo,
    getMyTodos,
    updateTodo,
    deleteTodo
};