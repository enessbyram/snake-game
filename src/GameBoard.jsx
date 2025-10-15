import React, { useState, useEffect } from "react";
import "./assets/styles/style.css";

function GameBoard({ isPlaying, setGameState, difficulty }) {
  const gridSize = 20;

  const [snake, setSnake] = useState([[5, 5]]);
  const [food, setFood] = useState([8, 8]);
  const [direction, setDirection] = useState("RIGHT");
  const [speed, setSpeed] = useState(300);
  const [obstacles, setObstacles] = useState([]);

  // Obstacles (Hard mode)
  useEffect(() => {
    if (difficulty === "Hard" && isPlaying) {
      const obs = [];
      while (obs.length < 10) {
        const pos = [
          Math.floor(Math.random() * gridSize),
          Math.floor(Math.random() * gridSize),
        ];
        if (
          !snake.some((s) => s[0] === pos[0] && s[1] === pos[1]) &&
          !(food[0] === pos[0] && food[1] === pos[1]) &&
          !obs.some((o) => o[0] === pos[0] && o[1] === pos[1])
        ) {
          obs.push(pos);
        }
      }
      setObstacles(obs);
    } else {
      setObstacles([]); // Hard değilse temizle
    }
    // sadece oyun başında çalışsın
  }, [difficulty, isPlaying]);

  // Difficulty speed
  useEffect(() => {
    if (!isPlaying) return;
    switch (difficulty) {
      case "Easy":
        setSpeed(300);
        setObstacles([]);
        break;
      case "Normal":
        setSpeed(200);
        setObstacles([]);
        break;
      case "Hard":
        setSpeed(150);
        break;
      default:
        break;
    }
  }, [isPlaying, difficulty]);

  // Snake movement
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [snake, direction, speed, isPlaying]);

  // Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
        default:
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  const moveSnake = () => {
    const head = snake[snake.length - 1];
    let newHead;

    switch (direction) {
      case "UP":
        newHead = [head[0] - 1, head[1]];
        break;
      case "DOWN":
        newHead = [head[0] + 1, head[1]];
        break;
      case "LEFT":
        newHead = [head[0], head[1] - 1];
        break;
      case "RIGHT":
        newHead = [head[0], head[1] + 1];
        break;
    }

    // Collision
    if (
      newHead[0] < 0 ||
      newHead[0] >= gridSize ||
      newHead[1] < 0 ||
      newHead[1] >= gridSize ||
      snake.some((seg) => seg[0] === newHead[0] && seg[1] === newHead[1]) ||
      obstacles.some((obs) => obs[0] === newHead[0] && obs[1] === newHead[1])
    ) {
      setGameState(snake.length - 1);
      return;
    }

    const newSnake = [...snake, newHead];

    // Eat food
    if (newHead[0] === food[0] && newHead[1] === food[1]) {
      placeFood();
      setSpeed((prev) =>
        Math.max(
          prev -
          (difficulty === "Easy"
            ? 10
            : difficulty === "Normal"
              ? 20
              : 30),
          50
        )
      );
    } else {
      newSnake.shift();
    }

    setSnake(newSnake);
  };

  const placeFood = () => {
    let newFood;
    do {
      newFood = [
        Math.floor(Math.random() * gridSize),
        Math.floor(Math.random() * gridSize),
      ];
    } while (
      snake.some((seg) => seg[0] === newFood[0] && seg[1] === newFood[1]) ||
      obstacles.some((obs) => obs[0] === newFood[0] && obs[1] === newFood[1])
    );
    setFood(newFood);
  };

  const renderGrid = () => {
    const grid = Array(gridSize)
      .fill(0)
      .map(() => Array(gridSize).fill("empty"));

    snake.forEach(([x, y], idx) => {
      grid[x][y] = idx === snake.length - 1 ? "snake-head" : "snake-body";
    });
    grid[food[0]][food[1]] = "food";
    obstacles.forEach(([x, y]) => (grid[x][y] = "obstacle"));

    return grid;
  };

  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: `repeat(${gridSize}, 20px)` }}
    >
      {renderGrid().flat().map((cell, idx) => (
        <div key={idx} className={`cell ${cell}`}></div>
      ))}
    </div>
  );
}

export default GameBoard;
