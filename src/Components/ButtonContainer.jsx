import React, { useState } from 'react';
import styles from "./ButtonContainer.module.css";

const ButtonContainer = ({ snack, handleComplete, handleEdit, handleDelete }) => {
  const [showButtons, setShowButtons] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  const toggleButtons = () => {
    setShowButtons(!showButtons);
    setShowEditButton(false); // Reset edit button animation
    setShowDeleteButton(false); // Reset delete button animation
  };

  const handleMoreClick = () => {
    toggleButtons();
    setTimeout(() => {
      setShowDeleteButton(true);
    }, 100);
    setTimeout(() => {
      setShowEditButton(true);
    }, 200);
  };

  return (
    <div className={styles.buttonContainer}>
      <span className={`${styles.buttons} ${showButtons ? styles.show : ''}`}>
        <button
          className={`${styles.buttonEdit} ${showEditButton ? styles.slideIn : styles.slideOut}`}
          onClick={() => handleEdit(snack)}
          disabled={!snack || snack.completed}
        >
          <i className="far fa-pen-to-square fa-xs"></i>
        </button>

        <button
          className={`${styles.buttonDelete} ${showDeleteButton ? styles.slideIn : styles.slideOut}`}
          onClick={() => handleDelete(snack.id)}
        >
          <i className="fas fa-trash fa-xs"></i>
        </button>
      </span>
      <button className={styles.buttonOption} onClick={handleMoreClick}>
        <i className="fa-solid fa-ellipsis"></i>
      </button>
    </div>
  );
};

export default ButtonContainer;
