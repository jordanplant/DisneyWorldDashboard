import React, { useState, useEffect, useRef } from "react";
import styles from "./ButtonContainer.module.css";

const ButtonContainer = ({ snack, handleEdit, handleDelete }) => {
  const [showEditButton, setShowEditButton] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowEditButton(false);
        setShowDeleteButton(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMoreClick = () => {
    setShowEditButton((prevState) => !prevState);
    setShowDeleteButton((prevState) => !prevState);
  };

  const handleEditClick = () => {
    handleEdit(snack);
  };

  const handleDeleteClick = () => {
    handleDelete(snack.id);
  };

  return (
    <div className={styles.buttonContainer} ref={containerRef}>
      <button
        className={`${styles.buttonEdit} ${
          showEditButton ? styles.showEdit : ""
        }`}
        onClick={handleEditClick}
        disabled={!snack || snack.completed}
      >
        <i className="far fa-pen-to-square fa-xs"></i>
      </button>

      <button
        className={`${styles.buttonDelete} ${
          showDeleteButton ? styles.showDelete : ""
        }`}
        onClick={handleDeleteClick}
      >
        <i className="fas fa-trash fa-xs"></i>
      </button>

      <button className={styles.buttonOption} onClick={handleMoreClick}>
        <i className="fa-solid fa-ellipsis"></i>
      </button>
    </div>
  );
};

export default ButtonContainer;
