import React, { useState } from 'react';
import styles from "./Itinerary.module.css";

const Itinerary = () => {
  const [activeButton, setActiveButton] = useState(null);
  const [selectedPark, setSelectedPark] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [activity, setActivity] = useState('');
  const [itinerary, setItinerary] = useState([]);

  const handleParkChange = (park) => {
    setSelectedPark(park);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  const handleActivityChange = (e) => {
    setActivity(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedPark && selectedTime && activity) {
      const newEntry = {
        park: selectedPark,
        time: selectedTime,
        activity: activity
      };
      
      const prevEntry = itinerary.length > 0 ? itinerary[itinerary.length - 1] : null;
      const isSamePark = prevEntry && prevEntry.park === selectedPark;
      const isConsecutiveTime = prevEntry && prevEntry.time < selectedTime;

      if (isSamePark && isConsecutiveTime) {
        // Add new entry to the existing group
        setItinerary(prevItinerary => [...prevItinerary, newEntry]);
      } else {
        // Start a new group with the new entry
        setItinerary(prevItinerary => [...prevItinerary, { park: selectedPark }, newEntry]);
      }

      // Clear input fields after submission
      setSelectedPark('');
      setSelectedTime('');
      setActivity('');
    } else {
      // Handle incomplete form submission
      alert('Please fill in all fields.');
    }
  };
  

  const handleButtonClick = (parkName) => {
    setActiveButton(prevActiveButton => prevActiveButton === parkName ? null : parkName);
  };
  

  return (
    <>
      <div className={styles.itinDateContainer}>
        <button className={`${styles.itinDateButton} ${styles.pageLeft}`}>
          <i className="fa-solid fa-arrow-left fa-2xl"></i>
        </button>
        <p className={styles.itinDate}>02/06/23</p>
        <button className={`${styles.itinDateButton} ${styles.pageRight}`}>
          <i className="fa-solid fa-arrow-right fa-2xl"></i>
        </button>
      </div>
      <div className={styles.itinParkSelection}>
      <button
          className={`${styles.itinPark} ${
            selectedPark === "Magic Kingdom" ? styles.itinMkActive : ""
          }`}
          onClick={() => handleParkChange("Magic Kingdom")}
        >
          Magic Kingdom
        </button>
        <button
          className={`${styles.itinPark} ${
            selectedPark === "Epcot" ? styles.itinEpcotActive : ""
          }`}
          onClick={() => handleParkChange("Epcot")}
        >
          Epcot
        </button>
        <button
          className={`${styles.itinPark} ${
            selectedPark === "Hollywood Studios" ? styles.itinHsActive : ""
          }`}
          onClick={() => handleParkChange("Hollywood Studios")}
        >
          Hollywood Studios
        </button>
        <button
          className={`${styles.itinPark} ${
            selectedPark === "Animal Kingdom" ? styles.itinAkActive : ""
          }`}
          onClick={() => handleParkChange("Animal Kingdom")}
        >
          Animal Kingdom
        </button>
      </div>
      <div className={styles.itinFormContainer} onSubmit={handleSubmit}>
        <form className={styles.itinForm}>
        <input
          type="time"
          value={selectedTime}
          onChange={(e) => handleTimeChange(e.target.value)}
          required
        />
        <input
          type="text"
          value={activity}
          onChange={handleActivityChange}
          placeholder="Enter your activities here"
          required
        />
            <button className={styles.buttonAdd} type='submit'>
                
                Add
            </button>



        </form>
        <p>**ADD PARK TIMES FOR THAT DAY HERE**</p>

      

      </div>


      <div className={styles.itinCalendar}>

      <table className={styles.calendar} id='calendar'>
          <thead className={styles.calCategories}>
            <tr>
              <th>Time:</th>
              <th>Activity:</th>
            </tr>
          </thead>
          <tbody className={styles.calDetails}>
          {itinerary.map((entry, index) => {
  if (entry.activity) {
    return (
      <tr key={index}>
        <td>{entry.time}</td>
        <td>{entry.activity}</td>
      </tr>
    );
  } else {
    const headerClass = `${styles.calParkName} ${
      entry.park === "Magic Kingdom" ? styles.magicKingdomHeader :
      entry.park === "Epcot" ? styles.epcotHeader :
      entry.park === "Hollywood Studios" ? styles.hollywoodStudiosHeader :
      entry.park === "Animal Kingdom" ? styles.animalKingdomHeader :
      // Add similar conditions for other parks if needed
      ""
    }`;

    return (
      <tr key={index}>
        <td colSpan="2" className={headerClass}>{entry.park}</td>
      </tr>
    );
  }
})}
          </tbody>
        </table>


      </div>
      
    </>
  );
}

export default Itinerary;
