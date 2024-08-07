import React, { useState } from "react";
import "./PageLayout.css";
import Countdown from "./Countdown";
import WeatherApp from "./WeatherApp";
import SnacksList from "./SnacksList";
import WaitTimes from "./WaitTimes";
import TripSetupModal from "./TripSetupModal";
import Navbar from "./Navbar";

function PageLayout() {
  const [user, setUser] = useState(null);
  const [input, setInput] = useState("");
  const [snacks, setSnacks] = useState([]);
  const [editSnack, setEditSnack] = useState(null);
  const [trips, setTrips] = useState([]);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [justLooking, setJustLooking] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Orlando"); // Add state for selected city

  const handleAddTrip = (newTrip) => {
    setTrips([...trips, newTrip]);
    setCurrentTrip(newTrip);
    setSelectedCity(newTrip.city); // Update city based on trip
    setIsModalOpen(false);
    setJustLooking(false);
  };

  const handleJustLooking = () => {
    setJustLooking(true);
    setIsModalOpen(false);
    setCurrentTrip(null);
  };

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <main>
        <div className="card-containers">
          <div className="title-bar card">
            {trips.length === 0 && !justLooking ? (
              <div className="no-trips">
                <h1 className="text-gradient">You have no trips</h1>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="start-trip-button"
                >
                  Start a New Trip
                </button>
                <button
                  onClick={handleJustLooking}
                  className="just-looking-button"
                >
                  I'm just looking
                </button>
              </div>
            ) : (
              <h1 className="text-gradient">
                Your day at <br />{" "}
                {currentTrip ? currentTrip.name : "Disney World"}
              </h1>
            )}
          </div>

          <div className="countdown-bar card">
            {currentTrip && !justLooking ? (
              <Countdown
                startDate={currentTrip.startDate}
                endDate={currentTrip.endDate}
              />
            ) : (
              <p className="countdownDays">Days to go</p>
            )}
          </div>

          <div className="weather-bar card">
            <WeatherApp city={selectedCity} />{" "}
            {/* Pass selected city to WeatherApp */}
          </div>

          <div className="snacks-bar card">
            <h2 className="text-gradient">Snacks</h2>
            <SnacksList
              input={input}
              setInput={setInput}
              snacks={snacks}
              setSnacks={setSnacks}
              editSnack={editSnack}
              setEditSnack={setEditSnack}
            />
          </div>

          <div className="waitTimes-bar card">
            <h2 className="text-gradient">Wait Times</h2>
            <WaitTimes />
          </div>
        </div>
        <div className="footer">
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
        <TripSetupModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddTrip} // Pass handleAddTrip directly
          onCityChange={setSelectedCity} // Pass setSelectedCity directly
        />
      )}
    </>
  );
}

export default PageLayout;
