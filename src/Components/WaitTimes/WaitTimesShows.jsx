import React, { useState, useEffect, useMemo } from 'react'; 
import styles from "./WaitTimes.module.css";
import LoadingMessage from '../Common/LoadingMessage';

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
  const [timezone, setTimezone] = useState('America/New_York');
  const [expandedRows, setExpandedRows] = useState([]);

  useEffect(() => {
    const parkId = parkIdMapping[selectedPark];
    if (parkId) {
      setTimezone(parkTimezoneMapping[selectedPark] || 'America/New_York');
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

      const filteredData = (data.liveData || [])
        .filter((item) => item.entityType === "SHOW" && !/(Meet)/i.test(item.name))
        .map((item) => {
          const currentTime = new Date();
          const futureShowtimes = (item.showtimes || []).filter(showtime =>
            new Date(showtime.startTime) > currentTime
          );
          return futureShowtimes.length > 0 ? { ...item, showtimes: futureShowtimes } : null;
        })
        .filter(item => item !== null);

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
      const timeA = a.showtimes?.[0]?.startTime ? getTimeInMinutes(a.showtimes[0].startTime) : Infinity;
      const timeB = b.showtimes?.[0]?.startTime ? getTimeInMinutes(b.showtimes[0].startTime) : Infinity;
      return timeA - timeB;
    });
  }, [data]);

  const formatTime = (time) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
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
    <>
      <button
        className={styles.dropdownButton}
        onClick={() => toggleRowExpansion(itemId)}
      >
        {isExpanded ? (
          <div className={styles.waitDropdown}>
            <i className="fa-solid fa-caret-up"></i>
            <span className={styles.waitDropdownText}>Hide Times</span>
          </div>
        ) : (
          <div className={styles.waitDropdown}>
            <i className="fa-solid fa-caret-down"></i>
            <span className={styles.waitDropdownText}>View More Times</span>
          </div>
        )}
      </button>
      <div className={`${styles.dropdownContent} ${isExpanded ? styles.expanded : ''}`}>
        {/* Additional content related to the dropdown can go here */}
      </div>
    </>
  );

  return (
    <div className={styles.waitTimes}>
      <div className={styles.fixedHeightTable}>
        {isLoading ? (
          <LoadingMessage/>
        ) : data.length === 0 ? (
          <p>No Shows scheduled for today</p>
        ) : (
          <div className={styles.scrollableContainer}>
            <table className={styles.waitTable} id="dataTable">
              <thead>
                <tr>
                  <th className={`${styles.sortable} ${styles.attraction}`}></th>
                  <th className={`${styles.sortable} ${styles.waitTime}`}>
                    Next Show
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData.length === 0 ? (
                  <tr>
                    <td colSpan="2">No Shows scheduled for today</td>
                  </tr>
                ) : (
                  sortedData.map((item) => (
                    <React.Fragment key={item.id}>
                      <tr>
                        <td className={styles.rideName}>
                          <span>
                            {item.name}
                            {item.showtimes?.length > 1 && (
                              <DropdownButton
                                itemId={item.id}
                                isExpanded={expandedRows.includes(item.id)}
                                toggleRowExpansion={toggleRowExpansion}
                              />
                            )}
                          </span>
                        </td>
                        <td className={styles.waitRow}>
                          {item.entityType === "SHOW" && item.showtimes?.length > 0 ? (
                            <>
                              <div className={styles.showtime}>
                                {formatTime(item.showtimes[0].startTime)}
                              </div>
                            </>
                          ) : (
                            <span className={styles.noShowtimes}>No Showtimes</span>
                          )}
                        </td>
                      </tr>
                      {expandedRows.includes(item.id) && (
                        <tr>
                          <td colSpan="2">
                            <div className={styles.expandedShowtimes}>
                              {item.showtimes.slice(1).map((showtime, index) => (
                                <div key={index} className={styles.showtime}>
                                  {formatTime(showtime.startTime)}
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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

export default WaitTimesShows;
