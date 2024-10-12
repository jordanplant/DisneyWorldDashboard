import React, { useState, useRef, useEffect } from "react";
import styles from "./Navbar.module.css";

const SecondaryNavbar = ({ tabs, activeTab, onTabChange, itemCount, filterComponent, snacks }) => {
  const [activeStyles, setActiveStyles] = useState({ width: 0, left: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navRef = useRef(null);
  const tabsRef = useRef([]);

  const handleTabClick = (tab, index) => {
    if (isAnimating) return;

    onTabChange(tab);
    const tabElement = tabsRef.current[index];
    const navElement = navRef.current;

    setIsAnimating(true);

    const tabLeft = tabElement.offsetLeft;
    const tabWidth = tabElement.offsetWidth;
    const navWidth = navElement.offsetWidth;
    const scrollPosition = tabLeft - (navWidth / 2) + (tabWidth / 2);

    navElement.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });

    setActiveStyles({
      width: tabWidth,
      left: tabLeft,
    });

    setTimeout(() => setIsAnimating(false), 400);
  };

  const tabDisplayNames = {
    completedSnacks: 'Completed',
    outstandingSnacks: 'Snacks',
    Favorites: 'Favorites'
  };

  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab === activeTab);
    if (activeIndex !== -1 && tabsRef.current[activeIndex]) {
      const tabElement = tabsRef.current[activeIndex];
      setActiveStyles({
        width: tabElement.offsetWidth,
        left: tabElement.offsetLeft,
      });

      const navElement = navRef.current;
      const tabLeft = tabElement.offsetLeft;
      const tabWidth = tabElement.offsetWidth;
      const navWidth = navElement.offsetWidth;
      const scrollPosition = tabLeft - (navWidth / 2) + (tabWidth / 2);
      navElement.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [activeTab, tabs]);

  // console.log(itemCount); // Check if itemCount has values


  return (
    <nav ref={navRef} className={styles.secondaryNav}>
      <div
        className={styles.sliderBackground}
        style={{
          left: `${activeStyles.left}px`,
          width: `${activeStyles.width}px`,
          transition: isAnimating ? 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
        }}
      >
        <div className={styles.sliderPill} />
      </div>
      <ul className={styles.navCategories}>
        {tabs.map((tab, index) => (
          <li
            key={tab}
            ref={(el) => (tabsRef.current[index] = el)}
            className={`${styles.navOption} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => handleTabClick(tab, index)}
          >
            {tab === "Favorites" ? (
              <i
                className={`fa-${
                  activeTab === "Favorites" ? "solid" : "regular"
                } fa-heart ${activeTab === "Favorites" ? styles.activeIcon : ''}`}
              />
            ) : (
              <>
                {tabDisplayNames[tab] || tab}
                {itemCount && (
  <span className={styles.itemCount}>
    ({itemCount[tab] || 0})
  </span>
)}
              </>
            )}
          </li>
        ))}

        {filterComponent && (
          <li
            className={styles.navOption}
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          >
            <i className={`fa-solid ${isDropdownOpen ? "fa-times" : "fa-sliders"}`} />
          </li>
        )}
      </ul>

      {isDropdownOpen && filterComponent && (
        <div className={styles.filterDropdown}>
          {filterComponent}
        </div>
      )}
    </nav>
  );
};

export default SecondaryNavbar;
