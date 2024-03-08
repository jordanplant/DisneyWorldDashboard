import React from "react";
import styles from "./SnacksList.module.css";
import ButtonContainer from "./ButtonContainer";

const Snacks = ({ snacks, handleComplete, handleEdit, handleDelete }) => {
  return (
    <>
      <div>
        <ul className={styles.snacksList}>
          {snacks.map((snack) => (
            <React.Fragment key={snack.id}>
              <button
          className={`${styles.buttonComplete} ${snack.completed ? styles.completedButton : ''}`}
          onClick={() => handleComplete(snack.id)}
        >
          <i className="far fa-check-circle fa-xs"></i>
        </button>
<li
  key={snack.id}
  className={`${styles.snack} ${snack.completed ? styles.completed : ''}`}
>

  <span>{snack.title}</span>
  <span className={styles.SnackButtonContainer}>
    <ButtonContainer
                   snack={snack}
                   handleComplete={handleComplete}
                   handleEdit={handleEdit}
                   handleDelete={handleDelete} />
  </span>
</li>
            </React.Fragment>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Snacks;
