import React, { useState, useEffect } from "react";
import styles from "./WaitTimes.module.css";
import Events from "../Services/Events";
import ParkIcons from "../Common/Icons";
import ButtonContainer from "../Common/ButtonContainer";

// Mapping configurations
const locationParkMapping = {
  Orlando: [
    "75ea578a-adc8-4116-a54d-dccb60765ef9", // Magic Kingdom
    "47f90d2c-e191-4239-a466-5892ef59a88b", // Epcot
    "288747d1-8b4f-4a64-867e-ea7c9b27bad8", // Hollywood Studios
    "1c84a229-8862-4648-9c71-378ddd2c7693", // Animal Kingdom
    "b070cbc5-feaa-4b87-a8c1-f94cca037a18", // Typhoon Lagoon
    "ead53ea5-22e5-4095-9a83-8c29300d7c63", // Blizzard Beach
  ],
  Paris: [
    "dae968d5-630d-4719-8b06-3d107e944401", // Disneyland Park Paris
    "ca888437-ebb4-4d50-aed2-d227f7096968", // Walt Disney Studios Paris
  ],
  // Add more locations and park IDs as needed
};

const parkNameMapping = {
  "Magic Kingdom Park": "Magic Kingdom",
  "EPCOT": "Epcot",
  "Disney's Hollywood Studios": "Hollywood Studios",
  "Disney's Animal Kingdom Theme Park": "Animal Kingdom",
  "Disney's Typhoon Lagoon Water Park": "Typhoon Lagoon Water Park",
  "Disney's Blizzard Beach Water Park": "Blizzard Beach Water Park",
  // Add any other variations you need
};

const parkIconMapping = {
  "Magic Kingdom": ParkIcons.MagicKingdom,
  Epcot: ParkIcons.Epcot,
  "Hollywood Studios": ParkIcons.HollywoodStudios,
  "Animal Kingdom": ParkIcons.AnimalKingdom,
  "Disneyland Park": ParkIcons.DisneylandParkParis,
  "Walt Disney Studios Park": ParkIcons.WaltDisneyStudiosParis,
  "Typhoon Lagoon Water Park": ParkIcons.TypoonLagoon,
  "Blizzard Beach Water Park": ParkIcons.BlizzardBeach,
};

const getEventDetails = (date, park) => {
  const findEvent = (eventData) => {
    if (eventData && eventData.dates && eventData.dates.includes(date) && eventData.park === park) {
      return {
        eventName: eventData.eventName,
        park: eventData.park,
      };
    }
    return null;
  };

  const events = [
    {
      dates: Events.mnsshp?.dates || [],
      eventName: "Mickey's Not-So-Scary Halloween Party",
      park: Events.mnsshp?.park,
    },
    {
      dates: Events.mvmp?.dates || [],
      eventName: "Mickey's Very Merry Christmas Party",
      park: Events.mvmp?.park,
    },
    {
      dates: Events.djn?.dates || [],
      eventName: "Disney Jollywood Nights",
      park: Events.djn?.park,
    },
    {
      dates: Events.mkafterhours?.dates || [],
      eventName: "Disney After Hours",
      park: Events.mkafterhours?.park,
    },
    {
      dates: Events.epcotafterhours?.dates || [],
      eventName: "Disney After Hours",
      park: Events.epcotafterhours?.park,
    },
    {
      dates: Events.hsafterhours?.dates || [],
      eventName: "Disney After Hours",
      park: Events.hsafterhours?.park,
    },
  ];

  for (const event of events) {
    const details = findEvent(event);
    if (details) return details;
  }

  return null;
};



