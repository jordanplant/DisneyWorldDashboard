import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Snacks from "./Snacks";
import styles from "./SnacksList.module.css";

const isDevelopment = process.env.NODE_ENV === "development";
const apiUrl = isDevelopment
  ? "http://localhost:3000/api"
  : "https://your-production-url.com/api";

const SnacksList = () => {
  const [input, setInput] = useState("");
  const [snacks, setSnacks] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editedSnack, setEditedSnack] = useState(null);

  const onInputChange = (event) => {
    setInput(event.target.value);
  };

  const fetchSnacks = async () => {
    try {
      const response = await fetch(`${apiUrl}/getSnacks`);
      if (!response.ok) {
        throw new Error("Failed to fetch snacks");
      }
      const data = await response.json();
      setSnacks(data);
    } catch (error) {
      console.error("Error fetching snacks:", error);
    }
  };

  useEffect(() => {
    fetchSnacks();
  }, []);

  const onFormSubmit = async (event) => {
    event.preventDefault();

    if (editMode) {
      try {
        const response = await fetch(`${apiUrl}/updateSnack`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: editedSnack.id, title: input }),
        });
        if (!response.ok) {
          throw new Error("Error updating snack");
        }
        const updatedSnack = await response.json();
        setSnacks((prevSnacks) =>
          prevSnacks.map((snack) =>
            snack.id === updatedSnack.id
              ? { ...snack, title: updatedSnack.title }
              : snack
          )
        );
        setEditMode(false);
        setEditedSnack(null);
      } catch (error) {
        console.error("Failed to update snack:", error);
      }
    } else {
      try {
        const response = await fetch(`${apiUrl}/createSnack`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: input }),
        });
        if (!response.ok) {
          throw new Error("Error adding snack");
        }
        const newSnack = await response.json();
        setSnacks((prevSnacks) => [...prevSnacks, newSnack]);
      } catch (error) {
        console.error("Failed to add snack:", error);
      }
    }
    setInput("");
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/deleteSnack`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error("Error deleting snack");
      }
      setSnacks(snacks.filter((snack) => snack.id !== id));
    } catch (error) {
      console.error("Failed to delete snack:", error);
    }
  };

  const handleEdit = (snack) => {
    setEditMode(true);
    setEditedSnack(snack);
    setInput(snack.title);
  };

  const noSnacksMessage = (
    <p className={styles.noSnacksMessage}>
      No snacks have been added yet. Please add some!
    </p>
  );

  return (
    <div>
      <form className={styles.formBar} onSubmit={onFormSubmit}>
        <input
          type="text"
          placeholder="Enter your snack here..."
          className={styles.taskInput}
          value={input}
          onChange={onInputChange}
          required
        />
        <button type="submit" className={styles.buttonAdd}>
          {editMode ? "Update Snack" : "Add Snack"}
        </button>
      </form>

      {snacks.length === 0 ? (
        noSnacksMessage
      ) : (
        <Snacks
          snacks={snacks}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default SnacksList;
