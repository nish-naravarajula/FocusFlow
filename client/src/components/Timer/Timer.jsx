import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { api } from "../../api/client";
import "./Timer.css";

const DURATION_OPTIONS = [5, 10, 15, 20, 25, 30, 45, 60];
const MAX_LABEL = 50;

const Timer = ({ onSessionComplete }) => {
  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [label, setLabel] = useState("");
  const [sessionType, setSessionType] = useState("work");
  const intervalRef = useRef(null);

  const playSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [0, 0.3, 0.6].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 800;
        osc.type = "sine";
        gain.gain.setValueAtTime(0.3, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(
          0.01,
          ctx.currentTime + delay + 0.2
        );
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.2);
      });
    } catch {
      /* audio not supported, silently ignore */
    }
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      handleSessionComplete();
    }
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, timeLeft]);

  const handleSessionComplete = async () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    playSound();

    try {
      const session = await api.createSession({
        duration,
        label: label || "Focus Session",
        type: sessionType,
      });
      onSessionComplete(session);
    } catch (error) {
      console.error("Failed to save session:", error);
    }

    resetTimer();
  };

  const startTimer = () => setIsRunning(true);

  const pauseTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };

  const resetTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    setTimeLeft(duration * 60);
  };

  const handleDurationChange = (newDuration) => {
    const d = Number(newDuration);
    setDuration(d);
    if (!isRunning) setTimeLeft(d * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <section className="timer-container" aria-labelledby="timer-heading">
      <h2 id="timer-heading" className="sr-only">
        Focus Timer
      </h2>

      <div
        className="timer-type-toggle"
        role="radiogroup"
        aria-label="Session type"
      >
        <button
          type="button"
          className={sessionType === "work" ? "active" : ""}
          onClick={() => setSessionType("work")}
          role="radio"
          aria-checked={sessionType === "work"}
        >
          Work
        </button>
        <button
          type="button"
          className={sessionType === "break" ? "active" : ""}
          onClick={() => setSessionType("break")}
          role="radio"
          aria-checked={sessionType === "break"}
        >
          Break
        </button>
      </div>

      <div
        className="timer-display"
        role="timer"
        aria-live="polite"
        aria-atomic="true"
        aria-label={`${Math.floor(timeLeft / 60)} minutes ${
          timeLeft % 60
        } seconds remaining`}
      >
        {formatTime(timeLeft)}
      </div>

      <div className="timer-label">
        <label htmlFor="timer-label-input" className="sr-only">
          What are you working on?
        </label>
        <input
          id="timer-label-input"
          type="text"
          placeholder="What are you working on?"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          maxLength={MAX_LABEL}
        />
      </div>

      <div className="timer-duration">
        <label htmlFor="timer-duration-select">Duration</label>
        <select
          id="timer-duration-select"
          value={duration}
          onChange={(e) => handleDurationChange(e.target.value)}
          disabled={isRunning}
        >
          {DURATION_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n} minutes
            </option>
          ))}
        </select>
      </div>

      <div className="timer-controls">
        {!isRunning ? (
          <button
            type="button"
            className="timer-btn timer-btn-start"
            onClick={startTimer}
          >
            Start
          </button>
        ) : (
          <button
            type="button"
            className="timer-btn timer-btn-pause"
            onClick={pauseTimer}
          >
            Pause
          </button>
        )}
        <button
          type="button"
          className="timer-btn timer-btn-reset"
          onClick={resetTimer}
        >
          Reset
        </button>
      </div>
    </section>
  );
};

Timer.propTypes = {
  onSessionComplete: PropTypes.func.isRequired,
};

export default Timer;
