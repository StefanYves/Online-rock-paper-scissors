import React, { useEffect } from "react";
import { useState } from "react";
import io from "socket.io-client";
import handpaper from "../assets/handpaper.png";
import handrock from "../assets/handrock.png";
import handscissors from "../assets/handscissors.png";

const socket = io("https://nodeserver-ksj7.onrender.com");

const Game = () => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [opposingPlayerChoice, setOpposingPlayerChoice] = useState(null);
  const [playerNumber, setPlayerNumber] = useState(null);
  const [disabled, setDisabled] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const [room, setRoom] = useState(null);

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join-room", room);
    }
  };

  const choices = [
    {
      id: 0,
      name: "Rock",
      image: handrock,
    },
    {
      id: 1,
      name: "Paper",
      image: handpaper,
    },
    {
      id: 2,
      name: "Scissors",
      image: handscissors,
    },
  ];

  const handlePlayerChoice = (choice) => {
    setPlayerChoice(choice);
    const data = {
      playerNumber: playerNumber,
      choice: choice,
      room: room,
    };
    socket.emit("choice", data);
  };

  socket.on("opposing-player-move", (choice) => {
    setOpposingPlayerChoice(choice);
    const move = {
      choice: choice,
      room: room,
    };
    socket.emit("test", move);
  });

  socket.on("player-number", (playerNumber) => {
    setPlayerNumber(playerNumber);
  });

  useEffect(() => {
    socket.on("game-result", (result) => {
      console.log("Received game result:", result);
      setGameResult(result);
    });
  });

  useEffect(() => {
    socket.on("enable-buttons", () => {
      setDisabled(false);
    });

    socket.on("disable-buttons", () => {
      setDisabled(true);
    });
  });

  const handleNextGame = () => {
    setGameResult(null);
    setDisabled(false);
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center mt-2">
      <div>
        <h1 className="text-lg font-bold text-white text-center">
          Rock Paper Scissors
        </h1>
        <input
          type="text"
          placeholder="Type room number..."
          className="p-1"
          onChange={(event) => {
            setRoom(event.target.value);
          }}
        />
        <button className="bg-sky-400 p-1" onClick={joinRoom}>
          Join Room
        </button>
      </div>
      <div className="flex justify-between mb-2">
        {choices.map((choice) => (
          <button
            key={choice.id}
            className="text-lg bold cursor-pointer my-4 px-4 py-4 border-none mr-4 transition ease-in-out hover:-translate-y-1 hover:scale-110 bg-red-700 hover:bg-green-700 duration-200 rounded-full "
            onClick={() => handlePlayerChoice(choice.id)}
            disabled={disabled}
          >
            <img className="w-14 h-14" src={choice.image} alt={choice.name} />
          </button>
        ))}
      </div>
      <div className="flex justify-around items-center mb-50">
        {gameResult && (
          <div className="flex flex-row">
            <div className="flex items-center mr-14">
              <p className="text-lg font-bold text-white">You chose:</p>
              <img
                className="w-14 h-14"
                src={choices[playerChoice].image}
                alt={choices[playerChoice].name}
              />
            </div>

            <div className="flex items-center">
              <p className="text-lg font-bold text-white">Player 2 chose:</p>
              <img
                className="w-14 h-14"
                src={choices[opposingPlayerChoice].image}
                alt={choices[opposingPlayerChoice].name}
              />
            </div>
          </div>
        )}
        <p className="ml-14 text-lg font-bold text-white">{gameResult}</p>
      </div>

      <button
        className="text-lg bold cursor-pointer my-4 px-4 py-4 bg-sky-400 border-none rounded-full"
        onClick={handleNextGame}
      >
        Restart
      </button>
    </div>
  );
};

export default Game;
