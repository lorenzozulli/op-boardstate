import { useState } from 'react';
import { vibrate } from '../../../utils/vibrate';
import { useTranslation } from 'react-i18next';

export type CoinSide = 'heads' | 'tails';

const FULL_TURNS_PER_FLIP = 5;

const randomSide = (): CoinSide => (Math.random() < 0.5 ? 'heads' : 'tails');

const landingRotation = (side: CoinSide): number =>
  FULL_TURNS_PER_FLIP * 360 + (side === 'tails' ? 180 : 0);

export function useCoinOverlay() {
  const { t } = useTranslation('coinoverlay');
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<CoinSide>('heads');
  const [flipCount, setFlipCount] = useState(0);
  const [flipping, setFlipping] = useState(false);

  const flip = () => {
    if (flipping) return;
    setFlipping(true);
    setSide(randomSide());
    setFlipCount((count) => count + 1);
  };

  const finishFlip = () => {
    setFlipping(false);
    vibrate(15);
  };

  const openCoin = () => {
    setOpen(true);
    flip();
  };

  const close = () => setOpen(false);

  return { t, open, side, flipCount, rotation: landingRotation(side), openCoin, close, flip, finishFlip };
}

export type Coin = ReturnType<typeof useCoinOverlay>;
