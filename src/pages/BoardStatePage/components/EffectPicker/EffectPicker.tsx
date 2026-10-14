import { IconPlus } from '@tabler/icons-react';
import type { Board } from '../../hooks/useBoardStatePage';
import type { CardId } from '../../types';
import { KEYWORDS, STATUSES, useEffectPicker } from './hooks/useEffectPicker';
import './style.css';

export function EffectPicker({ board, id }: { board: Board; id: CardId }) {
  const { t, custom, setCustom, submitCustom } = useEffectPicker(board, id);

  return (
    <div className="effect-list">
      <div className="effect-section-label">{t('effect_picker.keyword_label')}</div>
      {KEYWORDS.map((k) => (
        <button key={k} className="effect-option" onClick={() => board.addTag(id, 'keyword', k)}>{k}</button>
      ))}
      <div className="effect-section-label">{t('effect_picker.status_label')}</div>
      {STATUSES.map((s) => (
        <button key={s} className="effect-option" onClick={() => board.addTag(id, 'status', s)}>{s}</button>
      ))}
      <div className="custom-effect">
        <input
          placeholder={t('effect_picker.custom_placeholder')}
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submitCustom()}
        />
        <button onClick={submitCustom}><IconPlus /></button>
      </div>
      <button className="effect-list-button" onClick={() => board.setAdding(null)}>{t('effect_picker.close_button')}</button>
    </div>
  );
}
