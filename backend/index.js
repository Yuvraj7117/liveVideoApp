const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io")
 
  //  https://livevideoapp.onrender.com       
const io = new Server(server, {
  cors: {
    origin:
      "https://64b7cd75dc48e600978ac4ed--niranjanlivevideoapp.netlify.app/",
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
      