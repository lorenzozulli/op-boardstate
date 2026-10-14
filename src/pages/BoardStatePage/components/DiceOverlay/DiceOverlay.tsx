import { IconIcosahedron, IconX } from '@tabler/icons-react';
import { DICE_SIDES } from './hooks/useDiceOverlay';
import type { Dice } from './hooks/useDiceOverlay';
import './style.css';

export function DiceOverlay({ dice }: { dice: Dice }) {
  const { t } = dice;
  return (
    <div className="overlay" onClick={dice.close}>
      <div className="dice-panel" onClick={(e) => e.stopPropagation()}>
        <div className="dice-sides">
          {DICE_SIDES.map((n) => (
            <button
              key={n}
              className={`toolbar-button ${dice.sides === n ? 'active' : ''}`}
              onClick={() => dice.setSides(n)}
            >
              {t('dice_overlay.dice_type', { n })}
            </button>
          ))}
          <button className="toolbar-button" onClick={dice.close}><IconX /></button>
        </div>
        <button className="dice-value" onClick={() => dice.roll()}>
          {dice.value === null ? <IconIcosahedron /> : dice.value}
        </button>
        <div className="dice-hint">{t('dice_overlay.retry')}</div>
      </div>
    </div>
  );
}
