import React, { useState, useEffect, useRef } from "react";
import styles from "./ButtonContainer.module.css";

const ButtonContainer = ({ buttons, defaultIcon, onClick, isExpanded }) => {
  const [showButtons, setShowButtons] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowButtons(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleButtons = () => {
    if (buttons && buttons.length > 0) {
      setShowButtons((prevState) => !prevState);
    } else if (onClick) {
      onClick();
    }
  };

  // If it's being used as a single button (expand/collapse)
  if (!buttons || buttons.length === 0) {
    return (
      <button className={styles.expandButton} onClick={onClick}>
        <i className={defaultIcon || (isExpanded ? "fa-solid fa-angle-up" : "fa-solid fa-angle-down")}></i>
      </button>
    );
  }

  // If it's being used as a multi-button container
  return (
    <div className={styles.buttonContainer} ref={containerRef}>
      {buttons.map((button, index) => (
        <button
          key={index}
          className={`${styles[`button${button.type}`]} ${
            showButtons ? styles[`show${button.type}`] : ""
          }`}
          onClick={button.onClick}
          disabled={button.disabled}
        >
          <i className={button.icon}></i>
        </button>
      ))}
      <button className={styles.buttonOption} onClick={toggleButtons}>
        <i className={defaultIcon || "fa-solid fa-ellipsis"}></i>
      </button>
    </div>
  );
};

export default ButtonContainer;