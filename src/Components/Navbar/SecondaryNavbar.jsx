import React, { useState, useRef, useEffect } from "react";
import styles from "./Navbar.module.css";

const SecondaryNavbar = ({ tabs, activeTab, onTabChange, filterComponent }) => {
  const [activeStyles, setActiveStyles] = useState({ width: 0, left: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const tabsRef = useRef([]);

  const handleTabClick = (tab, index) => {
    if (isAnimating) return;
    
    onTabChange(tab);
    const tabElement = tabsRef.current[index];
    
    setIsAnimating(true);
    setActiveStyles(prev => ({
      ...prev,
      targetWidth: tabElement.offsetWidth,
      targetLeft: tabElement.offsetLeft,
    }));
    
    setTimeout(() => {
      setIsAnimating(false);
      setActiveStyles(prev => ({
        ...prev,
        width: prev.targetWidth,
        left: prev.targetLeft,
      }));
    }, 400);
  };

  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab === activeTab);
    if (activeIndex !== -1 && tabsRef.current[activeIndex]) {
      const tabElement = tabsRef.current[activeIndex];
      setActiveStyles({
        width: tabElement.offsetWidth,
        left: tabElement.offsetLeft,
      });
    }
  }, [activeTab, tabs]);

  return (
    <nav className={styles.secondaryNav}>
      <div 
        className={styles.sliderBackground}
        style={{
          left: `${activeStyles.left}px`,
          width: `${activeStyles.width}px`,
          transition: isAnimating ? 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
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
            {tab}
          </li>
        ))}
        {filterComponent && (
          <li
            className={styles.navOption}
            onClick={() => setActiveStyles(prev => ({ 
              ...prev, 
              isDropdownOpen: !prev.isDropdownOpen 
            }))}
          >
            <i className={`fa-solid ${activeStyles.isDropdownOpen ? "fa-times" : "fa-sliders"}`} />
          </li>
        )}
      </ul>
      {activeStyles.isDropdownOpen && filterComponent && <div>{filterComponent}</div>}
    </nav>
  );
};

export default SecondaryNavbar;