// Component definition
function WaitTimesOpeningHours({ selectedCity }) {
  const [scheduleData, setScheduleData] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [expandedParkIds, setExpandedParkIds] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const parkIds = locationParkMapping[selectedCity];
    if (parkIds) fetchAndDisplayOpeningHours(parkIds);
  }, [selectedCity]);

  const fetchAndDisplayOpeningHours = async (parkIds) => {
    setLoadingSchedule(true);
    setError(null);
    if (!parkIds.length) {
      console.log("No parks available for this location.");
      setLoadingSchedule(false);
      return;
    }

    try {
      const fetchPromises = parkIds.map(async (parkId) => {
        const response = await fetch(`/api/OpeningTimes?parkId=${parkId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
        }
        return response.json();
      });

      const data = await Promise.all(fetchPromises);

      // Rename park names and log for verification
      const renamedData = data.map((parkSchedule) => ({
        ...parkSchedule,
        name: parkNameMapping[parkSchedule.name] || parkSchedule.name,
      }));

      console.log("Renamed Park Data:", renamedData);
      setScheduleData(renamedData);
    } catch (error) {
      console.error("An error occurred:", error);
      setError(error.message);
    } finally {
      setLoadingSchedule(false);
    }
  };

// Calculate next 5 days
const calculateNextDays = () => {
  const nextDays = [];
  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    // Format the date for display
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });

    // Ensure the month is always 3 characters long
    const [day, month] = formattedDate.split(" ");
    const modifiedMonth = month.slice(0, 3); // Get first 3 characters

    nextDays.push({
      date: date.toISOString().split("T")[0],
      formattedDate: `${day} ${modifiedMonth}`, // Combine day and modified month
      dayName: date.toLocaleDateString("en-GB", { weekday: "short" }),
    });
  }
  return nextDays;
};

// Example usage
console.log(calculateNextDays());


  const handleDateChange = (date) => setSelectedDate(date);

  // Format time according to timezone
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

  // Toggle expanded view for park details
  const toggleExpanded = (parkId) => {
    setExpandedParkIds((prevState) => ({
      ...prevState,
      [parkId]: !prevState[parkId],
    }));
  };

  const hasAdditionalTimes = (parkSchedule, selectedDate) => {
    return parkSchedule.schedule.some(
      (entry) =>
        entry.date === selectedDate &&
        (entry.description === "Early Entry" ||
          entry.type === "EXTRA_HOURS" ||
          entry.description === "Extended Evening" ||
          entry.description === "Special Ticketed Event")
    );
  };

  // Generate next days for date buttons
  const nextDays = calculateNextDays();

  return (
    <div className={styles.ParkOpeningTimes}>
      {loadingSchedule ? (
        <p>Loading park information...</p>
      ) : (
        <div className={styles.openingHoursContainer}>
          <div className={styles.ButtonContainer}>
            {nextDays.map(({ date, formattedDate, dayName }) => (
              <div className={styles.dateButtonContainer} key={date}>
                <button
                  onClick={() => handleDateChange(date)}
                  className={date === selectedDate ? styles.active : ""}
                >
                  {formattedDate}
                  <span className={date === selectedDate ? styles.active : ""}>
                    {dayName}
                  </span>
                </button>
              </div>
            ))}
          </div>
          <div className={styles.TimesContainer}>
            {scheduleData.map((parkSchedule) => {
              const ParkIcon = parkIconMapping[parkSchedule.name];
              const isExpanded = expandedParkIds[parkSchedule.id] || false;
              const showExpandButton = hasAdditionalTimes(
                parkSchedule,
                selectedDate
              );
              return (
                <div
                  className={styles.themeParkOpeningHours}
                  key={parkSchedule.id}
                >
                  <div className={styles.parkDetails}>
                    <div className={styles.parkAndOperating}>
                      <div className={styles.iconAndPark}>
                        {ParkIcon && <ParkIcon active={false} />}
                        <div className={styles.parkAndHours}>
                          <h3 className={styles.parkName}>
                            {parkSchedule.name}
                          </h3>
                          <div className={styles.operatingHours}>
                            {parkSchedule.schedule
                              .filter(
                                (entry) =>
                                  entry.date === selectedDate &&
                                  entry.type === "OPERATING"
                              )
                              .map((entry) => (
                                <div key={entry.type}>
                                  <p className={styles.operatingEntryTime}>
                                    {formatTime(
                                      entry.openingTime,
                                      parkSchedule.timezone
                                    )}{" "}
                                    -{" "}
                                    {formatTime(
                                      entry.closingTime,
                                      parkSchedule.timezone
                                    )}
                                  </p>
                                </div>
                              ))}
                            {!parkSchedule.schedule.some(
                              (entry) =>
                                entry.date === selectedDate &&
                                entry.type === "OPERATING"
                            ) && (
                              <p className={`${styles.operatingClosed}`}>
                                Closed Today
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {showExpandButton && (
                      <div className={styles.dropdownButtonContainer}>
                        <ButtonContainer
                          onClick={() => toggleExpanded(parkSchedule.id)}
                          isExpanded={isExpanded}
                        />
                      </div>
                    )}
                  </div>
  
                  {isExpanded && (
                    <div className={styles.expandedHours}>
                      {/* EARLY ENTRY */}
                      {parkSchedule.schedule
                        .filter(
                          (entry) =>
                            entry.date === selectedDate &&
                            entry.description === "Early Entry"
                        )
                        .map((entry) => (
                          <div key={entry.type}>
                            <p className={styles.entryDescription}>
                              {entry.description}
                            </p>
                            <p className={styles.entryTime}>
                              {formatTime(
                                entry.openingTime,
                                parkSchedule.timezone
                              )}{" "}
                              -{" "}
                              {formatTime(
                                entry.closingTime,
                                parkSchedule.timezone
                              )}
                            </p>
                          </div>
                        ))}
                      {/* EXTRA HOURS */}
                      {parkSchedule.schedule.some(
                        (entry) =>
                          entry.date === selectedDate &&
                          entry.type === "EXTRA_HOURS"
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
                                <p className={styles.entryDescription}>
                                  {entry.description}
                                </p>
                                <p className={styles.entryTime}>
                                  {formatTime(
                                    entry.openingTime,
                                    parkSchedule.timezone
                                  )}{" "}
                                  -{" "}
                                  {formatTime(
                                    entry.closingTime,
                                    parkSchedule.timezone
                                  )}
                                </p>
                              </div>
                            ))}
                        </div>
                      )}
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
                                {formatTime(
                                  entry.openingTime,
                                  parkSchedule.timezone
                                )}{" "}
                                -{" "}
                                {formatTime(
                                  entry.closingTime,
                                  parkSchedule.timezone
                                )}
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
                          .map((entry) => {
                            const eventDetails = getEventDetails(entry.date, parkSchedule.name);
                            const eventName = eventDetails?.eventName || entry.description;
  
                            return (
                              <div key={entry.type}>
                                <p className={styles.entryDescription}>
                                  {eventName}
                                </p>
                                <p className={styles.entryTime}>
                                  {formatTime(entry.openingTime, parkSchedule.timezone)} - {formatTime(entry.closingTime, parkSchedule.timezone)}
                                </p>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}  

export default WaitTimesOpeningHours;
