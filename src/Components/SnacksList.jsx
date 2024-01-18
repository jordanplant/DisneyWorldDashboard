// SnacksList.jsx
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Snacks from "./Snacks";
import styles from "./SnacksList.module.css";

const SnacksList = () => {
  const [input, setInput] = useState("");
  const [snacks, setSnacks] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editedSnack, setEditedSnack] = useState(null);

  const onInputChange = (event) => {
    setInput(event.target.value);
  };

  const onFormSubmit = (event) => {
    event.preventDefault();

    if (editMode) {
      // If in edit mode, update the edited snack
      setSnacks((prevSnacks) =>
        prevSnacks.map((snack) =>
          snack.id === editedSnack.id ? { ...snack, title: input } : snack
        )
      );

      setEditMode(false);
      setEditedSnack(null);
    } else {
      // If not in edit mode, add a new snack
      setSnacks([...snacks, { id: uuidv4(), title: input, completed: false }]);
    }

    setInput("");
  };

  const handleDelete = (id) => {
    setSnacks(snacks.filter((snack) => snack.id !== id));
  };

  const handleEdit = (snack) => {
    setEditedSnack(snack);
    setInput(snack.title);
    setEditMode(true);
  };

  const handleComplete = (snack) => {
    setSnacks((prevSnacks) =>
      prevSnacks.map((item) => {
        if (item.id === snack.id) {
          return { ...item, completed: !item.completed };
        }
        return item;
      })
    );
  };

  return (
    <div>
      <form className={styles.formBar} onSubmit={onFormSubmit}>
        <input
          type="text"
          placeholder="Enter your snacks here"
          className={styles.taskInput}
          value={input}
          required
          onChange={onInputChange}
        />
        <button className={styles.buttonAdd} type="submit">
          {editMode ? "Update" : "Add"}
        </button>
      </form>

      <Snacks
        snacks={snacks}
        handleComplete={handleComplete}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default SnacksList;
