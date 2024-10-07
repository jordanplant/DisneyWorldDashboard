import React, { useState, useEffect } from 'react';
import styles from "./SnacksList.module.css";


const SnackListNav = ({ activeTab, onTabChange, selectedPark, onParkChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedParks, setSelectedParks] = useState([]); 
  const [isFilterActive, setIsFilterActive] = useState(false); 


  // currently - unselecting all parks will show you everything, including undefined park locations

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

  const handleTabClick = (tab) => {
    onTabChange(tab); 
  };

useEffect(() => {
  onParkChange(selectedParks); // Propagate the selected parks to the parent component
}, [selectedParks, onParkChange]);

  const handleItemClick = (parkName) => {
    handleCheckboxChange(parkName); // Trigger checkbox change when the list item is clicked
  };

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
          className={`${styles.snackListOption} ${isFilterActive ? styles.active : ""}`} 
          onClick={toggleDropdown}
        >
          <i className={`fa-solid ${isFilterActive ? 'fa-times' : 'fa-sliders'}`}></i> 
        </li>

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
      </ul>
    </nav>
  );
};

export default SnackListNav;
