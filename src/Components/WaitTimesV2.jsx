import React, { useState, useEffect } from "react";
import styles from "./WaitTimes.module.css";

const apiUrl = "/api/waitTimesV2";
const parkIdMapping = {
  MagicKingdom: "75ea578a-adc8-4116-a54d-dccb60765ef9",
  Epcot: "47f90d2c-e191-4239-a466-5892ef59a88b",
  HollywoodStudios: "288747d1-8b4f-4a64-867e-ea7c9b27bad8",
  AnimalKingdom: "1c84a229-8862-4648-9c71-378ddd2c7693",
};

function WaitTimesV2() {
  const [attractionsData, setAttractionsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeButton, setActiveButton] = useState("MagicKingdom");

  const handleButtonClick = (parkName) => {
    const parkId = parkIdMapping[parkName];
    setActiveButton(parkName);
    fetchAndDisplayAttractions(parkId);
  };

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
  
      console.log("Raw Data:", data); // Inspect the raw data structure
  
      // Extract liveData array and filter for attractions
      const attractions = (data.liveData || []).filter(
        (attraction) => attraction.entityType === 'ATTRACTION'
      );
  
      console.log("Filtered Attractions:", attractions); // Inspect filtered attractions
  
      setAttractionsData(attractions);
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndDisplayAttractions(parkIdMapping.MagicKingdom); // Default to Magic Kingdom
  }, []);

  return (
    <div className={styles.waitTimes}>
      <div className={styles.parkIcons}>
        <button
          className={`${styles.parkMK} ${
            activeButton === "MagicKingdom" ? "active" : ""
          }`}
          onClick={() => handleButtonClick("MagicKingdom")}
        >
          {/* SVG icon here */}
          <p
            className={`${styles.parkName} ${
              activeButton === "MagicKingdom" ? styles.fadeOut : ""
            }`}
          >
            Magic
            <br />
            Kingdom
          </p>
        </button>
        <button
          className={`${styles.parkEpcot} ${
            activeButton === "Epcot" ? "active" : ""
          }`}
          onClick={() => handleButtonClick("Epcot")}
        >
          {/* SVG icon here */}
          <p
            className={`${styles.parkName} ${
              activeButton === "Epcot" ? styles.fadeOut : ""
            }`}
          >
            Epcot
          </p>
        </button>
        <button
          className={`${styles.parkHS} ${
            activeButton === "HollywoodStudios" ? "active" : ""
          }`}
          onClick={() => handleButtonClick("HollywoodStudios")}
        >
          {/* SVG icon here */}
          <p
            className={`${styles.parkName} ${
              activeButton === "HollywoodStudios" ? styles.fadeOut : ""
            }`}
          >
            Hollywood <br />
            Studios
          </p>
        </button>
        <button
          className={`${styles.parkAK} ${
            activeButton === "AnimalKingdom" ? "active" : ""
          }`}
          onClick={() => handleButtonClick("AnimalKingdom")}
        >
          {/* SVG icon here */}
          <p
            className={`${styles.parkName} ${
              activeButton === "AnimalKingdom" ? styles.fadeOut : ""
            }`}
          >
            Animal <br />
            Kingdom
          </p>
        </button>
      </div>
      <div className={styles.fixedHeightTable}>
        {isLoading ? (
          <p className={styles.loadingMessage}>
            <i className="fa-solid fa-wand-magic-sparkles fa-2xl"></i> Conjuring
            Magic...
          </p>
        ) : attractionsData.length === 0 ? (
          <p>Magic needs to rest too. Try again later</p>
        ) : (
          <div className={styles.scrollableContainer}>
            <table id="dataTable">
              <thead>
                <tr>
                  <th></th>
                  <th>Attraction</th>
                  <th>Wait Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attractionsData.length === 0 ? (
                  <tr>
                    <td colSpan="4">Magic needs to rest too. Try again later</td>
                  </tr>
                ) : (
                  attractionsData.map((ride) => (
                    <tr key={ride.id}>
                      <td className={styles.rideName}>
                        {ride.name.includes(" - ")
                          ? ride.name.split(" - ").map((part, index, array) =>
                              index < array.length - 1 ? (
                                <React.Fragment key={index}>
                                  {part}
                                  <br />-{" "}
                                </React.Fragment>
                              ) : (
                                part
                              )
                            )
                          : ride.name}
                      </td>
                      <td>
                        {ride.queue?.STANDBY?.waitTime !== null &&
                        ride.queue?.STANDBY?.waitTime !== undefined
                          ? `${ride.queue.STANDBY.waitTime} mins`
                          : "N/A"}
                      </td>
                      <td
                        className={
                          ride.status === "OPEN"
                            ? styles.open
                            : ride.status === "CLOSED" || ride.status === "DOWN"
                            ? styles.closed
                            : styles.refurbishment
                        }
                      >
                        {ride.status === "OPEN"
                          ? "OPEN"
                          : ride.status === "CLOSED" || ride.status === "DOWN"
                          ? "CLOSED"
                          : "REFURBISHMENT"}
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
