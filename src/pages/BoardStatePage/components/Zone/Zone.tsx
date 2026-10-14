import { IconArrowsDownUp } from '@tabler/icons-react';
import type { Board } from '../../hooks/useBoardStatePage';
import type { CardId, ZoneField } from '../../types';
import { formatZone, zoneClass } from './utils/formatZone';
import './style.css';

interface ZoneProps {
  board: Board;
  id: CardId;
  field: ZoneField;
  label: string;
  value: number;
}

export function Zone({ board, id, field, label, value }: ZoneProps) {
  return (
    <div
      className={`zone ${board.isZoneActive(id, field) ? 'active' : ''}`}
      {...board.zoneHandlers(id, field)}
    >
      <div className="zone-label">{label}</div>
      <div className={`zone-value ${zoneClass(field, value)}`}>{formatZone(field, value)}</div>
      <div className="zone-swipe-hint"><IconArrowsDownUp /></div>
    </div>
  );
}
