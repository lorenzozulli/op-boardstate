import { IconX } from '@tabler/icons-react';
import { LEADER_COLORS, MAX_LEADER_COLORS } from './hooks/useLeaderColors';
import type { LeaderColors } from './hooks/useLeaderColors';
import './style.css';

export function LeaderColorPicker({ leaderColors }: { leaderColors: LeaderColors }) {
  const { t, colors, canSelectMore, toggleColor, resetColors, closePicker, COLOR_NAMES } = leaderColors;

  return (
    <div className="overlay" onClick={closePicker}>
      <div className="color-picker" onClick={(e) => e.stopPropagation()}>
        <div className="color-picker-title">{t('leader_color_picker.leader_colors', { max_leader_colors: MAX_LEADER_COLORS })}</div>
        <div className="color-swatches">
          {LEADER_COLORS.map((color) => {
            const position = colors.indexOf(color);
            const isSelected = position >= 0;
            return (
              <button
                key={color}
                data-color={color}
                className={`color-swatch ${isSelected ? 'selected' : ''}`}
                disabled={!isSelected && !canSelectMore}
                onClick={() => toggleColor(color)}
              >
                <span className="color-dot">{isSelected && position + 1}</span>
                {COLOR_NAMES[color]}
              </button>
            );
          })}
        </div>
        <div className="color-picker-actions">
          <button className="toolbar-button" onClick={resetColors}>{t('leader_color_picker.default')}</button>
          <button className="toolbar-button active" onClick={closePicker}><IconX /></button>
        </div>
      </div>
    </div>
  );
}
