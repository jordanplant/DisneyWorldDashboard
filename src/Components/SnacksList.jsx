import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Snacks from "./Snacks";
import styles from "./SnacksList.module.css";

const isDevelopment = process.env.NODE_ENV === "development";
const apiUrl = isDevelopment
  ? "http://localhost:3000/api"
  : "https://disney-world-dashboard.vercel.app/api";

const SnacksList = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [snacks, setSnacks] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingAddOrEdit, setLoadingAddOrEdit] = useState(false);
  const [editedSnack, setEditedSnack] = useState(null); // Define editedSnack state

  const onInputChange = (event) => {
    setTitle(event.target.value);
  };

  const onPriceChange = (event) => {
    setPrice(event.target.value);
  };

  const onLocationChange = (event) => {
    setLocation(event.target.value);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnacks();
  }, []);

  const onFormSubmit = async (event) => {
    event.preventDefault();
    setLoadingAddOrEdit(true);
  
    if (editMode && editedSnack) {
      try {
        const response = await fetch(`${apiUrl}/updateSnack`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: editedSnack.id, title, price, location }),
        });
        if (!response.ok) {
          throw new Error("Error updating snack: " + response.statusText);
        }
        const updatedSnack = await response.json();
        setSnacks((prevSnacks) =>
          prevSnacks.map((snack) =>
            snack.id === updatedSnack.id
              ? { ...snack, title: updatedSnack.title, price: updatedSnack.price, location: updatedSnack.location }
              : snack
          )
        );
        setEditMode(false);
        setEditedSnack(null);
      } catch (error) {
        console.error("Failed to update snack:", error);
        // Handle error state or display error message to the user
      } finally {
        setLoadingAddOrEdit(false);
        setTitle(""); // Clear form fields once done
        setPrice("");
        setLocation("");
      }
    } else {
      try {
        const response = await fetch(`${apiUrl}/createSnack`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, price, location }),
        });
        if (!response.ok) {
          throw new Error("Error adding snack");
        }
        const newSnack = await response.json();
        const updatedSnacks = [...snacks, newSnack];
        setSnacks(updatedSnacks);
        updateJsonBin(updatedSnacks);
      } catch (error) {
        console.error("Failed to add snack:", error);
      } finally {
        setLoadingAddOrEdit(false);
        setTitle(""); // Clear form fields once done
        setPrice("");
        setLocation("");
      }
    }
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
    setTitle(snack.title);
    setPrice(snack.price);
    setLocation(snack.location);
    setEditedSnack(snack); // Set editedSnack state
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
      snack.id === id
        ? {
            ...snack,
            completed: !snack.completed,
            price: snack.price, // Retain the original price
            location: snack.location, // Retain the original location
          }
        : snack
    );
    setSnacks(updatedSnacks);
  
    // Update the completion status on the server
    try {
      const response = await fetch(`${apiUrl}/updateSnack`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: snackToUpdate.id,
          title: snackToUpdate.title,
          completed: !snackToUpdate.completed,
          price: snackToUpdate.price, // Include price in the update
          location: snackToUpdate.location, // Include location in the update
        }),
      });
  
      if (!response.ok) {
        throw new Error(
          "Failed to update snack completion status on the server."
        );
      }
  
      console.log("Snack completion status updated successfully on the server.");
    } catch (error) {
      console.error(
        "Failed to update snack completion status in JSONBin:",
        error
      );
    }
  };
  

  const updateJsonBin = async (snacksData) => {
    const binId = process.env.BIN_ID;
    const apiKey = process.env.BIN_KEY;
    const url = `https://api.jsonbin.io/v3/b/${binId}`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": apiKey,
        },
        body: JSON.stringify(snacksData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update JSONBin: ${response.statusText}`);
      }

      console.log("JSONBin updated successfully.");
    } catch (error) {
      console.error("Error updating JSONBin:", error);
    }
  };

  const subInputClass = `${styles.subInput} ${editMode ? styles.subInputEdit : ""}`;

  return (
    <div className={styles.formContainer}>
      <form className={styles.formBar} onSubmit={onFormSubmit}>
        <div className={styles.formPrimaryInputs}>
          <input
            type="text"
            placeholder="Snack"
            className={styles.taskInput}
            value={title}
            required
            onChange={onInputChange}
            disabled={loadingAddOrEdit}
          />
          <button
            className={styles.buttonAdd}
            type="submit"
            disabled={loadingAddOrEdit}
          >
            {loadingAddOrEdit ? (
              <i className="fa-solid fa-spinner fa-spin-pulse fa-xl"></i>
            ) : (
              editMode ? "Update" : "Add"
            )}
          </button>
        </div>
        <div className={styles.formSecondaryInputs}>
          <input
            type="number"
            placeholder="$5.00"
            className={subInputClass}
            value={price}
            onChange={onPriceChange}
            disabled={loadingAddOrEdit}
          />
          <input
            type="text"
            placeholder="Location"
            className={subInputClass}
            value={location}
            onChange={onLocationChange}
            disabled={loadingAddOrEdit}
          />
        </div>
      </form>

      {loading ? (
        <p className={styles.loadingMessage}>
          <i className="fa-solid fa-cookie-bite fa-2xl"></i> Loading snacks...
        </p>
      ) : snacks.length === 0 ? (
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
