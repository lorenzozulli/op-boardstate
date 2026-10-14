import { useState } from 'react';
import './style.css';
import { Game } from './components/Game/Game';

export function BoardStatePage() {
  const [gameNumber, setGameNumber] = useState(0);

  const startNewGame = () => setGameNumber((number) => number + 1);

  return <Game key={gameNumber} onReset={startNewGame} />;
}
