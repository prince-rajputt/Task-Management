const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const taskRoutes = require("./routes/taskRoutes");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

// Make io accessible in routes
app.set("io", io);

app.use("/api/tasks", taskRoutes);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
