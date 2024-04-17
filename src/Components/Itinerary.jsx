import React, { useState, useEffect } from 'react';
import styles from './Itinerary.module.css';
import ButtonContainer from './ButtonContainer';


const isDevelopment = process.env.NODE_ENV === "development";
const apiUrl = isDevelopment
  ? "http://localhost:3000/api"
  : "https://disney-world-dashboard.vercel.app/api";

  const Itinerary = () => {
    const [date, setDate] = useState('2024-06-02');
    const [selectedPark, setSelectedPark] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [activity, setActivity] = useState('');
    const [itinerary, setItinerary] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editedActivity, setEditedActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingAddOrEdit, setLoadingAddOrEdit] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(null);
  
  useEffect(() => {
    fetchItinerary();
  }, [date]);

  const fetchItinerary = async () => {
    setLoading(true); // Start loading when fetching itinerary data
    try {
      const response = await fetch(`${apiUrl}/getItinerary`);
      if (!response.ok) {
        throw new Error('Failed to fetch itinerary');
      }
      const data = await response.json();
      console.log('Fetched itinerary data:', data);
      setItinerary(data);
    } catch (error) {
      console.error('Error fetching itinerary:', error);
    } finally {
      setLoading(false); // Stop loading after fetching itinerary data
    }
  };

  const handleDateChange = (amount) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + amount);
    setDate(newDate.toISOString().split('T')[0]);
  };

  const handleParkChange = (park) => {
    setSelectedPark(park);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  const handleActivityChange = (e) => {
    setActivity(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingAddOrEdit(true); // Start loading when submitting form
    if (selectedPark && selectedTime && activity) {
      try {
        if (editMode) {
          await handleUpdate();
        } else {
          const response = await fetch(`${apiUrl}/createItinerary`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              date: date,
              park: selectedPark,
              time: selectedTime,
              activity: activity,
            }),
          });
    
          if (!response.ok) {
            throw new Error('Failed to add activity to itinerary');
          }
    
          setSelectedPark('');
          setSelectedTime('');
          setActivity('');
          fetchItinerary();
        }
      } catch (error) {
        console.error('Error adding/updating activity to itinerary:', error);
      } finally {
        setLoadingAddOrEdit(false);
      }
    } else {
      alert('Please fill in all fields.');
    }
  };
  
  


  const handleEdit = (activity) => {
    setEditMode(true);
    setEditedActivity(activity);
    setDate(activity.date);
    setSelectedPark(activity.park);
    setSelectedTime(activity.time);
    setActivity(activity.activity);
  };
  
  
  const handleUpdate = async () => {
    setLoadingAddOrEdit(true); // Start loading when updating activity
    try {
      const response = await fetch(`${apiUrl}/updateItinerary`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editedActivity.id,
          date: date,
          park: selectedPark,
          time: selectedTime,
          activity: activity,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update activity in itinerary');
      }
      fetchItinerary();
      setEditMode(false);
      setEditedActivity(null);
      setSelectedPark('');
      setSelectedTime('');
      setActivity('');
    } catch (error) {
      console.error('Error updating activity in itinerary:', error);
    } finally {
      setLoadingAddOrEdit(true); // Stop loading after updating activity
    }
  };
  
  

  const handleDelete = async (id) => {
    setLoadingDelete(id); // Start loading for the specific activity being deleted
    try {
      const response = await fetch(`${apiUrl}/deleteItinerary`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete activity from itinerary');
      }

      fetchItinerary();
    } catch (error) {
      console.error('Error deleting activity from itinerary:', error);
    } finally {
      setLoadingDelete(null); // Stop loading after deleting activity
    }
  };

  

  const noItineraryMessage = (
    <p className={styles.noItinerary}>
      You've got nothing planned for today. lets change that!
    </p>
  );
  

  return (
    <>      
      <div className={styles.itinDateContainer}>
        <button
          className={`${styles.itinDateButton} ${styles.pageLeft}`}
          onClick={() => handleDateChange(-1)}
          disabled={loading}
        >
          <i className="fa-solid fa-arrow-left fa-2xl"></i>
        </button>
        <input
        className={styles.itineraryDate}
          type="date"
          id="itineraryDate"
          name="Itinerary Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          disabled={loading}
        />

        <button
          className={`${styles.itinDateButton} ${styles.pageRight}`}
          onClick={() => handleDateChange(1)}
          disabled={loading}
        >
          <i className="fa-solid fa-arrow-right fa-2xl"></i>

        </button>
      </div>
      <div className={styles.itinParkSelection}>
        <button
          className={`${styles.itinPark} ${
            selectedPark === 'Magic Kingdom' ? styles.itinMkActive : ''
          }`}
          onClick={() => handleParkChange('Magic Kingdom')}
          disabled={loading}
        >
          Magic Kingdom
        </button>
        <button
          className={`${styles.itinPark} ${
            selectedPark === 'Epcot' ? styles.itinEpcotActive : ''
          }`}
          onClick={() => handleParkChange('Epcot')}
          disabled={loading}
        >
          Epcot
        </button>
        <button
          className={`${styles.itinPark} ${
            selectedPark === 'Hollywood Studios' ? styles.itinHsActive : ''
          }`}
          onClick={() => handleParkChange('Hollywood Studios')}
          disabled={loading}
        >
          Hollywood Studios
        </button>
        <button
          className={`${styles.itinPark} ${
            selectedPark === 'Animal Kingdom' ? styles.itinAkActive : ''
          }`}
          onClick={() => handleParkChange('Animal Kingdom')}
          disabled={loading}
        >
          Animal Kingdom
        </button>
      </div>
      <div className={styles.itinFormContainer} onSubmit={handleSubmit}>
        {/* Loading screen while adding/editing activity */}
        {/* {loadingAddOrEdit && <div className={styles.loadingMessage}></div>} */}
        
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
  disabled={loading}
/>
<button className={styles.buttonAdd} type="submit" disabled={loading || loadingAddOrEdit}>
  {loadingAddOrEdit ? (
    <i className="fa-solid fa-spinner fa-spin-pulse fa-xl"/>
  ) : (
    editMode ? "Update" : "Add"
  )}
</button>        </form>
        {/* <p>**ADD PARK TIMES FOR THAT DAY HERE**</p> */}
      </div>

      <div className={styles.itinCalendar}>
  <table className={styles.calendar} id="calendar">
    <tbody className={styles.calDetails}>
      {loading ? (
        // Render loading message
        <tr>
          <td colSpan="3" className={styles.loadingMessage}>
            <p className={styles.loadingMessages}>
              <i className="fa-regular fa-calendar fa-2xl"></i> Loading Itinerary...
            </p>
          </td>
        </tr>
      ) :  (
        // Render itinerary content
        <>
          {/* Iterate over the unique parks in the itinerary */}
          {[...new Set(itinerary.map(activity => activity.park))].map((park, parkIndex) => {
            // Filter activities by the current park and date
            const activitiesForPark = itinerary.filter(activity => activity.park === park && activity.date === date);
            // Check if there are any activities for the current park and date
            if (activitiesForPark.length > 0) {
              return (
                <React.Fragment key={parkIndex}>
                  {/* Render the park name as a group header */}
                  <tr>
                    <td colSpan="3" className={styles.calParkName}>{park}</td>
                  </tr>
                  {/* Map over activities for the current park */}
                  {activitiesForPark.map((activity, index) => (
                    <tr key={index}>
                      <td className={styles.timeColumn}>{activity.time}</td>
                      <td className={styles.activityColumn}>
                        {loadingDelete === activity.id ? "Deleting..." : activity.activity}
                      </td>
                      <td className={styles.editColumn}>
                        <ButtonContainer
                          item={activity}
                          handleUpdate={handleUpdate}
                          handleDelete={handleDelete}
                          handleEdit={() => handleEdit(activity)}
                          isItinerary={true}
                        />
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            }
            // Return null if there are no activities for the current park and date
            return null;
          })}
          {/* Render no itinerary message if there are no activities for the current date */}
          {itinerary.filter(activity => activity.date === date).length === 0 && (
            <tr>
              <td colSpan="3" className={styles.noItinerary}>
                {noItineraryMessage}
              </td>
            </tr>
          )}
        </>
      )}
    </tbody>
  </table>
</div>



    </>
  );
};

export default Itinerary;
