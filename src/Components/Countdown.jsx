import React, { useEffect, useState } from "react";
import "./Countdown.css";
const Countdown = ({ startDate, endDate }) => {
  const [countdownNumber, setCountdownNumber] = useState("");
  const [countdownMessage, setCountdownMessage] = useState("");

  useEffect(() => {
    const calculateDaysRemaining = () => {
      const today = new Date();
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (today < start) {
        // Trip hasn't started yet
        const daysUntilStart = Math.ceil(
          (start - today) / (1000 * 60 * 60 * 24)
        );
        setCountdownNumber(daysUntilStart);
        setCountdownMessage(daysUntilStart === 1 ? "day to go" : "days to go");
      } else if (today > end) {
        // Trip has ended
        setCountdownNumber("");
        setCountdownMessage("Your trip has ended.");
      } else {
        // Trip is ongoing
        const daysRemaining = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

        if (today.toDateString() === start.toDateString()) {
          // Show countdown number as 0 on the start day
          setCountdownNumber(0);
          setCountdownMessage("Today's the day!");
        } else if (daysRemaining === 0) {
          setCountdownNumber(0);
          setCountdownMessage("Last day of magic!");
        } else {
          setCountdownNumber(daysRemaining);
          setCountdownMessage(
            daysRemaining === 1 ? "Day of magic left" : "Days of magic left"
          );
        }
      }
    };

    calculateDaysRemaining(); // Initial calculation
    const interval = setInterval(calculateDaysRemaining, 1000 * 60 * 60); // Update every hour

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [startDate, endDate]); // Recalculate if startDate or endDate changes

  return (
    <div className="countdown-bar">
      <div className="countdownNumber">{countdownNumber}</div>
      <div className="countdownMessage">{countdownMessage}</div>
    </div>
  );
};

export default Countdown;
