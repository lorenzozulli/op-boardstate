import { IconX } from '@tabler/icons-react';
import type { Coin } from './hooks/useCoinOverlay';
import './style.css';

export function CoinOverlay({ coin }: { coin: Coin }) {
  const { t } = coin;
  return (
    <div className="overlay" onClick={coin.close}>
      <div className="coin-panel" onClick={(e) => e.stopPropagation()}>
        <div className="coin-actions">
          <button className="toolbar-button" onClick={coin.close}><IconX /></button>
        </div>
        <button className="coin" onClick={coin.flip}>
          <div key={coin.flipCount} className={`coin-body ${coin.side}`} onAnimationEnd={coin.finishFlip}>
            <span className="coin-face heads">{t('coin_overlay.heads')}</span>
            <span className="coin-face tails">{t('coin_overlay.tails')}</span>
          </div>
        </button>
        <div className="coin-hint">{t('coin_overlay.retry')}</div>
      </div>
    </div>
  );
}
