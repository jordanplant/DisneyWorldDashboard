import React, { useState } from 'react';
import styles from "./ButtonContainer.module.css";

const ButtonContainer = ({ snack, handleComplete, handleEdit, handleDelete }) => {
  const [showButtons, setShowButtons] = useState(false);

  const toggleButtons = () => {
    setShowButtons(!showButtons);
  };

  return (
    <div className={styles.buttonContainer}>
      <span className={`${styles.buttons} ${showButtons ? styles.show : ''}`}>
        <button
          className={styles.buttonComplete}
          onClick={() => handleComplete(snack.id)}
        >
          <i className="far fa-check-circle fa-xs"></i>
        </button>

        <button
          className={styles.buttonEdit}
          onClick={() => handleEdit(snack)}
          disabled={!snack || snack.completed}
        >
          <i className="far fa-pen-to-square fa-xs"></i>
        </button>

        <button
          className={styles.buttonDelete}
          onClick={() => handleDelete(snack.id)}
        >
          <i className="fas fa-trash fa-xs"></i>
        </button>
      </span>
      <button className={styles.buttonOption} onClick={toggleButtons}>
        <i className="fa-solid fa-ellipsis"></i>
      </button>
    </div>
  );
};

export default ButtonContainer;
