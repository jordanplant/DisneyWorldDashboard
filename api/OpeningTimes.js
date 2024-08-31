import React, { useState, useEffect, useMemo } from "react";
import styles from "./WaitTimes.module.css";

const apiUrl = "/api/OpeningTimes";
const parkIdMapping = {
  MagicKingdom: "75ea578a-adc8-4116-a54d-dccb60765ef9",
  Epcot: "47f90d2c-e191-4239-a466-5892ef59a88b",
  HollywoodStudios: "288747d1-8b4f-4a64-867e-ea7c9b27bad8",
  AnimalKingdom: "1c84a229-8862-4648-9c71-378ddd2c7693",
  DisneylandParkParis: "dae968d5-630d-4719-8b06-3d107e944401",
  WaltDisneyStudiosParis: "ca888437-ebb4-4d50-aed2-d227f7096968",
};

function WaitTimesOpeningHours({ selectedPark }) {
  const [attractionsData, setAttractionsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: "wait_time", direction: "ascending" });
  const [scheduleData, setScheduleData] = useState(null);
  const [loadingSchedule, setLoadingSchedule] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const parkId = parkIdMapping[selectedPark];
    fetchAndDisplayAttractions(parkId);
    fetchAndDisplayOpeningHours(parkId);
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
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      const attractions = (data.liveData || []).filter((attraction) => attraction.entityType === "ATTRACTION");
      setAttractionsData(attractions);
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAndDisplayOpeningHours = async (parkId) => {
    setLoadingSchedule(true);
    if (!parkId) {
      console.log("No park selected.");
      setLoadingSchedule(false);
      return;
    }
    try {
      const response = await fetch(`https://api.themeparks.wiki/v1/entity/${parkId}/schedule`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setScheduleData(data);
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoadingSchedule(false);
    }
  };

  const sortedData = useMemo(() => {
    return [...attractionsData].sort((a, b) => {
      const statusOrder = { "OPERATING": 0, "BOARDING_GROUP": 1, "DOWN": 2, "CLOSED": 3, "REFURBISHMENT": 4 };
      const statusA = a.status || "CLOSED";
      const statusB = b.status || "CLOSED";

      if (statusA !== statusB) return statusOrder[statusA] - statusOrder[statusB];
      if (statusA === "OPERATING") {
        const waitTimeA = a.queue?.STANDBY?.waitTime ? parseInt(a.queue.STANDBY.waitTime, 10) : Infinity;
        const waitTimeB = b.queue?.STANDBY?.waitTime ? parseInt(b.queue.STANDBY.waitTime, 10) : Infinity;
        return (waitTimeA - waitTimeB) * (sortConfig.direction === 'ascending' ? 1 : -1);
      }
      return 0;
    });
  }, [attractionsData, sortConfig]);

  const sortedField = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const calculateNextDays = () => {
    const nextDays = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      nextDays.push(date.toISOString().split("T")[0]);
    }
    return nextDays;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const formatTime = (timestamp, timezone) => {
    let date = new Date(timestamp);
    if (date.getUTCHours() === 0 && timestamp.endsWith("T24:00:00")) {
      date = new Date(date.getTime() + 24 * 60 * 60 * 1000);
    }
    const options = {
      timeZone: timezone,
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleTimeString("en-US", options);
  };

  const nextDays = calculateNextDays();
  const parkTimezone = scheduleData?.timezone || "UTC"; // Default to UTC if timezone is not available

  return (
    <div className={styles.ParkOpeningTimes}>
      {scheduleData ? (
        <>
          <h2>{scheduleData.name}</h2>

          {/* Date selection navbar */}
          <div>
            <div className={styles.ContainerWrapper}>
              <div className={styles.ButtonContainer}>
                {nextDays.map((date) => (
                  <button
                    key={date}
                    onClick={() => handleDateChange(date)}
                    className={date === selectedDate ? styles.activeDate : ""}
                  >
                    {new Date(date).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </button>
                ))}
              </div>

              <div className={styles.TimesContainer}>
                <h3>
                  Park hours for{" "}
                  {new Date(selectedDate).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>

                {/* Early Entry */}
                <div>
                  {scheduleData.schedule
                    .filter(
                      (entry) =>
                        entry.date === selectedDate &&
                        entry.description === "Early Entry"
                    )
                    .map((entry) => (
                      <div key={entry.type}>
                        <p>{entry.description}</p>
                        <p>
                          {formatTime(entry.openingTime, parkTimezone)} -{" "}
                          {formatTime(entry.closingTime, parkTimezone)}
                        </p>
                      </div>
                    ))}
                </div>

                {/* Extra Hours */}
                <div>
                  {scheduleData.schedule.some(
                    (entry) =>
                      entry.date === selectedDate &&
                      entry.type === "EXTRA_HOURS"
                  ) && (
                    <div>
                      {scheduleData.schedule
                        .filter(
                          (entry) =>
                            entry.date === selectedDate &&
                            entry.type === "EXTRA_HOURS"
                        )
                        .map((entry) => (
                          <div key={entry.type}>
                            <p>{entry.description}</p>
                            <p>
                              {formatTime(entry.openingTime, parkTimezone)} -{" "}
                              {formatTime(entry.closingTime, parkTimezone)}
                            </p>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Operating Hours */}
                <div>
                  {scheduleData.schedule
                    .filter(
                      (entry) =>
                        entry.date === selectedDate &&
                        entry.type === "OPERATING"
                    )
                    .map((entry) => (
                      <div key={entry.type}>
                        <p>Park Hours</p>
                        <p>
                          {formatTime(entry.openingTime, parkTimezone)} -{" "}
                          {formatTime(entry.closingTime, parkTimezone)}
                        </p>
                      </div>
                    ))}
                  {scheduleData.schedule.filter(
                    (entry) =>
                      entry.date === selectedDate && entry.type === "OPERATING"
                  ).length === 0 && (
                    <p>No data available for operating hours.</p>
                  )}
                </div>

                {/* Ticketed Event */}
                <div>
                  {scheduleData.schedule
                    .filter(
                      (entry) =>
                        entry.date === selectedDate &&
                        entry.description === "Special Ticketed Event"
                    )
                    .map((entry) => (
                      <div key={entry.type}>
                        <p>{entry.description}</p>
                        <p>
                          {formatTime(entry.openingTime, parkTimezone)} -{" "}
                          {formatTime(entry.closingTime, parkTimezone)}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Loading park information...</p>
      )}
    </div>
  );
}

export default WaitTimesOpeningHours;
