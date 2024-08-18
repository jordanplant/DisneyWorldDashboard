import React, { useState, useEffect, useMemo } from "react";
import styles from "./WaitTimes.module.css";

const apiUrl = "/api/waitTimesV2";
const parkIdMapping = {
  MagicKingdom: "75ea578a-adc8-4116-a54d-dccb60765ef9",
  Epcot: "47f90d2c-e191-4239-a466-5892ef59a88b",
  HollywoodStudios: "288747d1-8b4f-4a64-867e-ea7c9b27bad8",
  AnimalKingdom: "1c84a229-8862-4648-9c71-378ddd2c7693",
  DisneylandParkParis: "dae968d5-630d-4719-8b06-3d107e944401",
  WaltDisneyStudiosParis: "ca888437-ebb4-4d50-aed2-d227f7096968",
};

const parkTimezoneMapping = {
  MagicKingdom: 'America/New_York',
  Epcot: 'America/New_York',
  HollywoodStudios: 'America/New_York',
  AnimalKingdom: 'America/New_York',
  DisneylandParkParis: 'Europe/Paris',
  WaltDisneyStudiosParis: 'Europe/Paris',
};

function WaitTimesShows({ selectedPark }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: "wait_time", direction: "ascending" });
  const [timezone, setTimezone] = useState('America/New_York'); // Default timezone

  useEffect(() => {
    const parkId = parkIdMapping[selectedPark];
    if (parkId) {
      setTimezone(parkTimezoneMapping[selectedPark] || 'America/New_York'); // Set timezone based on park
      fetchAndDisplayData(parkId);
    }
  }, [selectedPark]);

  const fetchAndDisplayData = async (parkId) => {
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}?parkId=${parkId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      const filteredData = (data.liveData || []).filter(
        (item) => item.entityType === "SHOW" && !/(Meet)/i.test(item.name)
      );

      setData(filteredData);
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeInMinutes = (time) => {
    const date = new Date(time);
    return date.getHours() * 60 + date.getMinutes();
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const statusOrder = { "OPERATING": 0, "BOARDING_GROUP": 1, "DOWN": 2, "CLOSED": 3, "REFURBISHMENT": 4 };
      const statusA = a.status || "CLOSED";
      const statusB = b.status || "CLOSED";

      if (statusA !== statusB) {
        return statusOrder[statusA] - statusOrder[statusB];
      }

      if (sortConfig.key === 'wait_time' && sortConfig.direction === 'ascending') {
        const timeA = a.showtimes?.[0]?.startTime ? getTimeInMinutes(a.showtimes[0].startTime) : Infinity;
        const timeB = b.showtimes?.[0]?.startTime ? getTimeInMinutes(b.showtimes[0].startTime) : Infinity;
        return timeA - timeB;
      }

      return 0;
    });
  }, [data, sortConfig]);

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

  const formatTime = (time) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: timezone,
    }).format(new Date(time));
  };

  return (
    <div className={styles.waitTimes}>
      <div className={styles.fixedHeightTable}>
        {isLoading ? (
          <p className={styles.loadingMessage}>
            <i className="fa-solid fa-wand-magic-sparkles fa-2xl"></i> Conjuring Magic...
          </p>
        ) : data.length === 0 ? (
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
                    
                  </th>
                  <th
                    className={`${styles.sortable} ${styles.waitTime}`}
                    onClick={() => sortedField('wait_time')}
                  >
                    Next Show
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData.length === 0 ? (
                  <tr>
                    <td colSpan="2">Magic needs to rest too. Try again later</td>
                  </tr>
                ) : (
                  sortedData.map((item) => (
                    <tr key={item.id}>
                      <td className={styles.rideName}>
                        {item.name.includes(' - ')
                          ? item.name.split(' - ').map((part, index, array) =>
                              index < array.length - 1 ? (
                                <React.Fragment key={index}>
                                  {part}
                                  <br />-{' '}
                                </React.Fragment>
                              ) : (
                                part
                              )
                            )
                          : item.name}
                      </td>
                      <td className={styles.waitRow}>
                        {item.entityType === "SHOW" ? (
                          item.showtimes?.length > 0 ? (
                            item.showtimes.map((showtime, index) => (
                              <div key={index} className={styles.showtime}>
                                {formatTime(showtime.startTime)}
                              </div>
                            ))
                          ) : (
                            <span className={styles.noShowtimes}>No Showtimes</span>
                          )
                        ) : null}
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

// TO ADD: only show the next show time on the right, have a dropdown to view more times today (only remaning and only if more than one show)

export default WaitTimesShows;
