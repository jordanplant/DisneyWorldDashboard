import React, { useState } from 'react';
import "./Home.css";
import Countdown from "../Components/Countdown/Countdown";
import WeatherApp from "../Components/Weather/WeatherApp";
import SnacksList from "../Components/Snacks/SnacksList";
import WaitTimesAttractions from "../Components/WaitTimes/WaitTimesAttractions";
import TripSetupModal from "../Components/Common/TripSetupModal";
import Navbar from "../Components/Navbar/Navbar";
import ParkSelect from "../Components/Common/ParkSelect";
import WaitTimesShows from "../Components/WaitTimes/WaitTimesShows";
import WaitTimesOpeningHours from '../Components/WaitTimes/WaitTimesOpeningHours';
import WaitTimesNav from '../Components/WaitTimes/WaitTimesNav';
import WaitTimesCharacters from '../Components/WaitTimes/WaitTimesCharacters';
import SnackListNav from '../Components/Snacks/SnackListNav';

function Home() {
  const [user, setUser] = useState(null);
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
  const [activeWaitTimeTab, setActiveWaitTimeTab] = useState('attractions');



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
            <WeatherApp city={selectedCity} />
          </div>
          <div className="openingTimes-bar card">
            <h2 className="text-gradient">Opening Hours</h2>
            <WaitTimesOpeningHours selectedCity={selectedCity} />
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
              selectedPark={selectedPark}
              selectedCity={selectedCity}
            />
          </div>

          <div className="waitTimes-bar card">
            <h2 className="text-gradient">Wait Times</h2>
            <ParkSelect
              selectedPark={selectedPark}
              onParkChange={handleParkChange}
              activePark={activePark} 
            />
        <WaitTimesNav activeTab={activeWaitTimeTab} onTabChange={handleWaitTimeTabChange} />
        {activeWaitTimeTab === 'attractions' && (
          <WaitTimesAttractions selectedPark={activePark} />
        )}
        {activeWaitTimeTab === 'shows' && (
          <>
            <WaitTimesShows selectedPark={activePark} />
          </>
        )}
        {activeWaitTimeTab === 'characters' && (
          <>
          <WaitTimesCharacters selectedPark={activePark}/>
            {/* <WaitTimesShows selectedPark={activePark} /> */}
          </>
        )}
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