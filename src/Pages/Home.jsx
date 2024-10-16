import React, { useState } from "react";
import styles from "./Pages.module.css";
import Countdown from "../Components/Countdown/Countdown";
import WeatherApp from "../Components/Weather/WeatherApp";
import SnacksList from "../Components/Snacks/SnacksList";
import WaitTimesAttractions from "../Components/WaitTimes/WaitTimesAttractions";
import Navbar from "../Components/Navbar/Navbar";
import ParkSelect from "../Components/Common/ParkSelect";
import WaitTimesShows from "../Components/WaitTimes/WaitTimesShows";
import WaitTimesOpeningHours from "../Components/WaitTimes/WaitTimesOpeningHours";
import WaitTimesCharacters from "../Components/WaitTimes/WaitTimesCharacters";
import TripSetup from "../Components/Common/TripSetup";
import SecondaryNavbar from "../Components/Navbar/SecondaryNavbar";

function Home({ user, setUser }) {
  const [input, setInput] = useState("");
  const [snacks, setSnacks] = useState([]);
  const [editSnack, setEditSnack] = useState(null);
  const [trips, setTrips] = useState([]);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [justLooking, setJustLooking] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Orlando");
  const [selectedPark, setSelectedPark] = useState("Walt Disney World");
  const [activePark, setActivePark] = useState(null);
  const [activeWaitTimeTab, setActiveWaitTimeTab] = useState("attractions");
  const [parkSchedules, setParkSchedules] = useState([]);
  const [activeTab, setActiveTab] = useState("Attractions");
  const waitTimeTabs = ["Favorites", "Attractions", "Shows", "Characters"];

  const handleScheduleDataChange = (newScheduleData) => {
    setParkSchedules(newScheduleData);
  };

  const handleAddTrip = (newTrip) => {
    setTrips([...trips, newTrip]);
    setCurrentTrip(newTrip);
    setSelectedCity(newTrip.city);
    setSelectedPark(newTrip.park);
    setIsModalOpen(false);
    setJustLooking(false);
  };

  const handleJustLooking = () => {
    setJustLooking(true);
    setIsModalOpen(false);
    setCurrentTrip(null);
  };

  const handleParkChange = (parkName) => {
    setActivePark(parkName);
  };

  const handleWaitTimeTabChange = (tab) => {
    setActiveWaitTimeTab(tab);
  };

  return (
    <>
      <main>
        <div className={styles.cardContainers}>
          <div className={`${styles.titleBar} ${styles.card}`}>
            {trips.length === 0 && !justLooking ? (
              <div className={styles.noTrips}>
                <h1 className={styles.textGradient}>You have no trips</h1>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={styles.startTripButton}
                >
                  Start a New Trip
                </button>
                <button
                  onClick={handleJustLooking}
                  className={styles.justLookingButton}
                >
                  I'm just looking
                </button>
              </div>
            ) : (
              <h1 className={styles.textGradient}>
                Your day at <br />{" "}
                {currentTrip ? currentTrip.name : "Disney World"}
              </h1>
            )}
          </div>

          <div className={`${styles.countdownBar} ${styles.card}`}>
            {currentTrip && !justLooking ? (
              <Countdown
                startDate={currentTrip.startDate}
                endDate={currentTrip.endDate}
              />
            ) : (
              <p className={styles.countdownDays}>Days to go</p>
            )}
          </div>

          <div className={`${styles.weatherBar} ${styles.card}`}>
            <WeatherApp city={selectedCity} />
          </div>
          <div className={`${styles.openingTimesBar} ${styles.card}`}>
            <h2 className={styles.textGradient}>Opening Hours</h2>
            <WaitTimesOpeningHours
              selectedCity={selectedCity}
              onScheduleDataChange={handleScheduleDataChange}
            />
          </div>

          <div className={`${styles.snacksBar} ${styles.card}`}>
            <h2 className={styles.textGradient}>Snacks</h2>
            <SnacksList
              input={input}
              setInput={setInput}
              snacks={snacks}
              setSnacks={setSnacks}
              editSnack={editSnack}
              setEditSnack={setEditSnack}
              selectedPark={selectedPark}
              selectedCity={selectedCity}
            />
          </div>

          <div className={`${styles.waitTimesBar} ${styles.card}`}>
            <h2 className={styles.textGradient}>Wait Times</h2>
            <ParkSelect
              selectedPark={selectedPark}
              onParkChange={handleParkChange}
              activePark={activePark}
            />
            <div className={styles.waitTimesNav}>
              <SecondaryNavbar
                tabs={waitTimeTabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>
            {activeWaitTimeTab === "attractions" && (
              <WaitTimesAttractions selectedPark={activePark} />
            )}
            {activeWaitTimeTab === "shows" && (
              <WaitTimesShows selectedPark={activePark} />
            )}
            {activeWaitTimeTab === "characters" && (
              <WaitTimesCharacters selectedPark={activePark} />
            )}
            {activeWaitTimeTab === "Favorites" && (
              <WaitTimesFavourites selectedPark={activePark} />
            )}
          </div>
        </div>
        <div className={styles.footer}>
          <a
            href="https://github.com/jordanplant/DisneyWorldDashboard---JS-React-Node"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-github fa-xl"></i>
          </a>
          <p>v1.3</p>
        </div>
      </main>
      {isModalOpen && !justLooking && (
        <TripSetup
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddTrip}
          onCityChange={(city, park) => {
            setSelectedCity(city);
            setSelectedPark(park);
          }}
        />
      )}
    </>
  );
}

export default Home;