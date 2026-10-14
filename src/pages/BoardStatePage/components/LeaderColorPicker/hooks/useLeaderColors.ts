import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const LEADER_COLORS = ['red', 'green', 'blue', 'purple', 'black', 'yellow'] as const;
export const MAX_LEADER_COLORS = 2;

export type LeaderColor = (typeof LEADER_COLORS)[number];

const STORAGE_KEY = 'leaderColors';

const isLeaderColor = (value: unknown): value is LeaderColor =>
  LEADER_COLORS.includes(value as LeaderColor);

function loadLeaderColors(): LeaderColor[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(stored) ? stored.filter(isLeaderColor).slice(0, MAX_LEADER_COLORS) : [];
  } catch {
    return [];
  }
}

function saveLeaderColors(colors: LeaderColor[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
  } catch (error) {
    console.warn(error);
  }
}

function setRootAttribute(name: string, value: string | undefined) {
  const root = document.documentElement;
  if (value) root.setAttribute(name, value);
  else root.removeAttribute(name);
}

function applyLeaderColors([primary, secondary]: LeaderColor[]) {
  setRootAttribute('data-leader-primary', primary);
  setRootAttribute('data-leader-secondary', secondary);
}

export function useLeaderColors() {
  const [colors, setColors] = useState<LeaderColor[]>(loadLeaderColors);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation('leadercolorpicker');

  useLayoutEffect(() => {
    applyLeaderColors(colors);
    saveLeaderColors(colors);
  }, [colors]);

  const canSelectMore = colors.length < MAX_LEADER_COLORS;

  const toggleColor = (color: LeaderColor) =>
    setColors((current) => {
      if (current.includes(color)) return current.filter((selected) => selected !== color);
      return current.length < MAX_LEADER_COLORS ? [...current, color] : current;
    });

  const resetColors = () => setColors([]);
  const openPicker = () => setOpen(true);
  const closePicker = () => setOpen(false);

  const COLOR_NAMES: Record<LeaderColor, string> = {
    red: `${t('leader_color_picker.red')}`,
    green: `${t('leader_color_picker.green')}`,
    blue: `${t('leader_color_picker.blue')}`,
    purple: `${t('leader_color_picker.purple')}`,
    black: `${t('leader_color_picker.black')}`,
    yellow: `${t('leader_color_picker.yellow')}`,
  };

  return { t, colors, open, canSelectMore, toggleColor, resetColors, openPicker, closePicker, COLOR_NAMES };
}

export type LeaderColors = ReturnType<typeof useLeaderColors>;
