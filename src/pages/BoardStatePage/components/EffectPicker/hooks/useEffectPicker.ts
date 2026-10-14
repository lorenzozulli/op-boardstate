import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Board } from '../../../hooks/useBoardStatePage';
import type { CardId } from '../../../types';

export const KEYWORDS = ['Rush', 'Blocker', 'Double Attack', 'Banish', 'Unblockable'];
export const STATUSES = ['Can\'t Attack', 'Can\'t Block', 'Can\'t be K.O.\'d', 'Can\'t be rested', 'Black Hole', 'Can\'t play Characters'];

export function useEffectPicker(board: Board, id: CardId) {
  const { t } = useTranslation('effectpicker');
  const [custom, setCustom] = useState('');

  const submitCustom = () => {
    const label = custom.trim();
    if (label) board.addTag(id, 'status', label);
  };

  return { t, custom, setCustom, submitCustom };
}
