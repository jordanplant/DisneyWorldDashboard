import React, { useState, useEffect } from "react";
import styles from "./WaitTimes.module.css";

const allowedRideIds = [146, 138, 133, 137, 130, 134, 140, 129];
// Replace this with the relative URL of your serverless function
const apiUrl = "/api/waitTimes"; // Assuming your serverless function is named waitTimes.js

function WaitTimes() {
  const [ridesData, setRidesData] = useState([]);
  const [ascending, setAscending] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAndDisplayRides = async () => {
    setIsLoading(true); // Set loading to true

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const lands = data.lands;

      const filteredRides = lands.flatMap((land) =>
        land.rides.filter((ride) => allowedRideIds.includes(ride.id))
      );

      const sortedRides = filteredRides.sort((a, b) => {
        if (a.is_open && !b.is_open) {
          return -1;
        } else if (!a.is_open && b.is_open) {
          return 1;
        }
        return a.wait_time - b.wait_time;
      });

      setRidesData(sortedRides);
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setIsLoading(false); // Set loading to false when data is fetched
    }
  };

  const toggleSortOrder = () => {
    setAscending(!ascending);
    setRidesData([...ridesData].reverse());
  };

  const sortedField = (field) => () => {
    const compare = (a, b) => {
      if (field === "name") {
        return a[field].localeCompare(b[field]);
      }
      return a[field] - b[field];
    };

    const sortedRides = ridesData.sort((a, b) =>
      ascending ? compare(a, b) : -compare(a, b)
    );

    setRidesData([...sortedRides]);
    toggleSortOrder();
  };

  const refreshRides = () => {
    // Use the existing ridesData while refreshing
    setIsLoading(true);
    fetchAndDisplayRides();
  };

  useEffect(() => {
    fetchAndDisplayRides();
  }, []);

  return (
    <div className={styles.waitTimes}>
      <div className={styles.refreshContainer}>
        <button className={styles.refreshButton} onClick={refreshRides}>
          <i className="fa-solid fa-rotate-right fa-2xl"></i>
        </button>
      </div>

      {isLoading ? (
        <p className={styles.loadingMessage}>
          <i className="fa-solid fa-wand-magic-sparkles fa-2xl"></i> Conjuring
          Magic...
        </p>
      ) : ridesData.length === 0 ? (
        <p>Magic needs to rest too. Try again later</p>
      ) : (
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
                className={`${styles.sortable} ${styles.waitTimes}`}
                onClick={sortedField("wait_time")}
              >
                Wait Time
              </th>
              <th
                className={`${styles.sortable} ${styles.isOpen}`}
                onClick={sortedField("is_open")}
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {ridesData.map((ride, index) => (
              <tr key={index}>
                <td className={styles.rideRow}>{ride.name}</td>
                <td className={styles.waitRow}>{ride.wait_time} mins</td>
                <td className={ride.is_open ? styles.open : styles.closed}>
                  {ride.is_open ? "OPEN" : "CLOSED"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <a href="https://queue-times.com/">Powered by Queue-Times.com</a>
    </div>
  );
}

export default WaitTimes;
