let io;

const setIO = (_io) => {
  io = _io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { setIO, getIO };
