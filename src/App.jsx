import React, { useState } from "react";
import GameBoard from "./GameBoard";
import "./assets/styles/style.css";

function App() {
  const [gameState, setGameState] = useState("menu");
  const [difficulty, setDifficulty] = useState("Easy");
  const [mode, setMode] = useState("Dark");
  const [lastScore, setLastScore] = useState(0);
  const [selectDifficulty, setSelectDifficulty] = useState(false);

  const getHighscores = () => {
    const data = localStorage.getItem("snakeHighscores");
    return data ? JSON.parse(data) : [];
  };

  const saveHighscore = (score, difficulty) => {
    const highscores = getHighscores();
    highscores.push({
      score,
      difficulty,
      date: new Date().toLocaleDateString(),
    });

    // Skorları büyükten küçüğe sırala
    highscores.sort((a, b) => b.score - a.score);

    // Yalnızca ilk 5 kaydı tut
    const topFive = highscores.slice(0, 5);

    localStorage.setItem("snakeHighscores", JSON.stringify(topFive));
  };

  const handleGameOver = (score) => {
    setLastScore(score);
    saveHighscore(score, difficulty);
    setGameState("gameover");
    setSelectDifficulty(false);
  };

  const displayHighscores = () => {
    const highscores = getHighscores();
    if (highscores.length === 0) return <p>No highscores yet!</p>;
    return highscores.map((item, idx) => (
      <div key={idx}>
        {idx + 1}. {item.difficulty} - {item.score} pts ({item.date})
      </div>
    ));
  };

  return (
    <div className={`app-container ${mode === "Light" ? "light-mode" : "dark-mode"}`}>
      <div className="mode-switch">
        <label className="switch">
          <input
            type="checkbox"
            checked={mode === "Light"}
            onChange={() => setMode(mode === "Light" ? "Dark" : "Light")}
          />
          <span className="slider"></span>
        </label>
      </div>

      <div className={`app-title ${mode === "Light" ? "light-title" : "dark-title"}`}>
        🐍 Snake Game
      </div>

      {gameState === "menu" && !selectDifficulty && (
        <div className="menu">
          <button
            className="menu-button"
            onClick={() => setSelectDifficulty(true)}
          >
            Start Game
          </button>
          <button
            className="menu-button"
            onClick={() => setGameState("highscores")}
          >
            Highscores
          </button>
        </div>
      )}

      {selectDifficulty && gameState === "menu" && (
        <div className="menu">
          <p>Select Difficulty:</p>
          <button
            className="menu-button"
            onClick={() => {
              setDifficulty("Easy");
              setGameState("playing");
            }}
          >
            Easy
          </button>
          <button
            className="menu-button"
            onClick={() => {
              setDifficulty("Normal");
              setGameState("playing");
            }}
          >
            Normal
          </button>
          <button
            className="menu-button"
            onClick={() => {
              setDifficulty("Hard");
              setGameState("playing");
            }}
          >
            Hard
          </button>
        </div>
      )}

      {gameState === "playing" && (
        <div className="game-container">
          <GameBoard
            isPlaying={true}
            setGameState={handleGameOver}
            difficulty={difficulty}
          />
        </div>
      )}

      {gameState === "gameover" && (
        <div className="menu">
          <h2>Game Over!</h2>
          <p>
            Your Score: {lastScore} ({difficulty})
          </p>
          <div className="gameover-buttons">
            <button
              className="menu-button"
              onClick={() => {
                setSelectDifficulty(true);
                setGameState("menu");
              }}
            >
              Restart Game
            </button>
            <button
              className="menu-button"
              onClick={() => {
                setSelectDifficulty(false);
                setGameState("menu");
              }}
            >
              Main Menu
            </button>
            <button
              className="menu-button"
              onClick={() => setGameState("highscores")}
            >
              Highscores
            </button>
          </div>
        </div>
      )}

      {gameState === "highscores" && (
        <div className="highscores-container menu">
          <h2>Highscores</h2>
          {displayHighscores()}
          <button
            className="menu-button"
            onClick={() => {
              setSelectDifficulty(false);
              setGameState("menu");
            }}
          >
            Back to Menu
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
