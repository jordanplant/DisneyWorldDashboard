import React, { useState } from 'react';
import styles from "./Itinerary.module.css";

const Itinerary = () => {
  const [activeButton, setActiveButton] = useState(null);

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
            activeButton === "itinMk" ? styles.itinMkActive : ""
          }`}
          onClick={() => handleButtonClick("itinMk")}
        >
          Magic Kingdom
        </button>
        <button
          className={`${styles.itinPark} ${
            activeButton === "itinEpcot" ? styles.itinEpcotActive : ""
          }`}
          onClick={() => handleButtonClick("itinEpcot")}
        >
          Epcot
        </button>
        <button
          className={`${styles.itinPark} ${
            activeButton === "itinHs" ? styles.itinHsActive : ""
          }`}
          onClick={() => handleButtonClick("itinHs")}
        >
          Hollywood Studios
        </button>
        <button
          className={`${styles.itinPark} ${
            activeButton === "itinAk" ? styles.itinAkActive : ""
          }`}
          onClick={() => handleButtonClick("itinAk")}
        >
          Animal Kingdom
        </button>
      </div>
      <div className={styles.itinFormContainer}>
        <form className={styles.itinForm}>
            <input
            type="time"
            required/>
            <input type='text'
                      placeholder="Enter your activities here"
              required/>
            <button className={styles.buttonAdd} type='submit'>
                
                add
            </button>



        </form>
        <p>**ADD PARK TIMES FOR THAT DAY HERE**</p>

      {/* <form className={styles.formBar} onSubmit={onFormSubmit}>
        <input
          type="text"
          placeholder="Enter your snacks here"
          className={styles.taskInput}
          value={input}
          required
          onChange={onInputChange}
        />
        <button className={styles.buttonAdd} type="submit" disabled={loadingAddOrEdit}>
          {loadingAddOrEdit ? <i className="fa-solid fa-spinner fa-spin-pulse fa-xl"></i> : (editMode ? "Update" : "Add")}
        </button>
      </form> */}
      

      </div>


      <div className={styles.itinCalendar}>
<table className={styles.calendar} id='calendar'>
    <thead className={styles.calCategories}>

        <th>Time:</th>
        <th>Activity:</th>

    </thead>
    <tbody className={styles.calDetails}>
        <tr>
    <td className={styles.calTime}>09:00</td>
    <td className={styles.calActivity}>Breakfast</td>
    </tr>
    <tr>
    <td className={styles.calTime}>10:00</td>
    <td className={styles.calActivity}>take pics</td>
    </tr>
    <tr>
    <td className={styles.calTime}>11:00</td>
    <td className={styles.calActivity}>get snacks</td>
    </tr>
    <tr>
    <td className={styles.calTime}>12:00</td>
    <td className={styles.calActivity}>Meet Mickey</td>
    </tr>
    </tbody>


</table>

      </div>
      
    </>
  );
}

export default Itinerary;
