import React from "react";
import styles from "./ParkSelect.module.css";
import { MagicWandIcon } from "./Icons";

const LoadingMessage = () => {
  return (
    <>
      <p className={styles.loadingMessage}>
        <>
          <MagicWandIcon />
        </>
        Conjuring Magic...
      </p>
    </>
  );
};

export default LoadingMessage;
