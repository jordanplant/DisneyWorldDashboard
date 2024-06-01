import React, { useState } from "react";
import styles from "./SnacksList.module.css";
import ButtonContainer from "./ButtonContainer";
import Rating from "./Rating"; // Import the Rating component

const Snacks = ({
  snacks,
  setSnacks,
  handleComplete,
  handleEdit,
  handleDelete,
  handleUndocomplete,
}) => {
  const [loadingSnackId, setLoadingSnackId] = useState(null);

  const handleShowRating = (id) => {
    const updatedSnacks = snacks.map((snack) =>
      snack.id === id ? { ...snack, isRating: true } : snack
    );
    setSnacks(updatedSnacks);
  };

  const handleCompleteWithRating = async (
    id,
    rating,
    title,
    price,
    location
  ) => {
    setLoadingSnackId(id);
    try {
      // Update JSON data with rating and mark as completed
      const response = await fetch(`/api/updateSnack`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          rating,
          completed: true,
          title,
          price,
          location,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update snack rating on the server.");
      }

      // Complete the snack locally
      const updatedSnacks = snacks.map((snack) =>
        snack.id === id
          ? { ...snack, rating, completed: true, isRating: false }
          : snack
      );
      setSnacks(updatedSnacks);
    } catch (error) {
      console.error("Failed to update snack rating:", error);
    } finally {
      setLoadingSnackId(null);
    }
  };

  const handleSkipRating = async (snack) => {
    const { id, title, price, location } = snack;
    await handleCompleteWithRating(id, null, title, price, location);
  };

  const handleDeleteWithLoading = async (id) => {
    setLoadingSnackId(id);
    await handleDelete(id);
    setTimeout(() => setLoadingSnackId(null), 500);
  };

  const handleUndocompleteWithLoading = async (id) => {
    setLoadingSnackId(id); // Set loading state while uncompleting

    try {
      await handleUndocomplete(id); // Call handleUndocomplete
    } catch (error) {
      console.error("Failed to uncomplete snack:", error);
    } finally {
      setLoadingSnackId(null); // Reset loading state after operation
    }
  };

  const renderSnacks = () => {
    const completedSnacks = snacks.filter((snack) => snack.completed);
    const nonCompletedSnacks = snacks.filter((snack) => !snack.completed);
    return [...nonCompletedSnacks, ...completedSnacks];
  };

  return (
    <div>
      <ul className={styles.snacksList}>
        {renderSnacks().map((snack) => (
          <li
            key={snack.id}
            className={`${styles.snack} ${
              snack.completed ? styles.completed : ""
            }`}
          >
            <div className={styles.leftContent}>
              <button
                className={`${styles.buttonComplete} ${
                  snack.completed ? styles.completedButton : ""
                }`}
                onClick={() => {
                  snack.completed
                    ? handleUndocompleteWithLoading(snack.id) // Call handleUndocompleteWithLoading instead of handleUndocomplete directly
                    : handleShowRating(snack.id);
                }}
                disabled={loadingSnackId === snack.id} // Check if the snack is loading
              >
                {loadingSnackId === snack.id ? (
                  <i className="fa-solid fa-spinner fa-spin-pulse"></i> // Show spinner if loading
                ) : (
                  <i className="far fa-check-circle fa-xs"></i>
                )}
              </button>

              <div className={styles.snackContainer}>
                {snack.isRating ? (
                  <Rating
                    snack={snack}
                    onSubmit={handleCompleteWithRating}
                    onSkip={() => handleSkipRating(snack)}
                  />
                ) : (
                  <>
                    <span className={styles.snackTitle}>{snack.title}</span>
                    <div className={styles.snacksInfo}>
                      <span className={styles.snackPrice}>${snack.price}</span>
                      <span> - </span>
                      <span className={styles.snackLocation}>
                        {snack.location}, {snack.park}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
            {!snack.isRating && (
              <div className={styles.SnackButtonContainer}>
                <ButtonContainer
                  snack={snack}
                  handleComplete={handleComplete}
                  handleEdit={handleEdit}
                  handleDelete={() => handleDeleteWithLoading(snack.id)}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Snacks;
