import React, { useState, useEffect, useMemo } from "react";
import styles from "./WaitTimes.module.css";
import LoadingMessage from "../Common/LoadingMessage";

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
  MagicKingdom: "America/New_York",
  Epcot: "America/New_York",
  HollywoodStudios: "America/New_York",
  AnimalKingdom: "America/New_York",
  DisneylandParkParis: "Europe/Paris",
  WaltDisneyStudiosParis: "Europe/Paris",
};

function WaitTimesCharacters({ selectedPark }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timezone, setTimezone] = useState("America/New_York");
  const [expandedRows, setExpandedRows] = useState([]);

  useEffect(() => {
    const parkId = parkIdMapping[selectedPark];
    if (parkId) {
      setTimezone(parkTimezoneMapping[selectedPark] || "America/New_York");
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
  
      const currentTime = new Date();
      
      const filteredData = (data.liveData || [])
        .filter((item) => item.entityType === "SHOW" && /(Meet)/i.test(item.name))
        .map((item) => {
          const showtimes = item.showtimes || [];
          const hasQueueTime = item.queue?.STANDBY?.waitTime != null;
          
          // Filter showtimes to include only those in the future or the current time
          const futureShowtimes = showtimes.filter(
            (showtime) => new Date(showtime.startTime) >= currentTime
          );
          
          // Determine whether to display the item based on queue time or showtimes
          const displayItem = hasQueueTime || futureShowtimes.length > 0;
          
          return displayItem ? {
            ...item,
            showtimes: futureShowtimes.length > 0 ? futureShowtimes : showtimes,
            waitTime: item.queue?.STANDBY?.waitTime || "N/A",
            isPastClosing: showtimes.every((showtime) => new Date(showtime.endTime) < currentTime),
          } : null;
        })
        .filter((item) => item !== null);
  
      console.log("Filtered Character data:", filteredData);
  
      setData(filteredData);
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeInMinutes = (time) => {
    const date = new Date(time);
    return date.getTime();
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const timeA = a.showtimes?.[0]?.startTime
        ? getTimeInMinutes(a.showtimes[0].startTime)
        : Infinity;
      const timeB = b.showtimes?.[0]?.startTime
        ? getTimeInMinutes(b.showtimes[0].startTime)
        : Infinity;
      return timeA - timeB;
    });
  }, [data]);

  const formatTime = (time) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: timezone,
    }).format(new Date(time));
  };

  const toggleRowExpansion = (id) => {
    setExpandedRows((prevExpandedRows) =>
      prevExpandedRows.includes(id)
        ? prevExpandedRows.filter((rowId) => rowId !== id)
        : [...prevExpandedRows, id]
    );
  };

  const DropdownButton = ({ itemId, isExpanded, toggleRowExpansion }) => (
    <button
      className={styles.dropdownButton}
      onClick={() => toggleRowExpansion(itemId)}
    >
      {isExpanded ? (
        <div className={styles.waitDropdown}>
          <i className="fa-solid fa-caret-up"></i>
          <span className={styles.waitDropdownText}>Hide Appearances</span>
        </div>
      ) : (
        <div className={styles.waitDropdown}>
          <i className="fa-solid fa-caret-down"></i>
          <span className={styles.waitDropdownText}>View More Appearances</span>
        </div>
      )}
    </button>
  );

  return (
    <div className={styles.waitTimes}>
      <div className={styles.fixedHeightTable}>
        {isLoading ? (
          <LoadingMessage />
        ) : data.length === 0 ? (
          <p>No Characters scheduled for today</p>
        ) : (
          <div className={styles.scrollableContainer}>
            <table className={styles.waitTable} id="dataTable">
              <thead>
                <tr>
                  <th className={`${styles.sortable} ${styles.character}`}>
                    Character
                  </th>
                  <th className={`${styles.sortable} ${styles.waitTime}`}>
                    Next Appearance
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData.length === 0 ? (
                  <tr>
                    <td colSpan="2">No Characters scheduled for today</td>
                  </tr>
                ) : (
                  sortedData.map((item) => {
                    const hasMoreShowtimes = item.showtimes.length > 1;
                    const primaryShowtime = item.showtimes[0];
                    const additionalShowtimes = item.showtimes.slice(1);

                    return (
                      <React.Fragment key={item.id}>
                        <tr>
                          <td className={styles.characterName}>
                            <span>
                              {item.name}
                              {hasMoreShowtimes && (
                                <DropdownButton
                                  itemId={item.id}
                                  isExpanded={expandedRows.includes(item.id)}
                                  toggleRowExpansion={toggleRowExpansion}
                                />
                              )}
                            </span>
                          </td>
                          <td className={styles.waitRow}>
                            {item.queue?.STANDBY?.waitTime != null ? (
                              // Display wait time if available
                              <>
                                <div className={styles.waitTime}>
                                  <span className={styles.bold}>
                                    {item.queue.STANDBY.waitTime}
                                  </span>{" "}
                                  mins
                                </div>
                              </>
                            ) : (
                              <>
                                {primaryShowtime ? (
                                  <div className={styles.showtime}>
                                    {primaryShowtime.startTime === primaryShowtime.endTime ? (
                                      // Only display start time if start and end times are the same
                                      formatTime(primaryShowtime.startTime)
                                    ) : (
                                      // Display both start and end times
                                      <>
                                        {formatTime(primaryShowtime.startTime)} -{" "}
                                        {formatTime(primaryShowtime.endTime)}
                                      </>
                                    )}
                                  </div>
                                ) : (
                                  <span className={styles.noAppearances}>
                                    No Appearances
                                  </span>
                                )}
                              </>
                            )}
                          </td>
                        </tr>
                        {expandedRows.includes(item.id) && additionalShowtimes.length > 0 && (
                          <tr>
                            <td colSpan="2">
                              <div className={styles.expandedShowtimes}>
                                {additionalShowtimes.map((showtime, index) => (
                                  <div key={index} className={styles.showtime}>
                                    {showtime.startTime === showtime.endTime ? (
                                      formatTime(showtime.startTime)
                                    ) : (
                                      <>
                                        {formatTime(showtime.startTime)} -{" "}
                                        {formatTime(showtime.endTime)}
                                      </>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default WaitTimesCharacters;
