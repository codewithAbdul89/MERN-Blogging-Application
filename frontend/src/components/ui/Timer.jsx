import { useEffect, useState } from "react";

const Timer = ({
  initialTime = 60,
  resetKey = 0,
  onTimeChange,
}) => {
  const [timeLeft, setTimeLeft] = useState(0);

  // Start / reset timer
  useEffect(() => {
    if (resetKey === 0) {
      setTimeLeft(0);
      return;
    }

    setTimeLeft(initialTime);
  }, [resetKey, initialTime]);

  // Send current time to parent
  useEffect(() => {
    onTimeChange?.(timeLeft);
  }, [timeLeft, onTimeChange]);

  // Countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  return null;
};

export default Timer;