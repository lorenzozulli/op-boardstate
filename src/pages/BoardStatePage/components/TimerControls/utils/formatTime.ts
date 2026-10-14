export const formatTime = (seconds: number): string => {
  const s = Math.ceil(seconds);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};
