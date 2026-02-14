require('dotenv').config();

const connectDB = require('./config/database');
const http = require('http');
const { Server } = require('socket.io');

const { setIO } = require('./socket/io');
const setupSocket = require('./socket/socket');

connectDB()
  .then(() => {

    const app = require('./app');

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: 'http://localhost:3000',
        credentials: true
      }
    });

    setIO(io);

    setupSocket(io);

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
  });
