// ManualAddPopup.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styles from './SnacksList.module.css'; // Adjust the import path as necessary

const SnackListManualAdd = ({
  showManualAddPopup,
  setShowManualAddPopup,
  handleManualAddSubmit,
  title,
  setTitle,
  price,
  setPrice,
  location,
  setLocation,
  park,
  setPark,
}) => {
  if (!showManualAddPopup) return null;

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popup}>
        <div className={styles.popupTopSection}>
        <h2>Add Snack Details</h2>
        </div>
        <form onSubmit={handleManualAddSubmit}>
          <input
            type="text"
            placeholder="Snack Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="$"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Park"
            value={park}
            onChange={(e) => setPark(e.target.value)}
          />

          <div className={styles.popupButtons}>
            <button 
            className={styles.saveButton}
            type="submit">Add Snack</button>
            <button
            className={styles.cancelButton}
              type="button"
              onClick={() => setShowManualAddPopup(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Prop types for type checking
SnackListManualAdd.propTypes = {
  showManualAddPopup: PropTypes.bool.isRequired,
  setShowManualAddPopup: PropTypes.func.isRequired,
  handleManualAddSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  setTitle: PropTypes.func.isRequired,
  price: PropTypes.number.isRequired,
  setPrice: PropTypes.func.isRequired,
  location: PropTypes.string.isRequired,
  setLocation: PropTypes.func.isRequired,
  park: PropTypes.string.isRequired,
  setPark: PropTypes.func.isRequired,
};

export default SnackListManualAdd;
