import { useEffect, useRef } from 'react';
import { IconContrastFilled, IconDice6Filled, IconPaletteFilled, IconPlus, IconRotate } from '@tabler/icons-react';
import { LEADER_ID, useBoard } from '../../hooks/useBoardStatePage';
import type { CardId } from '../../types';
import { CoinOverlay } from '../CoinOverlay/CoinOverlay';
import { useCoinOverlay } from '../CoinOverlay/hooks/useCoinOverlay';
import { Column } from '../Column/Column';
import { DiceOverlay } from '../DiceOverlay/DiceOverlay';
import { useDiceOverlay } from '../DiceOverlay/hooks/useDiceOverlay';
import { LeaderColorPicker } from '../LeaderColorPicker/LeaderColorPicker';
import { useLeaderColors } from '../LeaderColorPicker/hooks/useLeaderColors';
import { TimerControls } from '../TimerControls/TimerControls';
import './style.css';
import { useCharacterDrag } from './hooks/useCharacterDrag';
import { useGame } from './hooks/useGame';

export function Game({ onReset }: { onReset: () => void }) {
  const board = useBoard();
  const dice = useDiceOverlay();
  const coin = useCoinOverlay();
  const leaderColors = useLeaderColors();
  const { t } = useGame();
  const cardsEl = useRef<HTMLDivElement>(null);
  const characterDrag = useCharacterDrag({ chars: board.chars, container: cardsEl, onReorder: board.reorderChars });

  // Quando aggiungo un personaggio scorro fino alla sua colonna
  const prevChars = useRef(board.chars.length);
  useEffect(() => {
    if (board.chars.length > prevChars.current && cardsEl.current) {
      cardsEl.current.scrollLeft = cardsEl.current.scrollWidth;
    }
    prevChars.current = board.chars.length;
  }, [board.chars.length]);

  return (
    <>
      <div id="rotate-hint"><IconRotate /> {t('game.rotate')}</div>

      <div id="app">
        <div className="top-bar">
          <TimerControls />
          <div className="control-group">
            <button className="toolbar-button" onClick={leaderColors.openPicker}><IconPaletteFilled /></button>
            <button className="toolbar-button" onClick={dice.openDice}><IconDice6Filled /></button>
            <button className="toolbar-button" onClick={coin.openCoin}><IconContrastFilled /></button>
            <button className="reset-button" onClick={onReset}>{t('game.reset')}</button>
          </div>
        </div>

        <div className={`cards ${characterDrag.isReordering ? 'reordering' : ''}`} ref={cardsEl}>
          <Column board={board} characterDrag={characterDrag} id={LEADER_ID} card={board.cards[LEADER_ID]} />
          {board.chars.map((id: CardId) => (
            <Column key={id} board={board} characterDrag={characterDrag} id={id} card={board.cards[id]} />
          ))}
          {board.canAddChar && (
            <button className="add-character-button" onClick={board.addChar}><IconPlus /></button>
          )}
        </div>

        {dice.open && <DiceOverlay dice={dice} />}
        {coin.open && <CoinOverlay coin={coin} />}
        {leaderColors.open && <LeaderColorPicker leaderColors={leaderColors} />}
      </div>
    </>
  );
}
