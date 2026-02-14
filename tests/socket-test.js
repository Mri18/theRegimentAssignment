const { io } = require("socket.io-client");

// replace with your access token
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OThlYjRjZmY5ZjY3ZjZiZDU2NGU3NjUiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc3MTA0MTM5MiwiZXhwIjoxNzcxMDQyMjkyfQ.eq3BmkbQO0lM5c_cC9dPZ-kKWNeTG768Xdf4dcI4LoY";

const socket = io("http://localhost:3000", {
  auth: {
    token: ACCESS_TOKEN
  }
});

socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);
});

socket.on("todoCreated", (data) => {
  console.log("🔥 todoCreated:", data);
});

socket.on("todoUpdated", (data) => {
  console.log("🔥 todoUpdated:", data);
});

socket.on("todoDeleted", (data) => {
  console.log("🔥 todoDeleted:", data);
});
