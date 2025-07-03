import React, { useState, useEffect } from "react";
import "./App.css";

// Custom colors from requirements
const COLORS = {
  primary: "#1976d2",
  secondary: "#424242",
  accent: "#ffd600",
  bg: "#fff",
  boardBg: "#f8f9fa",
  boardShadow: "0 4px 32px rgba(25, 118, 210, 0.07)",
  winGlow: "#ffd60033",
  draw: "#e0e0e0"
};

const PLAYERS = [
  { name: "Player 1", symbol: "X", color: COLORS.primary },
  { name: "Player 2", symbol: "O", color: COLORS.accent }
];

// PUBLIC_INTERFACE
function App() {
  // Game state
  const [board, setBoard] = useState(Array(9).fill(""));
  const [current, setCurrent] = useState(0); // 0 or 1 for PLAYERS
  const [history, setHistory] = useState([]); // For subtle anim/hint
  const [winnerInfo, setWinnerInfo] = useState(null); // {winner: 0|1, line: [idx, idx, idx]}
  const [isDraw, setIsDraw] = useState(false);

  // PUBLIC_INTERFACE
  // Check board for a winner or draw (returns winner info or null)
  const checkWin = (brd) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (
        brd[a] &&
        brd[a] === brd[b] &&
        brd[a] === brd[c]
      ) {
        return { winner: brd[a] === "X" ? 0 : 1, line };
      }
    }
    return null;
  };

  // PUBLIC_INTERFACE
  // Handle a click on square (i)
  const handleSquareClick = (i) => {
    if (board[i] || winnerInfo) return;
    const newBoard = [...board];
    newBoard[i] = PLAYERS[current].symbol;
    setBoard(newBoard);
    setHistory([...history, i]);
    // Next turn handled in useEffect after result checked
  };

  // PUBLIC_INTERFACE
  // Reset the game to initial state
  const handleReset = () => {
    setBoard(Array(9).fill(""));
    setCurrent(0);
    setWinnerInfo(null);
    setHistory([]);
    setIsDraw(false);
  };

  // Game over checks on board update
  useEffect(() => {
    const win = checkWin(board);
    if (win) {
      setWinnerInfo(win);
      setIsDraw(false);
    } else if (board.every((sq) => sq)) {
      setWinnerInfo(null);
      setIsDraw(true);
    } else {
      // Only switch turns if not game over
      setCurrent((c) => 1 - c);
      setWinnerInfo(null);
      setIsDraw(false);
    }
    // eslint-disable-next-line
  }, [board]);

  // Score calculation for fun (could enhance by tracking real game scores)
  // For this UI, only relevant for current round outcome

  // UI Components
  // PUBLIC_INTERFACE
  function Board({ board, onClick, winLine, lastMove }) {
    return (
      <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
        {board.map((cell, idx) => {
          let cellStyle = {};
          let animate = "";

          if (winLine && winLine.includes(idx)) {
            cellStyle.background = COLORS.winGlow;
            cellStyle.boxShadow = `0 0 12px 4px ${COLORS.accent}`;
            cellStyle.transform = "scale(1.08)";
            animate = "win-pop";
          } else if (lastMove === idx) {
            animate = "pop";
          }
          return (
            <button
              className={`ttt-square ${animate ? animate : ""}`}
              key={idx}
              style={cell ? { color: cell === "X" ? COLORS.primary : COLORS.accent, ...cellStyle } : { ...cellStyle }}
              onClick={() => onClick(idx)}
              aria-label={`cell ${Math.floor(idx/3)+1},${(idx%3)+1}`}
              tabIndex={cell || winLine ? -1 : 0}
              disabled={!!cell || !!winLine}
            >
              <span className="ttt-symbol">{cell}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // PUBLIC_INTERFACE
  function Scoreboard() {
    return (
      <div className="ttt-scoreboard">
        <span className="score player-x" style={{ color: COLORS.primary }}>X</span>
        <span className="score-divider">vs</span>
        <span className="score player-o" style={{ color: COLORS.accent }}>O</span>
      </div>
    );
  }

  // PUBLIC_INTERFACE
  function StatusBar() {
    let msg = "";
    let color = COLORS.secondary;
    if (winnerInfo) {
      msg = `${PLAYERS[winnerInfo.winner].name} wins!`;
      color = PLAYERS[winnerInfo.winner].color;
    } else if (isDraw) {
      msg = "It's a Draw!";
      color = COLORS.secondary;
    } else {
      msg = `${PLAYERS[current].name}'s turn (${PLAYERS[current].symbol})`;
      color = PLAYERS[current].color;
    }
    return (
      <div className="ttt-status" style={{ color }}>
        {msg}
      </div>
    );
  }

  return (
    <div className="ttt-app" style={{ background: COLORS.bg }}>
      <main className="ttt-main">
        <Scoreboard />
        <StatusBar />
        <Board
          board={board}
          onClick={handleSquareClick}
          winLine={winnerInfo ? winnerInfo.line : null}
          lastMove={history.length ? history[history.length-1] : null}
        />
        <div className="ttt-controls">
          <button className="ttt-btn ttt-btn-reset" onClick={handleReset}>
            Reset Game
          </button>
        </div>
        <footer className="ttt-footer" style={{ color: COLORS.secondary }}>
          Tic Tac Toe &mdash; Modern React &bull; 2 Players
        </footer>
      </main>
    </div>
  );
}

export default App;
