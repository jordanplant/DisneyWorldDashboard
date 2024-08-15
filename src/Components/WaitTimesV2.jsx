import React, { useState, useEffect, useMemo } from "react";
import styles from "./WaitTimes.module.css";
import ParkIcons from "./ParkIcons";

const apiUrl = "/api/waitTimesV2";
const parkIdMapping = {
  // Disney World
  "Walt Disney World": {
    MagicKingdom: "75ea578a-adc8-4116-a54d-dccb60765ef9",
    Epcot: "47f90d2c-e191-4239-a466-5892ef59a88b",
    HollywoodStudios: "288747d1-8b4f-4a64-867e-ea7c9b27bad8",
    AnimalKingdom: "1c84a229-8862-4648-9c71-378ddd2c7693",
  },
  // Disneyland Paris
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



function WaitTimesV2({ selectedPark }) { 
  const [attractionsData, setAttractionsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeButton, setActiveButton] = useState("MagicKingdom");
  const [sortConfig, setSortConfig] = useState({ key: "wait_time", direction: "ascending" });
  const ParkIconComponent = ParkIcons[selectedPark] || null; // Get the icon component based on the selected park
  
  const handleParkClick = (park) => {
    setActiveButton(park);
    // Fetch wait times or perform other actions
  };

  useEffect(() => {
    const defaultPark = Object.keys(parkIdMapping[selectedPark])[0];
    setActiveButton(defaultPark);
    fetchAndDisplayAttractions(parkIdMapping[selectedPark][defaultPark]);
  }, [selectedPark]);

  const fetchAndDisplayAttractions = async (parkId) => {
    setIsLoading(true);

    if (!parkId) {
      console.log("No park selected.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}?parkId=${parkId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      const attractions = (data.liveData || []).filter(
        (attraction) => attraction.entityType === "ATTRACTION"
      );
      console.log("Filtered attractions data:", attractions);

      setAttractionsData(attractions);
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = (parkName) => {
    setActiveButton(parkName);
    fetchAndDisplayAttractions(parkIdMapping[selectedPark][parkName]);
  };

  const sortedData = useMemo(() => {
    return [...attractionsData].sort((a, b) => {
      const statusOrder = { "OPERATING": 0, "BOARDING_GROUP": 1, "CLOSED": 2, "REFURBISHMENT": 3 };
      const statusA = a.queue?.BOARDING_GROUP ? "BOARDING_GROUP" : a.status || "CLOSED";
      const statusB = b.queue?.BOARDING_GROUP ? "BOARDING_GROUP" : b.status || "CLOSED";

      if (statusA !== statusB) {
        return statusOrder[statusA] - statusOrder[statusB];
      }

      if (statusA === "OPERATING" || statusA === "BOARDING_GROUP") {
        let waitTimeA, waitTimeB;

        if (statusA === "OPERATING") {
          waitTimeA = a.queue?.STANDBY?.waitTime ? parseInt(a.queue.STANDBY.waitTime, 10) : Infinity;
          waitTimeB = b.queue?.STANDBY?.waitTime ? parseInt(b.queue.STANDBY.waitTime, 10) : Infinity;
        } else {
          return 0;
        }

        return (waitTimeA - waitTimeB) * (sortConfig.direction === 'ascending' ? 1 : -1);
      }

      return 0;
    });
  }, [attractionsData, sortConfig]);

  const sortedField = (key) => {
    if (key === 'wait_time') {
      setSortConfig((prevConfig) => {
        const direction = prevConfig.key === key && prevConfig.direction === "ascending"
          ? "descending"
          : "ascending";
        return { key, direction };
      });
    }
  };

  return (
    <div className={styles.waitTimes}>
      {/* Park Icons Section */}
      <div className={styles.parkIcons}>
        {selectedPark && parkIdMapping[selectedPark] ? (
          Object.entries(parkIdMapping[selectedPark]).map(([parkName, parkId]) => {
            const ParkIcon = ParkIcons[parkName]; // Dynamically select the icon based on parkName
            const nameParts = parkNames[parkName] || [parkName]; // Get name parts
  
            if (!ParkIcon) {
              // Handle the case where ParkIcon is not found
              return null;
            }
  
            return (
              <button
                key={parkName}
                className={`${styles.parkButton} ${
                  activeButton === parkName ? styles.active : ""
                }`}
                onClick={() => handleButtonClick(parkName)}
              >
                <ParkIcon
                  className={`${styles.parkIcon} ${
                    activeButton === parkName ? styles.activeSvg : ""
                  }`}
                  active={activeButton === parkName} // Pass the active state
                />
              
                <p  
                  className={`${styles.parkName} ${
                    activeButton === parkName ? styles.fadeOut : ""
                  }`}
                >
                  {nameParts.map((part, index) => (
                    <React.Fragment key={index}>
                      {part}
                      {index < nameParts.length - 1 && <br />} {/* Add line break except after the last part */}
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
  
      {/* Wait Times Table Section */}
      <div className={styles.fixedHeightTable}>
        {isLoading ? (
          <p className={styles.loadingMessage}>
            <i className="fa-solid fa-wand-magic-sparkles fa-2xl"></i> Conjuring Magic...
          </p>
        ) : attractionsData.length === 0 ? (
          <p>Magic needs to rest too. Try again later</p>
        ) : (
          <div className={styles.scrollableContainer}>
            <table id="dataTable">
              <thead>
                <tr>
                  <th
                    className={`${styles.sortable} ${styles.attraction}`}
                    onClick={() => sortedField('name')}
                  >
                    Attraction
                  </th>
                  <th
                    className={`${styles.sortable} ${styles.waitTime}`}
                    onClick={() => sortedField('wait_time')}
                  >
                    Wait Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData.length === 0 ? (
                  <tr>
                    <td colSpan="2">Magic needs to rest too. Try again later</td>
                  </tr>
                ) : (
                  sortedData.map((ride) => (
                    <tr key={ride.id}>
                      <td className={styles.rideName}>
                        {ride.name.includes(' - ')
                          ? ride.name.split(' - ').map((part, index, array) =>
                              index < array.length - 1 ? (
                                <React.Fragment key={index}>
                                  {part}
                                  <br />-{' '}
                                </React.Fragment>
                              ) : (
                                part
                              )
                            )
                          : ride.name}
                      </td>
                      <td className={styles.waitRow}>
                        {ride.status === "OPERATING" && (ride.operatingHours?.length || 0) > 0 ? (
                          ride.queue?.BOARDING_GROUP ? (
                            <div className={styles.virtualQueue}>Virtual Queue</div>
                          ) : ride.queue?.STANDBY?.waitTime !== null && ride.queue?.STANDBY?.waitTime !== undefined ? (
                            <React.Fragment>
                              <span className={styles.bold}>{ride.queue.STANDBY.waitTime}</span>{" "}
                              mins
                            </React.Fragment>
                          ) : (
                            'N/A'
                          )
                        ) : (
                          ride.status === "REFURBISHMENT" ? (
                            <span className={styles.refurbishment}>REFURBISHMENT</span>
                          ) : (
                            <span className={styles.closed}>CLOSED</span>
                          )
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
  
}  

export default WaitTimesV2;
