import React, { useEffect } from "react";
import styles from "./ParkSelect.module.css";
import Icons from "./Icons";


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

const parkNames = {
  MagicKingdom: ["Magic", "Kingdom"],
  Epcot: ["Epcot"],
  HollywoodStudios: ["Hollywood", "Studios"],
  AnimalKingdom: ["Animal", "Kingdom"],
  DisneylandParkParis: ["Disneyland", "Park"],
  WaltDisneyStudiosParis: ["Walt Disney", "Studios Park"],
};

function ParkSelect({ selectedPark, onParkChange, activePark }) {
  useEffect(() => {
    // Check if activePark is valid for the current selectedPark, if not set to default park
    if (!activePark || !Object.keys(parkIdMapping[selectedPark]).includes(activePark)) {
      const defaultPark = Object.keys(parkIdMapping[selectedPark])[0];
      onParkChange(defaultPark); // Notify the parent of the default park selection
    }
  }, [selectedPark, activePark, onParkChange]);

  return (
    <div className={styles.parkIcons}>
      {selectedPark && parkIdMapping[selectedPark] ? (
        Object.entries(parkIdMapping[selectedPark]).map(([parkName, parkId]) => {
          const ParkIcon = Icons[parkName];
          const nameParts = parkNames[parkName] || [parkName];

          if (!ParkIcon) {
            return null;
          }

          return (
            <button
              key={parkName}
              className={`${styles.parkButton} ${activePark === parkName ? styles.active : ""}`}
              onClick={() => onParkChange(parkName)}
            >
              <ParkIcon
                className={`${styles.parkIcon} ${activePark === parkName ? styles.activeSvg : ""}`}
                active={activePark === parkName}
              />
              <p className={`${styles.parkName} ${activePark === parkName ? styles.fadeOut : ""}`}>
                {nameParts.map((part, index) => (
                  <React.Fragment key={index}>
                    {part}
                    {index < nameParts.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>
            </button>
          );
        })
      ) : (
        <p>No park selected or invalid park selection.</p>
      )}
    </div>
  );
}

export default ParkSelect;
