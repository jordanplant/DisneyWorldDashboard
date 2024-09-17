import React, { useState } from 'react';
import styles from "./SnacksList.module.css";

const SnackListNav = ({ activeTab, onTabChange, selectedPark, onParkChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(prevState => !prevState);
  };

  const parkIdMapping = {
    "Walt Disney World": {
      MagicKingdom: "75ea578a-adc8-4116-a54d-dccb60765ef9",
      Epcot: "47f90d2c-e191-4239-a466-5892ef59a88b",
      HollywoodStudios: "288747d1-8b4f-4a64-867e-ea7c9b27bad8",
      AnimalKingdom: "1c84a229-8862-4648-9c71-378ddd2c7693",
    },
    "Disneyland Paris": {
      DisneylandParkParis: "dae968d5-630d-4719-8b06-3d107e944401",
      WaltDisneyStudiosParis: "ca888437-ebb4-4d50-aed2-d227f7096968",
    },
  };

  const parks = parkIdMapping[selectedPark] || {};

  return (
    <nav className={styles.snacklistNav}>
      <ul className={styles.snacklistCategories}>
        <li
          className={`${styles.snackListOption} ${
            activeTab === "outstandingSnacks" ? styles.active : ""
          }`}
          onClick={() => onTabChange("outstandingSnacks")}
        >
          Snacks
        </li>

        <li
          className={`${styles.snackListOption} ${
            activeTab === "completedSnacks" ? styles.active : ""
          }`}
          onClick={() => onTabChange("completedSnacks")}
        >
          Completed
        </li>

        <li
          className={styles.snackListOption}
          onClick={toggleDropdown}
        >
          <i className="fa-solid fa-sliders"></i>
        </li>

        {isDropdownOpen && (
          <ul className={styles.filterResultsList}>
            {Object.keys(parks).map(parkKey => (
              <li
                key={parks[parkKey]}
                onClick={() => {
                  onParkChange(parks[parkKey]);
                  toggleDropdown();
                }}
                className={styles.filterOption}
              >
                {parkKey}
              </li>
            ))}
          </ul>
        )}
      </ul>
    </nav>
  );
};

export default SnackListNav;