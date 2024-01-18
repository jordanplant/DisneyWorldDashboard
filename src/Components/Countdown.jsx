// import { Outlet } from "react-router-dom";
import React, { useEffect } from "react";
import "./Countdown.css";

function Countdown() {
  useEffect(() => {
    const countdownElement = document.querySelector(".countdownDays");
    const countdownDays = calculateCountdown();
    countdownElement.textContent = countdownDays;
  }, []);

  function calculateCountdown() {
    const disneyday = new Date(2024, 5, 2);
    const today = new Date();
    const countdown = Math.max(0, disneyday.getTime() - today.getTime()); // Ensure countdown is non-negative
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    return Math.floor(countdown / millisecondsPerDay);
  }

  return (
    <>
      <div className="countdown-bar">
        <p className="countdownDays"></p>
      </div>
    </>
  );
}

export default Countdown;
