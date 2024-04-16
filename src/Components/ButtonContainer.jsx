import React, { useState } from 'react';
import styles from "./ButtonContainer.module.css";

const ButtonContainer = ({ item, handleEdit, handleDelete, isItinerary }) => {
  const [showEditButton, setShowEditButton] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  const handleMoreClick = () => {
    setShowEditButton(prevState => !prevState);
    setShowDeleteButton(prevState => !prevState);
  };
  
  const handleEditClick = () => {
    const { id, ...newData } = item;
    handleEdit(id, newData);
  };

  const handleDeleteClick = () => {
    handleDelete(item.id);
  };

  // Determine which container style to use based on the isItinerary prop
  const containerStyle = isItinerary ? styles.itineraryContainer : '';

  return (
    <div className={`${styles.buttonContainer} ${containerStyle}`}>
      <button
        className={`${styles.buttonEdit} ${showEditButton ? styles.showEdit : ''}`}
        onClick={handleEditClick}
      >
        <i className="far fa-edit fa-xs"></i> {/* Change the icon to an edit icon */}
      </button>

      <button
        className={`${styles.buttonDelete} ${showDeleteButton ? styles.showDelete : ''}`}
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
