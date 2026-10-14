import { IconMinus, IconPlus, IconCheck, IconPlayerPauseFilled, IconPlayerPlayFilled, IconRotate, IconSettings } from "@tabler/icons-react";
import { formatTime } from "./utils/formatTime";
import { useTimer } from "./hooks/useTimerControls";
import "./style.css";

export function TimerControls() {
  const timer = useTimer();

  if (timer.setting) {
    return (
      <div className="control-group">
        <button className="toolbar-button" onClick={() => timer.adjust(-5)}><IconMinus /></button>
        <b>{timer.t('timer_controls.minutes', { count: timer.durationMin })}</b>
        <button className="toolbar-button" onClick={() => timer.adjust(5)}><IconPlus /></button>
        <button className="toolbar-button active" onClick={timer.toggleSetting}><IconCheck /></button>
      </div>
    );
  }

  const state = timer.isOver ? 'time-over' : timer.isLow ? 'time-low' : '';
  return (
    <div className={`control-group ${state}`}>
      <button className="timer-display" onClick={timer.toggle}>{formatTime(timer.left)}</button>
      <button className="toolbar-button" onClick={timer.toggle}>{timer.running ? <IconPlayerPauseFilled /> : <IconPlayerPlayFilled />}</button>
      <button className="toolbar-button" onClick={timer.reset}><IconRotate /></button>
      <button className="toolbar-button" onClick={timer.toggleSetting}><IconSettings /></button>
    </div>
  );
}
