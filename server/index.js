const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const socketio = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const routes = require("./routes");
app.use("/", routes);

let players = [];
let otherPlayerChoice = null;
let playerChoice = null;

// const io = new Server(server, {
//   cors: {
//     origin: "https://64372cd23c90670060779932--onlinerock.netlify.app/",
//     methods: ["GET", "POST"],
//   },
// });
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// const corsOptions = {
//   origin: "*",
//   credentials: true,
//   optionSuccessStatus: 200,
// };

// app.use(cors(corsOptions));

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  players.push(socket.id);

  socket.on("join-room", (number) => {
    socket.join(number);
  });

  const playerNumber = players.indexOf(socket.id);
  socket.emit("playerNumber", playerNumber);

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);

    const index = players.indexOf(socket.id);
    players.splice(index, 1);
  });

  socket.on("choice", (data) => {
    console.log(`Player ${data.playerNumber} chose ${data.choice}`);

    // Find the other player
    const otherPlayer = players.find((player) => player !== socket.id);

    // Get the other player's choice
    socket.to(otherPlayer).emit("opposing-player-move", data.choice);
    socket.on("test", (move) => {
      otherPlayerChoice = move.choice;
      playerChoice = data.choice;

      // Determine the winner
      let result;

      if (playerChoice === otherPlayerChoice) {
        result = "It's a tie!";
      } else if (
        (playerChoice === 0 && otherPlayerChoice === 2) ||
        (playerChoice === 1 && otherPlayerChoice === 0) ||
        (playerChoice === 2 && otherPlayerChoice === 1)
      ) {
        result = `Player ${data.choice} wins!`;
      } else {
        result = `Player 2 wins!`;
      }

      // Emit the result to both players
      io.to(move.room).emit("game-result", result);

      // io.to(otherPlayer).emit("game-result", result);
      io.emit("disable-buttons");
    });
  });
});

server.listen(process.env.PORT || 5000, () => {
  console.log("SERVER IS RUNNING");
});
