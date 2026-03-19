import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./Timer.css";

const Timer = ({ onSessionComplete }) => {
  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [label, setLabel] = useState("");
  const [sessionType, setSessionType] = useState("work");
  const intervalRef = useRef(null);

  // Play sound function
  const playSound = () => {
    const audioContext = new (
      window.AudioContext || window.webkitAudioContext
    )();

    // Play 3 beeps
    [0, 0.3, 0.6].forEach((delay) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + delay);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + delay + 0.2
      );

      oscillator.start(audioContext.currentTime + delay);
      oscillator.stop(audioContext.currentTime + delay + 0.2);
    });
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
  }, [isRunning, timeLeft]);

  const handleSessionComplete = async () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);

    // Play sound
    playSound();

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await fetch(
          "https://focusflow-vexk.onrender.com/api/sessions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              duration,
              label: label || "Focus Session",
              type: sessionType,
            }),
          }
        );

        if (res.ok) {
          const session = await res.json();
          onSessionComplete(session);
        }
      } catch (error) {
        console.error("Failed to save session:", error);
      }
    }

    resetTimer();
  };

  const startTimer = () => {
    setIsRunning(true);
  };

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
    setDuration(newDuration);
    if (!isRunning) {
      setTimeLeft(newDuration * 60);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="timer-container">
      <div className="timer-type-toggle">
        <button
          type="button"
          className={sessionType === "work" ? "active" : ""}
          onClick={() => setSessionType("work")}
        >
          Work
        </button>
        <button
          type="button"
          className={sessionType === "break" ? "active" : ""}
          onClick={() => setSessionType("break")}
        >
          Break
        </button>
      </div>

      <div className="timer-display">{formatTime(timeLeft)}</div>

      <div className="timer-label">
        <input
          type="text"
          placeholder="What are you working on?"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </div>

      <div className="timer-duration">
        <label htmlFor="duration">Duration (minutes):</label>
        <input
          type="number"
          id="duration"
          min="1"
          max="60"
          value={duration}
          onChange={(e) => handleDurationChange(Number(e.target.value))}
          disabled={isRunning}
        />
      </div>

      <div className="timer-controls">
        {!isRunning ? (
          <button type="button" className="start-btn" onClick={startTimer}>
            Start
          </button>
        ) : (
          <button type="button" className="pause-btn" onClick={pauseTimer}>
            Pause
          </button>
        )}
        <button type="button" className="reset-btn" onClick={resetTimer}>
          Reset
        </button>
      </div>
    </div>
  );
};

Timer.propTypes = {
  onSessionComplete: PropTypes.func.isRequired,
};

export default Timer;
