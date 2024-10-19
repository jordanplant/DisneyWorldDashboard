import React, { useRef, useState } from "react";
import styles from "./Accordion.module.css"; 

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.accordion}>
      <button onClick={toggleAccordion} className={styles.accordionTitle}>
        {title}
      </button>
      <div
        className={styles.accordionContentWrapper}
        style={
          isOpen
            ? { maxHeight: contentRef.current?.scrollHeight + "px" }
            : { maxHeight: "0px" }
        }
      >
        <div ref={contentRef} className={styles.accordionContent}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
