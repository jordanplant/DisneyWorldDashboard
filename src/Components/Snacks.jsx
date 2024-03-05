import React from "react";
import styles from "./SnacksList.module.css";

const Snacks = ({ snacks, handleComplete, handleEdit, handleDelete }) => {
  return (
    <>
      <div>
        <ul className={styles.snacksList}>
          {snacks.map((snack) => (
            <React.Fragment key={snack.id}>
              <li
                key={snack.id}
                className={`${styles.snack} ${snack.completed ? styles.completed : ''}`}
              >
                {snack.title}
              </li>
              <span className={styles.buttons}>
                <button
                  className={styles.buttonComplete}
                  onClick={() => handleComplete(snack.id)}
                >
                  <i className="far fa-check-circle fa-xs"></i>
                </button>

                <button
                  className={styles.buttonEdit}
                  onClick={() => handleEdit(snack)}
                  disabled={snack.completed}
                >
                  <i className="far fa-pen-to-square fa-xs"></i>
                </button>

                <button
                  className={styles.buttonDelete}
                  onClick={() => handleDelete(snack.id)}
                >
                  <i className="fas fa-trash fa-xs"></i>
                </button>
              </span>
            </React.Fragment>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Snacks;
