const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 7777;
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io")
 
          
const io = new Server(server, {
  cors: {
    origin: "https://livevideoapp.onrender.com",
    methods: ["GET", "POST"],
  },
}); 
 
io.on("connection", (socket) => {
  // console.log(socket.id);
  socket.on("joinRoom", ({ name, roomId, peerId }) => {
    
    console.log(name, "roomId"+roomId, peerId)  
    socket.join(roomId)
    socket.to(roomId).emit("joined", { roomId, peerId,name});
    socket.emit("name",name)
  });
   
  socket.on("disconnect", () => { 
    socket.broadcast.emit("callEnded");
  });
});
 
server.listen(port, () =>
  console.log("server is running on port " + "" + port)
);
      