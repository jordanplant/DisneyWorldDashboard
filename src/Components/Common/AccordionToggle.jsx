import React, { useRef, useEffect, useState } from "react";
import styles from "./Accordion.module.css";

const AccordionToggle = ({ title, isExpanded, children }) => {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (isExpanded) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isExpanded]);

  return (
    <div className={styles.accordion}>
      <div
        className={styles.accordionContentWrapper}
        style={{
          height: `${height}px`,
          overflow: 'hidden',
          transition: 'height 0.5s ease',
        }}
      >
        <div ref={contentRef}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AccordionToggle;