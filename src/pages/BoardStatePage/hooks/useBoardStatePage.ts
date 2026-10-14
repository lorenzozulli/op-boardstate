import { useCallback, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import type { CardData, CardId, Tag, TagKind, ZoneField } from '../types';
import { vibrate } from '../utils/vibrate';

export const LEADER_ID: CardId = 'L';
export const MAX_CHARS = 5;

const STEP: Record<ZoneField, number> = { bonus: 1000, cost: 1, life: 1 };
const SWIPE_PX_PER_STEP = 22;
const SWIPE_TAP_THRESHOLD = 8;

const newCard = (name: string): CardData => ({
  name,
  bonus: 0,
  cost: 0,
  life: 5,
  used: false,
  tags: [],
});

interface Gesture {
  id: CardId;
  field: ZoneField;
  startY: number;
  startValue: number;
  steps: number;
  moved: boolean;
}

export function useBoard() {
  const [cards, setCards] = useState<Record<CardId, CardData>>({
    [LEADER_ID]: newCard('Leader'),
  });
  const [chars, setChars] = useState<CardId[]>([]);
  const [adding, setAdding] = useState<CardId | null>(null);
  const [activeZone, setActiveZone] = useState<string | null>(null);

  const counters = useRef({ id: 1, char: 1, tag: 1 });
  const gesture = useRef<Gesture | null>(null);

  const patchCard = useCallback((id: CardId, fn: (c: CardData) => CardData) => {
    setCards((prev) => (prev[id] ? { ...prev, [id]: fn(prev[id]) } : prev));
  }, []);

  const setZoneValue = useCallback(
    (id: CardId, field: ZoneField, value: number) => {
      const v = field === 'life' ? Math.max(0, value) : value;
      patchCard(id, (c) => ({ ...c, [field]: v }));
    },
    [patchCard],
  );

  /* Personaggi */
  const canAddChar = chars.length < MAX_CHARS;

  const addChar = () => {
    if (!canAddChar) return;
    const id = `c${counters.current.id++}`;
    const name = `${'Character'}`;
    setCards((prev) => ({ ...prev, [id]: newCard(name) }));
    setChars((prev) => [...prev, id]);
    setAdding(null);
  };

  const removeChar = (id: CardId) => {
    setCards((prev: Record<CardId, CardData>) => {
      const next: Record<CardId, CardData> = { ...prev };
      delete next[id];
      return next;
    });
    setChars((prev) => prev.filter((x) => x !== id));
    setAdding((prev) => (prev === id ? null : prev));
  };

  /** Rinomina; un nome vuoto mantiene quello precedente. Ritorna il nome applicato. */
  const rename = (id: CardId, value: string): string => {
    const next = value.trim() || cards[id].name;
    patchCard(id, (c) => ({ ...c, name: next }));
    return next;
  };

  /* Effetti */
  const addTag = (id: CardId, kind: TagKind, label: string) => {
    const tag: Tag = { id: counters.current.tag++, kind, label };
    patchCard(id, (c) => ({ ...c, tags: [...c.tags, tag] }));
    setAdding(null);
  };

  const removeTag = (id: CardId, tagId: number) =>
    patchCard(id, (c) => ({ ...c, tags: c.tags.filter((t) => t.id !== tagId) }));

  const toggleUsed = (id: CardId) => patchCard(id, (c) => ({ ...c, used: !c.used }));

  /* Swipe verticale sui riquadri Power / Costo / Vita */
  const endGesture = () => {
    const g = gesture.current;
    if (!g) return;
    gesture.current = null;
    setActiveZone(null);
    // tap senza trascinamento: azzera (la vita non si azzera col tap)
    if (!g.moved && g.field !== 'life') setZoneValue(g.id, g.field, 0);
  };

  const zoneHandlers = (id: CardId, field: ZoneField) => ({
    onPointerDown: (e: PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      gesture.current = {
        id,
        field,
        startY: e.clientY,
        startValue: cards[id][field],
        steps: 0,
        moved: false,
      };
      setActiveZone(`${id}:${field}`);
    },
    onPointerMove: (e: PointerEvent<HTMLDivElement>) => {
      const g = gesture.current;
      if (!g) return;
      const dy = g.startY - e.clientY;
      if (Math.abs(dy) > SWIPE_TAP_THRESHOLD) g.moved = true;
      const steps = Math.trunc(dy / SWIPE_PX_PER_STEP);
      if (steps === g.steps) return;
      g.steps = steps;
      setZoneValue(g.id, g.field, g.startValue + steps * STEP[g.field]);
      vibrate(8);
    },
    onPointerUp: endGesture,
    onPointerCancel: endGesture,
  });

  const isZoneActive = (id: CardId, field: ZoneField) => activeZone === `${id}:${field}`;

  return {
    cards,
    chars,
    adding,
    setAdding,
    canAddChar,
    addChar,
    removeChar,
    rename,
    addTag,
    removeTag,
    toggleUsed,
    zoneHandlers,
    isZoneActive,
  };
}

export type Board = ReturnType<typeof useBoard>;
