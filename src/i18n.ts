import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enCoinOverlay from './locales/en/coinoverlay.json';
import enColumn from './locales/en/column.json';
import enDiceOverlay from './locales/en/diceoverlay.json';
import enEffectPicker from './locales/en/effectpicker.json';
import enGame from './locales/en/game.json';
import enLeaderColorPicker from './locales/en/leadercolorpicker.json';
import enTimerControls from './locales/en/timercontrols.json';

i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    ns: ['coinoverlay', 'column', 'diceoverlay', 'effectpicker', 'game', 'leadercolorpicker', 'timercontrols'],
    resources: {
      en: {
        coinoverlay: enCoinOverlay,
        column: enColumn,
        diceoverlay: enDiceOverlay,
        effectpicker: enEffectPicker,
        game: enGame,
        leadercolorpicker: enLeaderColorPicker,
        timercontrols: enTimerControls,
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
