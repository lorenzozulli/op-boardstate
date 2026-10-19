import { IconCheckbox, IconGripHorizontal, IconPlus, IconSquare, IconX } from '@tabler/icons-react';
import type { Board } from '../../hooks/useBoardStatePage';
import { LEADER_ID } from '../../hooks/useBoardStatePage';
import type { CardData, CardId } from '../../types';
import type { CharacterDrag } from '../Game/hooks/useCharacterDrag';
import { EffectPicker } from '../EffectPicker/EffectPicker';
import { Zone } from '../Zone/Zone';
import './style.css';
import { useColumn } from './hooks/useColumn';

interface ColumnProps {
  board: Board;
  characterDrag: CharacterDrag;
  id: CardId;
  card: CardData;
}

export function Column({ board, characterDrag, id, card }: ColumnProps) {
  const isLeader = id === LEADER_ID;

  const { t } = useColumn();

  return (

    <div
      ref={isLeader ? undefined : characterDrag.registerColumn(id)}
      className={`card-column ${isLeader ? 'leader' : ''} ${characterDrag.isDragging(id) ? 'dragging' : ''}`}
    >
      {
        board.adding === id ? (
          <></>
        ) : (
          <>
            {isLeader ? (
              <div className="card-role leader">{t('column.leader_label')}</div>
            ) : (
              <div className="card-role drag-handle" {...characterDrag.handleHandlers(id)}>
                <IconGripHorizontal size={12} />{t('column.character_label')}
              </div>
            )}

            <div className="card-header">
              <input
                defaultValue={card.name}
                onBlur={(e) => {
                  e.target.value = board.rename(id, e.target.value);
                }}
              />
              {!isLeader && (
                  <button className="knock-out-button" onClick={() => board.removeChar(id)}>{t('column.ko_button')}</button>
              )}
            </div>

            <div className="zones">
                <Zone board={board} id={id} field="bonus" label={`${t('column.power_label')}`} value={card.bonus} />
              {isLeader ? (
                <Zone board={board} id={id} field="life" label={`${t('column.life_label')}`} value={card.life} />
              ) : (
                <Zone board={board} id={id} field="cost" label={`${t('column.cost_label')}`} value={card.cost} />
              )}
            </div>

            <button
              className={`ability-used-button ${card.used ? 'active' : ''}`}
              onClick={() => board.toggleUsed(id)}
            >
              {card.used ? <IconCheckbox /> : <IconSquare />}{t('column.ability_used')}
            </button>
          </>
        )}
      {board.adding === id ? (
        <EffectPicker board={board} id={id} />
      ) : (
        <div className="effect-list">
          {card.tags.map((t) => (
            <button
              key={t.id}
              className={`effect-chip ${t.kind}`}
              onClick={() => board.removeTag(id, t.id)}
            >
              <span>{t.label}</span>
              <i><IconX /></i>
            </button>
          ))}
            <button className="effect-list-button" onClick={() => board.setAdding(id)}><IconPlus />{t('column.effect_status')}</button>
        </div>
      )}
    </div>
  );
}
