import React, { useState, useEffect } from "react";
import styles from "./WaitTimes.module.css";

const locationParkMapping = {
  "Orlando": [
    "75ea578a-adc8-4116-a54d-dccb60765ef9", // Magic Kingdom
    "47f90d2c-e191-4239-a466-5892ef59a88b", // Epcot
    "288747d1-8b4f-4a64-867e-ea7c9b27bad8", // Hollywood Studios
    "1c84a229-8862-4648-9c71-378ddd2c7693", // Animal Kingdom
  ],
  "Paris": [
    "dae968d5-630d-4719-8b06-3d107e944401", // Disneyland Park Paris
    "ca888437-ebb4-4d50-aed2-d227f7096968", // Walt Disney Studios Paris
  ],
  // Add more locations and park IDs as needed
};

const parkNameMapping = {
  "Disney's Hollywood Studios": "Hollywood Studios",
  "Magic Kingdom Park": "Magic Kingdom",
  "EPCOT": "Epcot",
  "Disney's Animal Kingdom Theme Park": "Animal Kingdom",

  // Add any other variations you need
};

function WaitTimesOpeningHours({ selectedCity }) {
  const [scheduleData, setScheduleData] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const parkIds = locationParkMapping[selectedCity];
    if (parkIds) {
      fetchAndDisplayOpeningHours(parkIds);
    }
  }, [selectedCity]);

  const fetchAndDisplayOpeningHours = async (parkIds) => {
    setLoadingSchedule(true);
    if (!parkIds || parkIds.length === 0) {
      console.log("No parks available for this location.");
      setLoadingSchedule(false);
      return;
    }

    try {
      const fetchPromises = parkIds.map((parkId) =>
        fetch(`https://api.themeparks.wiki/v1/entity/${parkId}/schedule`).then((response) => response.json())
      );
      const data = await Promise.all(fetchPromises);

      // Apply renaming
      const renamedData = data.map(parkSchedule => ({
        ...parkSchedule,
        name: parkNameMapping[parkSchedule.name] || parkSchedule.name
      }));
      
      setScheduleData(renamedData);
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoadingSchedule(false);
    }
  };

  const calculateNextDays = () => {
    const nextDays = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      nextDays.push({
        date: date.toISOString().split("T")[0],
        formattedDate: date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
        dayName: date.toLocaleDateString("en-GB", { weekday: "short" })
      });
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

  return (
    <div className={styles.ParkOpeningTimes}>
      {loadingSchedule ? (
        <p>Loading park information...</p>
      ) : (
        <>
          {/* Date selection navbar */}
          <div className={styles.openingHoursContainer}>
            <div className={styles.ButtonContainer}>
              {nextDays.map(({ date, formattedDate, dayName }) => (
                <div className={styles.dateButtonContainer}>
                <button
                  key={date}
                  onClick={() => handleDateChange(date)}
                  className={date === selectedDate ? styles.active : ""}
                >
                  {formattedDate}
                </button>
                <p className={date === selectedDate ? styles.active : ""}>{dayName}</p>
                </div>
              ))}
            </div>
            <div className={styles.TimesContainer}>
              {scheduleData.map((parkSchedule) => (
                <div key={parkSchedule.id}>
<h3 className={styles.gridParkName}>{parkSchedule.name}</h3>                  
{/* EARLY ENTRY */}
                  <div>
                    {parkSchedule.schedule
                      .filter(
                        (entry) =>
                          entry.date === selectedDate &&
                          entry.description === "Early Entry"
                      )
                      .map((entry) => (
                        <div key={entry.type}>
                          <p className={styles.entryDescription}>{entry.description}</p>
                          <p className={styles.entryTime}>
                            {formatTime(entry.openingTime, parkSchedule.timezone)} -{" "}
                            {formatTime(entry.closingTime, parkSchedule.timezone)}
                          </p>
                        </div>
                      ))}
                  </div>
                  {/* EXTRA HOURS */}
                  {parkSchedule.schedule.some(
                    (entry) =>
                      entry.date === selectedDate && entry.type === "EXTRA_HOURS"
                  ) && (
                    <div>
                      {parkSchedule.schedule
                        .filter(
                          (entry) =>
                            entry.date === selectedDate &&
                            entry.type === "EXTRA_HOURS"
                        )
                        .map((entry) => (
                          <div key={entry.type}>
                            <p className={styles.entryDescription}>{entry.description}</p>
                            <p className={styles.entryTime}>
                              {formatTime(entry.openingTime, parkSchedule.timezone)} -{" "}
                              {formatTime(entry.closingTime, parkSchedule.timezone)}
                            </p>
                          </div>
                        ))}
                    </div>
                  )}
                  {/* OPERATING HOURS */}
                  <div>
                    {parkSchedule.schedule
                      .filter(
                        (entry) =>
                          entry.date === selectedDate && entry.type === "OPERATING"
                      )
                      .map((entry) => (
                        <div key={entry.type}>
                          <p className={styles.entryDescription}>Park Hours</p>
                          <p className={styles.entryTime}>
                            {formatTime(entry.openingTime, parkSchedule.timezone)} -{" "}
                            {formatTime(entry.closingTime, parkSchedule.timezone)}
                          </p>
                        </div>
                      ))}
                    {parkSchedule.schedule.filter(
                      (entry) =>
                        entry.date === selectedDate && entry.type === "OPERATING"
                    ).length === 0 && <p>No data available for operating hours.</p>}
                  </div>
            {/* EXTENDED EVENING */}
            <div>
                    {parkSchedule.schedule
                      .filter(
                        (entry) =>
                          entry.date === selectedDate &&
                          entry.description === "Extended Evening"
                      )
                      .map((entry) => (
                        <div key={entry.type}>
                          <p className={styles.entryDescription}>
                            {entry.description}
                          </p>
                          <p className={styles.entryTime}>
                            {formatTime(entry.openingTime, parkSchedule.timezone)}{" "}
                            -{" "}
                            {formatTime(entry.closingTime, parkSchedule.timezone)}
                          </p>
                        </div>
                      ))}
                  </div>
                  {/* TICKETED EVENT */}
                  <div>
                    {parkSchedule.schedule
                      .filter(
                        (entry) =>
                          entry.date === selectedDate &&
                          entry.description === "Special Ticketed Event"
                      )
                      .map((entry) => (
                        <div key={entry.type}>
                          <p className={styles.entryDescription}>{entry.description}</p>
                          <p className={styles.entryTime}>
                            {formatTime(entry.openingTime, parkSchedule.timezone)} -{" "}
                            {formatTime(entry.closingTime, parkSchedule.timezone)}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default WaitTimesOpeningHours;
