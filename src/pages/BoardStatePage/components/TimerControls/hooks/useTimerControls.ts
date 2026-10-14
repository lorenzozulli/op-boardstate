import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { vibrate } from "../../../utils/vibrate";

const DEFAULT_TIMER_MIN = 50;
const MIN_TIMER_MIN = 5;
const MAX_TIMER_MIN = 180;
const LOW_TIME_SECONDS = 60;

export function useTimer() {
  const { t } = useTranslation('timercontrols');
  const [duration, setDuration] = useState(DEFAULT_TIMER_MIN * 60);
  const [left, setLeft] = useState(DEFAULT_TIMER_MIN * 60);
  const [running, setRunning] = useState(false);
  const [setting, setSetting] = useState(false);

  // Conteggio basato sull'orologio del dispositivo, non sul numero di tick
  useEffect(() => {
    if (!running) return;
    let last = Date.now();
    const timer = setInterval(() => {
      const now = Date.now();
      const dt = (now - last) / 1000;
      last = now;
      setLeft((l) => Math.max(0, l - dt));
    }, 250);
    return () => clearInterval(timer);
  }, [running]);

  // Fine tempo
  useEffect(() => {
    const resetTimer = () => {
      if (running && left <= 0) {
        setRunning(false);
        vibrate([200, 100, 200]);
      }
    }

    resetTimer();
  }, [running, left]);

  const toggle = () => {
    if (left > 0) setRunning((r) => !r);
  };

  const reset = () => {
    setRunning(false);
    setLeft(duration);
  };

  const toggleSetting = () => {
    setRunning(false);
    setSetting((s) => !s);
  };

  /** Cambia la durata in minuti (passi di 5) e riporta il timer a inizio. */
  const adjust = (deltaMin: number) => {
    const m = Math.max(MIN_TIMER_MIN, Math.min(MAX_TIMER_MIN, duration / 60 + deltaMin));
    setDuration(m * 60);
    setLeft(m * 60);
  };

  return {
    t,
    left,
    running,
    setting,
    durationMin: duration / 60,
    isLow: left > 0 && left <= LOW_TIME_SECONDS,
    isOver: left <= 0,
    toggle,
    reset,
    toggleSetting,
    adjust,
  };
}
