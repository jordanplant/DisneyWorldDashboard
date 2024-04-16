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

  return (
    <>
      <div>
        <ul className={styles.snacksList}>
          {snacks.map((snack) => (
            <React.Fragment key={snack.id}>
              <button
                className={`${styles.buttonComplete} ${snack.completed ? styles.completedButton : ''}`}
                onClick={() => handleCompleteWithLoading(snack.id)}
                disabled={loadingSnackId === snack.id}
              >
                {loadingSnackId === snack.id ? <i className="fa-solid fa-spinner fa-spin-pulse"></i> : <i className="far fa-check-circle fa-xs"></i>}
              </button>
              <li
                key={snack.id}
                className={`${styles.snack} ${snack.completed ? styles.completed : ''}`}
              >
                <span>{snack.title}</span>
                <span className={styles.SnackButtonContainer}>
                  <ButtonContainer
                    item={snack} // Pass the snack object as the item prop
                    handleEdit={handleEdit} // Pass the handleEdit function
                    handleDelete={() => handleDeleteWithLoading(snack.id)} // Pass the handleDelete function
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
