import React, { useState } from "react";
import styles from "./SnacksList.module.css";

const Rating = ({ snack, onSubmit, onSkip }) => {
  const [rating, setRating] = useState(null);

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleSubmit = () => {
    onSubmit(snack.id, rating, snack.title, snack.price, snack.location);
  };

  const handleSkip = () => {
    onSkip(snack.id);
  };

  return (
    <div className={styles.ratingContainer}>
      <div className={styles.ratingLeft}>
        <p>Rate this snack:</p>
        <div className={styles.stars}>
          {[1, 2, 3, 4, 5].map((value) => (
            <i
              key={value}
              className={`fa-star fa-xl ${
                rating >= value ? "fa-solid" : "fa-regular"
              }`}
              onClick={() => handleStarClick(value)}
            ></i>
          ))}
        </div>
      </div>
      <div className={styles.ratingRight}>
        <button onClick={handleSubmit} className={styles.submitButton}>
          Submit
        </button>
        <button onClick={handleSkip} className={styles.skipButton}>
          Skip
        </button>
      </div>
    </div>
  );
};

export default Rating;
