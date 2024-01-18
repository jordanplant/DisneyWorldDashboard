import React, { useState } from "react";
import "./PageLayout.css";
import Countdown from "./Countdown";
import WeatherApp from "./WeatherApp";
import SnacksList from "./SnacksList";

import WaitTimes from "./WaitTimes";

function PageLayout() {
  const [input, setInput] = useState("");
  const [snacks, setSnacks] = useState([]);
  const [editSnack, setEditSnack] = useState(null);

  return (
    <>
      <main>
        <div className="card-containers">
          <div className="title-bar card">
            <h1 className="text-gradient">Hello Disney World</h1>
            <NavBar />
          </div>
          <div className="countdown-bar card">
            <h2 className="text-gradient">Days to go</h2>
            <Countdown />
          </div>
          <div className="weather-bar card">
            <h2 className="text-gradient">Weather</h2>
            <WeatherApp />
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
      </main>
      <footer></footer>
    </>
  );
}

export default PageLayout;
