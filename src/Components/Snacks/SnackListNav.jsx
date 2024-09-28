import React, { useState } from 'react';
import styles from "./SnacksList.module.css";

const SnackListNav = ({ activeTab, onTabChange, selectedPark, onParkChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedParks, setSelectedParks] = useState([]);
  const [isFilterActive, setIsFilterActive] = useState(false); // State for filter button active status

  const toggleDropdown = () => {
    setIsDropdownOpen(prevState => {
      const newState = !prevState;
      setIsFilterActive(newState); // Update filter active state based on dropdown state
      return newState;
    });
  };

  const parks = {
    "Walt Disney World": [
      "Magic Kingdom",
      "EPCOT",
      "Hollywood Studios",
      "Animal Kingdom"
    ],
    "Disneyland Paris": [
      "Disneyland Park",
      "Walt Disney Studios"
    ]
  };

  const handleCheckboxChange = (parkName) => {
    setSelectedParks((prevSelected) => {
      if (prevSelected.includes(parkName)) {
        // Remove parkName if it is already selected
        return prevSelected.filter(park => park !== parkName);
      } else {
        // Add parkName to selectedParks
        return [...prevSelected, parkName];
      }
    });
  };

  const handleTabClick = (tab) => {
    onTabChange(tab);
    // No need to close the filter dropdown
  };

  // Notify parent about the selected parks whenever they change
  React.useEffect(() => {
    onParkChange(selectedParks);
  }, [selectedParks, onParkChange]);

  return (
    <nav className={styles.snacklistNav}>
      <ul className={styles.snacklistCategories}>
        {["outstandingSnacks", "completedSnacks"].map((tab) => (
          <li
            key={tab}
            className={`${styles.snackListOption} ${activeTab === tab ? styles.active : ""}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab === "outstandingSnacks" ? "Snacks" : "Completed"}
          </li>
        ))}
        
        <li
          className={`${styles.snackListOption} ${isFilterActive ? styles.active : ""}`} // Keep active logic for filter button
          onClick={toggleDropdown}
        >
          <i className={`fa-solid ${isFilterActive ? 'fa-times' : 'fa-sliders'}`}></i> {/* Change icon based on filter state */}
        </li>

        {isDropdownOpen && (
          <ul className={styles.filterResultsList}>
            {parks[selectedPark]?.map(parkName => (
              <li key={parkName}>
                <label className={styles.filterOption}>
                  <input
                    id={parkName} 
                    className={styles.parkFilterCheckbox}
                    type="checkbox"
                    checked={selectedParks.includes(parkName)}
                    onChange={() => handleCheckboxChange(parkName)} // Keep this to handle checkbox state
                  />
                  {parkName}
                </label>
              </li>
            ))}
          </ul>
        )}
      </ul>
    </nav>
  );
};

export default SnackListNav;
