import React, { useState, useEffect } from 'react';
import styles from "./SnacksList.module.css";

const SnackListFilter = ({ selectedPark, onParkChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedParks, setSelectedParks] = useState([]); 
  const [isFilterActive, setIsFilterActive] = useState(false);

  const parks = {
    "Walt Disney World": [
      "Magic Kingdom",
      "EPCOT",
      "Hollywood Studios",
      "Animal Kingdom",
      "Disney Springs",
      "Resorts",
    ],
    "Disneyland Paris": [
      "Disneyland Park",
      "Walt Disney Studios",
      "Disney Village"
    ]
  };

  useEffect(() => {
    if (selectedPark) {
      setSelectedParks(parks[selectedPark]);
    }
  }, [selectedPark]);

  const toggleDropdown = () => {
    setIsDropdownOpen(prevState => {
      const newState = !prevState;
      setIsFilterActive(newState); 
      return newState;
    });
  };

  const handleCheckboxChange = (parkName) => {
    setSelectedParks((prevSelected) => {
      if (prevSelected.includes(parkName)) {
        return prevSelected.filter(park => park !== parkName); 
      } else {
        return [...prevSelected, parkName]; 
      }
    });
  };

  useEffect(() => {
    onParkChange(selectedParks); // Propagate the selected parks to the parent component
  }, [selectedParks, onParkChange]);

  const handleItemClick = (parkName) => {
    handleCheckboxChange(parkName); // Trigger checkbox change when the list item is clicked
  };

  return (
    <div className={styles.snackListFilter}>
      <div 
        className={`${styles.snackListOption} ${isFilterActive ? styles.active : ""}`} 
        onClick={toggleDropdown}
      >
        <i className={`fa-solid ${isFilterActive ? 'fa-times' : 'fa-sliders'}`}></i>
      </div>

      {isDropdownOpen && (
        <ul className={styles.filterResultsList}>
          {parks[selectedPark]?.map(parkName => (
            <li 
              key={parkName} 
              className={styles.filterOption} 
              onClick={() => handleItemClick(parkName)} // Make the entire li clickable
            >
              <label>
                <input
                  id={parkName} 
                  className={styles.parkFilterCheckbox}
                  type="checkbox"
                  checked={selectedParks.includes(parkName)} 
                  onChange={() => handleCheckboxChange(parkName)} 
                />
                {parkName}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SnackListFilter;
