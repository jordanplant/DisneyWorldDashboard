import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Snacks from "./Snacks";
import styles from "./SnacksList.module.css";
// import("dotenv").then((dotenv) => dotenv.config());

const isDevelopment = process.env.NODE_ENV === "development";
const apiUrl = isDevelopment
  ? "http://localhost:3000/api"
  : "https://disney-world-dashboard.vercel.app/api";

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
        const newSnack = await response.json(); // Assuming this is the snack data received from your createSnack API
        const updatedSnacks = [...snacks, newSnack];
        setSnacks(updatedSnacks); // Update local state
        updateJsonBin(updatedSnacks); // Update JSONBin
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

      // Filter out the snack to delete
      const updatedSnacks = snacks.filter((snack) => snack.id !== id);
      setSnacks(updatedSnacks); // Update local state with the filtered list

      // Update JSONBin with the new list (including handling the case where the list is now empty)
      await updateJsonBin(updatedSnacks);
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
      Oh no, you're going to be hungry! 😱 Please add some snacks!
    </p>
  );

  const handleComplete = async (id) => {
    const snackToUpdate = snacks.find((snack) => snack.id === id);
    if (!snackToUpdate) {
      console.error("Snack to update not found.");
      return;
    }

    // Toggle the completion status locally for immediate UI update
    const updatedSnacks = snacks.map((snack) =>
      snack.id === id ? { ...snack, completed: !snack.completed } : snack
    );
    setSnacks(updatedSnacks);

    // Prepare the data to send to the server
    const updatedData = {
      id: snackToUpdate.id,
      title: snackToUpdate.title, // Include if necessary
      completed: !snackToUpdate.completed,
    };

    // Send the update to the server
    try {
      const response = await fetch(`${apiUrl}/updateSnack`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(
          "Failed to update snack completion status on the server."
        );
      }

      console.log(
        "Snack completion status updated successfully on the server."
      );
    } catch (error) {
      console.error(
        "Failed to update snack completion status in JSONBin:",
        error
      );
      // Optionally handle the error, such as reverting the local state change
    }
  };

  // Assume updateJsonBin is defined elsewhere in your component or imported
  const updateJsonBin = async (snacksData) => {
    const binId = process.env.BIN_ID; // Use the correct env variable names
    const apiKey = process.env.BIN_KEY;
    const url = `https://api.jsonbin.io/v3/b/${binId}`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": apiKey,
        },
        body: JSON.stringify(snacksData), // Ensure this matches JSONBin's expected format
      });

      if (!response.ok) {
        throw new Error(`Failed to update JSONBin: ${response.statusText}`);
      }

      console.log("JSONBin updated successfully.");
    } catch (error) {
      console.error("Error updating JSONBin:", error);
    }
  };

  return (
    <div className={styles.formContainer}>
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

      {snacks.length === 0 ? (
        noSnacksMessage
      ) : (
        <Snacks
          snacks={snacks}
          handleComplete={handleComplete}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default SnacksList;
