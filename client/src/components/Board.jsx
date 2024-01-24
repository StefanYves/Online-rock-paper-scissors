import React from "react";
import Game from "./Game";

const Board = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex justify-center items-center bg-sky-700 p-96 rounded-3xl w-4/6 h-96">
        <Game />
      </div>
    </div>
  );
};

export default Board;
