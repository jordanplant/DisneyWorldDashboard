import React, { useState } from "react";
import styles from "./TripStats.module.css"; // New styles for TripStats
import Accordion from "../Common/Accordion"; // Import an Accordion component if you have one

const TripStats = () => {
  // Placeholder data for your trips
  const [trips] = useState([
    {
      id: 1,
      name: "Walt Disney World",
      startDate: "2024-06-02",
      endDate: "2024-06-15",
      details: "Stayed at the Polynesian Resort, visited Magic Kingdom and EPCOT."
    },
    {
      id: 2,
      name: "Disneyland Paris",
      startDate: "2024-09-13",
      endDate: "2024-09-13",
      details: "Attended Mickey's Not-So-Scary Halloween Party, stayed at the Disneyland Hotel."
    },
    {
        id: 3,
        name: "Walt Disney World",
        startDate: "2022-09-23",
        endDate: "2024-10-09",
        details: "Attended Mickey's Not-So-Scary Halloween Party, stayed at the Disneyland Hotel."
      },

    {
        id: 4,
        name: "Disneyland Paris",
        startDate: "2022-01-24",
        endDate: "2022-01-25",
        details: "Attended Mickey's Not-So-Scary Halloween Party, stayed at the Disneyland Hotel."
      },
      {
        id: 5,
        name: "Disneyland California",
        startDate: "2019-09-16",
        endDate: "2029-09-17",
        details: "Attended Mickey's Not-So-Scary Halloween Party, stayed at the Disneyland Hotel."
      },
  ]);

  return (
    <div>
      <ul className={styles.tripList}>
        {trips.map((trip) => (
          <li key={trip.id} className={styles.tripListItem}>
            <Accordion
              title={
                <div className={styles.tripDetails}>
                  <span className={styles.tripName}>{trip.name}</span>
                  <span className={styles.tripDates}>
                    {trip.startDate} - {trip.endDate}
                  </span>
                </div>
              }
            >
              <p>{trip.details}</p>
            </Accordion>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TripStats;
