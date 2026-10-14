import { useCallback, useEffect, useRef, useState } from 'react';
import { vibrate } from '../../../utils/vibrate';
import { useTranslation } from 'react-i18next';

export const DICE_SIDES = [4, 6, 8, 10, 12, 20, 100] as const;

export function useDiceOverlay() {
  const { t } = useTranslation('diceoverlay');
  const [open, setOpen] = useState(false);
  const [sides, setSidesState] = useState<number>(6);
  const [value, setValue] = useState<number | null>(null);

  const sidesRef = useRef(sides);
  const rolling = useRef(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    [],
  );

  const roll = useCallback((s: number = sidesRef.current) => {
    if (rolling.current) return;
    rolling.current = true;
    let ticks = 0;
    timer.current = setInterval(() => {
      setValue(1 + Math.floor(Math.random() * s));
      if (++ticks >= 8) {
        if (timer.current) clearInterval(timer.current);
        rolling.current = false;
        vibrate(15);
      }
    }, 60);
  }, []);

  const openDice = () => {
    setOpen(true);
    setValue(null);
    roll();
  };

  const close = () => setOpen(false);

  const setSides = (n: number) => {
    sidesRef.current = n;
    setSidesState(n);
    roll(n);
  };

  return { t, open, sides, value, openDice, close, setSides, roll };
}

export type Dice = ReturnType<typeof useDiceOverlay>;
