import { useEffect, useState } from "react";

const Timer = ({
  initialTime = 60,
  resetKey = 0,
  onTimeChange,
  onComplete,
}) => {
  const [timeLeft, setTimeLeft] = useState(0);

  // Start/reset timer whenever resetKey changes
  useEffect(() => {
    // Intially when no request is sending
    if (resetKey === 0) {
      setTimeLeft(0);
      onTimeChange?.(0);
      return;
    }

    setTimeLeft(initialTime);
    onTimeChange?.(initialTime);
  }, [resetKey, initialTime, onTimeChange]);

  // Countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const nextTime = prev - 1;

        if (nextTime <= 0) {
          onTimeChange?.(0);
          onComplete?.();
        } else {
          onTimeChange?.(nextTime);
        }

        return nextTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeChange, onComplete]);

  // Timer has no UI
  return null;
};

export default Timer;
