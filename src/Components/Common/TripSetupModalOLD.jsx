import React, { useState } from "react";
import styles from "./TripSetupModal.module.css";

const today = new Date();
const minDate = new Date(today);
minDate.setMonth(minDate.getMonth() - 1);
const formattedMinDate = minDate.toISOString().split("T")[0];

const futureDate = new Date(today);
futureDate.setDate(futureDate.getDate() + 14);
const defaultEndDate = futureDate.toISOString().split("T")[0];
const defaultStartDate = today.toISOString().split("T")[0]; // Default start date is today

const parkToCityMap = {
  "Walt Disney World": "Orlando",
  "Disneyland California": "Anaheim",
  "Disneyland Paris": "Paris",
  "Tokyo Disneyland": "Tokyo",
  "Shanghai Disneyland": "Shanghai",
  "Hong Kong Disneyland": "Hong Kong",
};

const TripSetupModal = ({ onClose, onSave, onCityChange }) => {
  const [tripName, setTripName] = useState("");
  const [tripStartDate, setTripStartDate] = useState(defaultStartDate);
  const [tripEndDate, setTripEndDate] = useState(defaultEndDate);
  const [currentPage, setCurrentPage] = useState(1);

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1); // Move to the next page
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1); // Move to the previous page
  };

  const handleSave = () => {
    const city = parkToCityMap[tripName] || "Unknown City";
    const park = tripName;
    const newTrip = {
      id: Date.now(),
      name: tripName,
      startDate: tripStartDate,
      endDate: tripEndDate,
      city,
      park,
    };
    onSave(newTrip);
    onCityChange(city, park);
    setTripName("");
    setTripStartDate(defaultStartDate);
    setTripEndDate(defaultEndDate);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.setupModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalTopSection}>
          <h1 className={styles.modalTitle}>Create new trip</h1>
        </div>
        <div className={styles.formWrapper}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            {currentPage === 1 && (
              <>
                <label htmlFor="location">Where are you going?</label>
                <div className={styles.tripWrapper}>
                  {/* Options without groups */}
                  <select
                    name="location"
                    id="location"
                    className={`${styles.tripSelect} ${styles.tripInput}`}
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}
                    required
                  >
                    <option value="">Select a location</option>

                    <option value="Walt Disney World">Walt Disney World</option>
                    {/* <option value="Disneyland California" disabled>
                      Disneyland California
                    </option> */}

                    <option value="Disneyland Paris">Disneyland Paris</option>

                    {/* <option value="Tokyo Disneyland" disabled>
                      Tokyo Disneyland
                    </option> */}
                    {/* <option value="Shanghai Disneyland" disabled>
                      Shanghai Disneyland
                    </option> */}
                    {/* <option value="Hong Kong Disneyland" disabled>
                      Hong Kong Disneyland
                    </option> */}
                  </select>
                  {/* Options with groups */}
                  {/* <select
                name="location"
                id="location"
                className={`${styles.tripSelect} ${styles.tripInput}`}

                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                required
              >
                <option value="">Select a location</option>
                <optgroup label="North America">
                  <option value="Walt Disney World">Walt Disney World</option>
                  <option value="Disneyland California" disabled>
                    Disneyland California
                  </option>
                </optgroup>
                <optgroup label="Europe">
                  <option value="Disneyland Paris">Disneyland Paris</option>
                </optgroup>
                <optgroup label="Asia">
                  <option value="Tokyo Disneyland" disabled>
                    Tokyo Disneyland
                  </option>
                  <option value="Shanghai Disneyland" disabled>
                    Shanghai Disneyland
                  </option>
                  <option value="Hong Kong Disneyland" disabled>
                    Hong Kong Disneyland
                  </option>
                </optgroup>
              </select> */}
                </div>
                <label htmlFor="start">Trip Start Date</label>
                <div className={styles.tripWrapper}>
                  <input
                    type="date"
                    id="start"
                    value={tripStartDate}
                    className={`${styles.tripDate} ${styles.tripInput}`}
                    onChange={(e) => setTripStartDate(e.target.value)}
                    min={minDate}
                    required
                  />
                </div>
                <label htmlFor="end">Trip End Date</label>
                <div className={styles.tripWrapper}>
                  <input
                    type="date"
                    id="end"
                    value={tripEndDate}
                    className={`${styles.tripDate} ${styles.tripInput}`}
                    onChange={(e) => setTripEndDate(e.target.value)}
                    min={tripStartDate}
                    required
                  />
                </div>
                <div className={styles.submitButtons}>
                  {/* <button type="button" onClick={goToNextPage} className={styles.saveButton}>
              Next
            </button> */}

                  <button type="submit" className={styles.saveButton}>
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            {/* The page is ready for extra pages if needed */}
            {/* {currentPage === 2 && (
            <>

<div className={styles.submitButtons}>
<button type="submit" className={styles.saveButton}>
Save
</button>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
            
            
            
            </>)} */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default TripSetupModal;
