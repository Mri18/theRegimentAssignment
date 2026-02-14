const jwt = require('jsonwebtoken');

const setupSocket = (io) => {

  io.on('connection', (socket) => {
    console.log('socket connected:');
    try {
      const token = socket.handshake.auth.token;

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      const userId = decoded.userId;
      console.log('userId:', userId);

      socket.join(userId);

      console.log('Socket joined room:', userId);

    } catch (error) {
      socket.disconnect();
    }

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });

  });

};

module.exports = setupSocket;
