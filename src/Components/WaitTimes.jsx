import React, { useState, useEffect } from "react";
import styles from "./WaitTimes.module.css";

const apiUrl = "/api/waitTimes";
const parkIdMapping = {
  MagicKingdom: "6",
  Epcot: "5",
  HollywoodStudios: "7",
  AnimalKingdom: "8",
};

function WaitTimes() {
  const [ridesData, setRidesData] = useState([]);
  const [ascending, setAscending] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [activeButton, setActiveButton] = useState("MagicKingdom");

  const handleButtonClick = (parkName) => {
    const parkId = parkIdMapping[parkName];
    console.log("Park ID:", parkId); // Log the retrieved park ID
    setActiveButton(activeButton === parkName ? null : parkName);
    fetchAndDisplayRides(parkId);
  };

  const fetchAndDisplayRides = async (parkId) => {
    setIsLoading(true);

    if (!parkId) {
      console.log("No park selected.");
      setIsLoading(false);
      return; // Early return if no parkId is provided
    }

    try {
      const response = await fetch(`${apiUrl}?parkId=${parkId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const filteredRides = data.lands.flatMap((land) => land.rides);
      const sortedRides = filteredRides.sort((a, b) => {
        if (a.is_open && !b.is_open) return -1;
        else if (!a.is_open && b.is_open) return 1;
        return a.wait_time - b.wait_time;
      });

      setRidesData(sortedRides);
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSortOrder = () => {
    setAscending(!ascending);
    setRidesData([...ridesData].reverse());
  };

  const sortedField = (field) => () => {
    const compare = (a, b) => {
      if (field === "name") return a[field].localeCompare(b[field]);
      return a[field] - b[field];
    };

    const sortedRides = [...ridesData].sort((a, b) =>
      ascending ? compare(a, b) : -compare(a, b)
    );
    setRidesData(sortedRides);
    toggleSortOrder();
  };


  useEffect(() => {
    // Optionally, fetch data for a default park on component mount
    fetchAndDisplayRides("6");
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
            <svg
              className={`${styles.parkIcon} ${
                activeButton === "MagicKingdom" ? styles.activeSvg : ""
              }`}
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 80 80"
              xmlSpace="preserve"
            >
              <defs>
                <linearGradient
                  id="parkMKGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="30%"
                    style={{ stopColor: "#519ddb", stopOpacity: 1 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: "#ff69b4", stopOpacity: 1 }}
                  />
                </linearGradient>
              </defs>
              <path
                fill={
                  activeButton === "MagicKingdom"
                    ? "url(#parkMKGradient)"
                    : "rgba(255, 255, 255, 0.7)"
                }
                d="M66,62.7h-2.1v-1.6h0.9l-3.5-10l-3.5,10h0.8v1.6h-2.9L55.7,49h1.8L54,36L50.4,46V28.4l1.5-5.6h-1.5v-2.7h1.4l-4-15.8
	l7.1-2.2L47.8,0v4.2l-4.1,15.9h1.4v2.7h-1.5l1.5,5.6v9.1l-0.4-1.3l-3.3-10.4h-4.5L34.1,36l-1.7-6l-3.1,13h1.3l0.2,10.7L26,40.8
	l-4.3,13.1h1.8v8.8h-2.8v-1.6h1l-3.5-10l-3.5,10.4h0.9v1.2h-2.1l2.1,5.4l-1.9,12.1h22.1v-9c0-1.6,0.5-3.2,1.4-4.6
	c0.7-0.9,1.5-1.6,2.5-2.1c1,0.5,1.9,1.2,2.5,2.1c1,1.3,1.5,2.9,1.4,4.6v9h22.1l-1.9-12.1C63.9,68.1,66,62.7,66,62.7z"
              />
            </svg>
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
            <svg
              className={`${styles.parkIcon} ${
                activeButton === "Epcot" ? styles.activeSvg : ""
              }`}
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 80 80"
              xmlSpace="preserve"
            >
              <defs>
                <linearGradient
                  id="parkEpcotGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="30%"
                    style={{ stopColor: "#d8d8d8", stopOpacity: 1 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: "#4682b4", stopOpacity: 1 }}
                  />
                </linearGradient>
              </defs>
              <path
                fill={
                  activeButton === "Epcot" ? "url(#parkEpcotGradient)" : "rgba(255, 255, 255, 0.7)"
                }
                d="M47,35.6h-4.9l2.5-4.3l2.5-4.3h-9.8l2.5-4.3l2.5-4.3l2.5,4.3l2.5,4.3l2.5-4.3l2.5-4.3l2.5,4.3l2.5,4.2
	l2.5,4.3l2.5,4.3H52l2.5,4.3l2.5,4.3H47l2.5-4.3l2.5-4.3L47,35.6z M71.8,71.1l-11-12.5c4.1-4.1,6.9-9.4,8-15
	c1.1-5.7,0.5-11.6-1.7-16.9c-2.2-5.4-6-9.9-10.8-13.2c-4.8-3.2-10.5-4.9-16.3-4.9c-5.8,0-11.5,1.7-16.3,4.9
	c-4.8,3.2-8.6,7.8-10.8,13.2c-2.2,5.4-2.8,11.3-1.7,16.9c1.1,5.7,3.9,10.9,8,15L8,71.1L24.1,71l3-6.7c4,2,8.4,3,12.9,3s8.9-1,12.9-3
	l3,6.7L71.8,71.1z"
              />
            </svg>

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
            <svg
              className={`${styles.parkIcon} ${
                activeButton === "HollywoodStudios" ? styles.activeSvg : ""
              }`}
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 80 80"
              xmlSpace="preserve"
            >
              <defs>
                <linearGradient
                  id="parkHSGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="30%"
                    style={{ stopColor: "#ec506a", stopOpacity: 1 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: "#f3cc56", stopOpacity: 1 }}
                  />
                </linearGradient>
              </defs>
              <path
                fill={
                  activeButton === "HollywoodStudios"
                    ? "url(#parkHSGradient)"
                    : "rgba(255, 255, 255, 0.7)"
                }
                d="M52,38.5h-7.2V34H52L52,38.5z M52,47.4h-7.2v-4.5H52L52,47.4z M52,56.3h-7.2v-4.5H52L52,56.3z M43.3,28
	H37V24c0-0.8,0.3-1.6,0.9-2.2c0.6-0.6,1.4-0.9,2.2-0.9s1.6,0.3,2.2,0.9c0.6,0.6,0.9,1.4,0.9,2.2V28z M35.6,38.5h-7.2V34h7.2V38.5z
	 M35.6,47.5h-7.2V43h7.2V47.5z M35.6,56.4h-7.2v-4.5h7.2V56.4z M58,59.8V30.7h5.5V28h-1.4v-9.5h1.4l-1.4-2.9H58v-1.9h1.2l-2.6-5.4
	L54,13.8h1.2v1.9h-7.6v-1.9h1.4l-1.4-2.9h-2.4V8.6l-5.1-5.1l-4.9,4.9v2.5h-2.5l-1.3,2.9h1.4v1.9h-7.5v-1.9h1.2l-2.6-5.4l-2.6,5.4
	h1.2v1.9h-4.2l-1.4,2.9h1.4V28h-1.4v2.7h5.5v29.1h-6.9v2.7h1.4v13.9h46.6V62.5h1.4v-2.7L58,59.8z"
              />
            </svg>
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
            <svg
              className={`${styles.parkIcon} ${
                activeButton === "AnimalKingdom" ? styles.activeSvg : ""
              }`}
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 80 80"
              xmlSpace="preserve"
            >
              <defs>
                <linearGradient
                  id="parkAKGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="30%"
                    style={{ stopColor: "#228b22", stopOpacity: 1 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: "#d6c98e", stopOpacity: 1 }}
                  />
                </linearGradient>
              </defs>
              <path
                fill={
                  activeButton === "AnimalKingdom"
                    ? "url(#parkAKGradient)"
                    : "rgba(255, 255, 255, 0.7)"
                }
                d="M59.4,40.6l-6.1,1.8c-0.8,0-0.7-1.2-0.5-1.5l2.3-4.7c0-0.1,0.1-0.1,0.2-0.2c0.1,0,0.2-0.1,0.2-0.1
	s0.2,0,0.3,0c0.1,0,0.2,0.1,0.2,0.1c1.1,1.2,2.3,2.3,3.5,3.4C59.8,39.8,59.8,40.5,59.4,40.6z M51.9,34.4c-2,2.1-3.9,4.5-5.5,6.9
	c-0.2,0.3-0.7,0.3-0.9-0.3c-0.7-2-1.4-3.9-1.6-5.5c0-0.1,0-0.2,0.1-0.3s0.1-0.2,0.2-0.2c1.1-0.9,2.1-1.8,3.1-2.8
	c0-0.1,0.1-0.1,0.2-0.1c0.1,0,0.1,0,0.2,0c1.3,0.2,2.5,0.6,3.6,1.2C51.7,33.5,52.3,34,51.9,34.4z M39.1,40.9
	c-0.1,0.3-0.4,0.8-0.8,0.6c-2-0.7-5.6-3.2-8.5-4.7c-0.1-0.1-0.2-0.1-0.2-0.2s-0.1-0.2-0.1-0.3c-0.1-0.8,0-1.7,0.4-2.5
	c0.2-0.3,0.4-0.5,0.6-0.7c1.1-0.6,2.1-1.2,3.1-1.6c0.3-0.2,0.6-0.3,0.9-0.3c0.3,0,0.6,0.1,0.9,0.3c1.3,1.1,2.7,2.2,4.1,3.1
	c0.1,0,0.1,0.1,0.2,0.2c0.1,0.1,0.1,0.2,0.1,0.2C40.1,37.1,39.8,39,39.1,40.9 M30.6,45.2c-2.5-0.8-6-1.9-9-2.8
	c-0.1,0-0.2-0.1-0.3-0.1c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3c0.1-0.1,0.1-0.1,0.2-0.2c1.3-0.7,2.5-1.4,3.6-2.3
	c0.1-0.1,0.2-0.2,0.4-0.2c0.1,0,0.3-0.1,0.4,0c0.1,0,0.3,0.1,0.4,0.1c0.1,0.1,0.2,0.2,0.3,0.3c1.5,1.8,3.6,3.4,4.7,4.6
	C31.9,44.5,31.3,45.4,30.6,45.2 M78.2,36.6l-1.6-3.8C76.2,31.6,76,30.3,76,29l0.4-4.9c0-0.6-0.1-1.2-0.4-1.7c-0.3-0.5-0.7-1-1.2-1.3
	l-6.7-3.6c-1-0.5-1.8-1.7-1.8-2.5s-0.8-2-1.8-2.5l-4.8-2.4c-1.2-0.5-2.5-0.9-3.8-0.9h-7.3c-1.3,0.1-2.6,0.5-3.6,1.2l-3.1,2.3
	c-1.1,0.7-2.3,1.2-3.6,1.2h-8.2c-1.2,0-2.3,0.5-3.2,1.3c-0.9,0.8-2,1.3-3.2,1.3l-1.9,0c-1.3,0.1-2.5,0.6-3.4,1.5l-0.5,0.5
	c-0.9,0.9-2.2,1.4-3.4,1.4h-1.6c-1.3,0.1-2.5,0.6-3.3,1.6L4.8,27c-0.3,0.4-0.5,1-0.5,1.5C4.4,29,4.6,29.6,5,30l0.5,0.5
	c0.2,0.2,0.3,0.4,0.4,0.7C6,31.3,6,31.6,6,31.9c0,0.3-0.1,0.5-0.2,0.8c-0.1,0.2-0.3,0.5-0.4,0.7l-2.9,2.9c-0.4,0.5-0.7,1-0.9,1.6
	S1.5,39,1.5,39.6l0.8,3.5c0.2,0.6,0.4,1.1,0.9,1.6c0.4,0.5,0.9,0.8,1.5,1l5.1,1.7c1.3,0.4,2.6,0.4,3.9,0.2l6.3-1.5
	c2.2,1.2,4.5,2.9,6.6,4.3c0.3,0.8,0.3,1.7,0.1,2.5c-0.8,2.3-2.5,9.2-4,10.9L16,71.4h38.9l-2.8-4.6c-1.6-3.5-2.6-8.5-2.6-8.5
	c-0.2-0.9-0.1-1.9,0.4-2.8l3.6-7c0.4-0.3,7.7-4.3,7.7-4.3c1-0.5,1.7-0.2,2.8,0.2l4.2,1.6c2.1,0.9,4.3,0.6,5.3-0.7l4.2-5.1
	c0.4-0.5,0.6-1.1,0.7-1.7C78.5,37.8,78.5,37.2,78.2,36.6"
              />
            </svg>
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
      ) : ridesData.length === 0 ? (
        <p>Magic needs to rest too. Try again later</p>
      ) : (
        <div className={styles.scrollableContainer}>
        <table id="dataTable">
          <thead>
            <tr>
              <th
                className={`${styles.sortable} ${styles.attraction}`}
                onClick={sortedField("name")}
              >
                Attraction
              </th>
              <th
                className={`${styles.sortable} ${styles.waitTime}`}
                onClick={sortedField("wait_time")}
              >
                Wait Time
              </th>
              {/* <th
                className={`${styles.sortable} ${styles.isOpen}`}
                onClick={sortedField("is_open")}
              >
                Status
              </th> */}
            </tr>
          </thead>
          <tbody>
            {ridesData.map((ride, index) => (
              <tr key={index}>
                <td className={styles.rideRow}>
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
                <td className={styles.waitRow}>
        {!ride.is_open ? (
          <span className={styles.closed}>CLOSED</span>
        ) : (
          <React.Fragment>
            <span className={styles.bold}>{ride.wait_time}</span> mins
          </React.Fragment>
        )}
      </td>           
{/* <td className={ride.is_open ? styles.open : styles.closed}>
                  {ride.is_open ? "OPEN" : "CLOSED"}
                </td> */}
              </tr>
            ))}
          </tbody>

        </table>
        </div>
  
      )}
            </div>

      <a href="https://queue-times.com/" target="_blank">Powered by Queue-Times.com</a>
    </div>
  );
}

export default WaitTimes;
