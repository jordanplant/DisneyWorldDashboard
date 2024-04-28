import React, { useState, useEffect } from "react";
import styles from "./SnacksList.module.css";
import ButtonContainer from "./ButtonContainer";

const Snacks = ({ snacks, handleComplete, handleEdit, handleDelete }) => {
  const [loadingSnackId, setLoadingSnackId] = useState(null);

  const handleCompleteWithLoading = async (id) => {
    setLoadingSnackId(id);
    await handleComplete(id);
    setTimeout(() => setLoadingSnackId(null), 500);
  };

  const handleDeleteWithLoading = async (id) => {
    setLoadingSnackId(id);
    await handleDelete(id);
    setTimeout(() => setLoadingSnackId(null), 500);
  };

  const renderSnacks = () => {
    const completedSnacks = snacks.filter((snack) => snack.completed);
    const nonCompletedSnacks = snacks.filter((snack) => !snack.completed);
    return [...nonCompletedSnacks, ...completedSnacks];
  };

  return (
    <>
      <div>
        <ul className={styles.snacksList}>
          {renderSnacks().map((snack) => (
            <React.Fragment key={snack.id}>
              <button
                className={`${styles.buttonComplete} ${
                  snack.completed ? styles.completedButton : ""
                }`}
                onClick={() => handleCompleteWithLoading(snack.id)}
                disabled={loadingSnackId === snack.id}
              >
                {loadingSnackId === snack.id ? (
                  <i className="fa-solid fa-spinner fa-spin-pulse"></i>
                ) : (
                  <i className="far fa-check-circle fa-xs"></i>
                )}
              </button>
              <li
                key={snack.id}
                className={`${styles.snack} ${
                  snack.completed ? styles.completed : ""
                }`}
              >
                <div className={styles.snackContainer}>
                  <span className={styles.snackTitle}>{snack.title}</span>
                  <div className={styles.snacksInfo}>
                    <span className={styles.snackPrice}>${snack.price}</span>
                    <span> - </span>
                    <span className={styles.snackLocation}>
                      {snack.location}
                    </span>
                  </div>
                </div>
                <span className={styles.SnackButtonContainer}>
                  <ButtonContainer
                    snack={snack}
                    handleComplete={handleComplete}
                    handleEdit={handleEdit}
                    handleDelete={() => handleDeleteWithLoading(snack.id)}
                  />
                </span>
              </li>
            </React.Fragment>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Snacks;
