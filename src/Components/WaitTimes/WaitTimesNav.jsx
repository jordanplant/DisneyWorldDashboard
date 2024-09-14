import React from "react";
import styles from "./WaitTimes.module.css";

const WaitTimesNav = ({ activeTab, onTabChange }) => {
  return (
    <nav className={styles.waitTimeNav}>
      <ul className={styles.waitTimeCategories}>
        <li
          className={`${styles.WaitTimeOption} ${
            activeTab === "attractions" ? styles.active : ""
          }`}
          onClick={() => onTabChange("attractions")}
        >
          Attractions
        </li>
        <li
          className={`${styles.WaitTimeOption} ${
            activeTab === "shows" ? styles.active : ""
          }`}
          onClick={() => onTabChange("shows")}
        >
          Shows
        </li>
        <li
          className={`${styles.WaitTimeOption} ${
            activeTab === "characters" ? styles.active : ""
          }`}
          onClick={() => onTabChange("characters")}
        >
          Characters
        </li>
      </ul>
    </nav>
  );
};

export default WaitTimesNav;
