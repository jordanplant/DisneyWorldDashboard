import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Snacks from "./Snacks";
import styles from "./SnacksList.module.css";

// const isDevelopment = process.env.NODE_ENV === "development";
// const apiUrl = isDevelopment
//   ? "http://localhost:3000/api"
//   : "https://disney-world-dashboard.vercel.app/api";

const apiUrl = "/api";

const SnacksList = () => {
  // State variables
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [park, setPark] = useState("");
  const [land, setLand] = useState("");
  const [snacks, setSnacks] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState(true);
  const [listLoading, setListLoading] = useState(true);
  const [loadingAddOrEdit, setLoadingAddOrEdit] = useState(false);
  const [editedSnack, setEditedSnack] = useState(null);
  const [results, setResults] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [fetchEnabled, setFetchEnabled] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Cleanup function to clear the timeout when the component unmounts or when search term changes
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  useEffect(() => {
    if (title.trim() !== "") {
      fetchData(title.trim());
    } else {
      setResults([]);
    }
  }, [title]);

  const fetchData = (searchTerm) => {
    // Clear any existing timeout when the input changes
    clearTimeout(searchTimeout);

    if (searchTerm.length >= 3 && fetchEnabled) {
      // Add fetchEnabled check
      setDropdownOpen(true);
      setDropdownLoading(true); // Set loading indicator when fetch operation starts

      // Set a new timeout for fetching data after 200ms delay
      setSearchTimeout(
        setTimeout(() => {
          fetch(`https://jordanplant.github.io/Data/menu.json`)
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .then((data) => {
              if (searchTerm.trim() === "") {
                setResults([]);
                setDropdownOpen(false);
                return;
              }
              if (!Array.isArray(data)) {
                throw new Error("Response data is not in the expected format");
              }

              const filteredResults = data.filter((item) =>
                item.itemTitle.toLowerCase().includes(searchTerm.toLowerCase())
              );
              setResults(filteredResults);
              setDropdownLoading(false); // Clear loading indicator after fetching data
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
              setError(error.message);
              setDropdownLoading(false); // Clear loading indicator on error
            });
        }, 200)
      );
    } else {
      setResults([]);
      setDropdownOpen(false);
      setDropdownLoading(false); // Clear loading indicator if search term is less than 3 characters
    }
  };

  const onInputChange = (event) => {
    const { value } = event.target;
    setTitle(value);

    // Clear any existing timeout before creating a new one
    clearTimeout(searchTimeout);

    if (value.length >= 3) {
      // Set a new timeout for fetchData after 200ms delay
      setSearchTimeout(
        setTimeout(() => {
          fetchData(value);
        }, 200)
      );
    } else {
      setResults([]);
      setDropdownOpen(false);
      setDropdownLoading(false); // Clear loading indicator if input length is less than 3
    }
  };

  const onPriceChange = (event) => {
    setPrice(event.target.value);
  };

  const onLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const onDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const onParkChange = (event) => {
    setPark(event.target.value);
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
      setListLoading(false);
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
          body: JSON.stringify({
            id: editedSnack.id,
            title,
            price,
            location,
            description,
            park,
            // Change subLocation to land
            land, // Use the value of land state
          }),
        });
        if (!response.ok) {
          throw new Error("Error updating snack: " + response.statusText);
        }
        const updatedSnack = await response.json();
        setSnacks((prevSnacks) =>
          prevSnacks.map((snack) =>
            snack.id === updatedSnack.id
              ? {
                  ...snack,
                  title: updatedSnack.title,
                  price: updatedSnack.price,
                  location: updatedSnack.location,
                  description: updatedSnack.description,
                  park: updatedSnack.restaurantLocation,
                  // Change subLocation to land
                  land: updatedSnack.subLocation, // Use the value of subLocation
                }
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
        setDescription("");
        setPark("");
        setLand("");
        setDropdownOpen(false);
      }
    } else {
      try {
        const response = await fetch(`${apiUrl}/createSnack`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            price,
            location,
            description,
            park,
            // Change subLocation to land
            land, // Use the value of land state
          }),
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
        setDescription("");
        setPark("");
        setLand("");
        setFetchEnabled(true);
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
            itemDescription: snack.description, // Include item description
            restaurantLocation: snack.restaurantLocation, // Include restaurant location
            subLocation: snack.subLocation, // Include restaurant location
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

      // console.log(
      //   "Snack completion status updated successfully on the server."
      // );
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

  const onSelectItem = (item) => {
    setTitle(item.itemTitle);
    setPrice(item.itemPrice);
    setLocation(item.restaurantName);
    setDescription(item.itemDescription);
    setPark(item.restaurantLocation);
    setLand(item.subLocation);

    // Clear any existing timeout and search state
    clearTimeout(searchTimeout); // Clear the search timeout
    setDropdownOpen(false); // Close the dropdown
    setDropdownLoading(false); // Stop the loading indicator

    // Stop the fetch process
    setFetchEnabled(false);
  };

  const clearInputs = () => {
    setTitle("");
    setPrice("");
    setLocation("");
    setDescription("");
    setPark("");
    setDropdownOpen(false);
    inputRef.current && inputRef.current.focus(); // Focus back on the input after clearing
    setFetchEnabled(true);
  };

  const subInputClass = `${styles.subInput} ${
    editMode ? styles.subInputEdit : ""
  }`;

  return (
    <>
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <form className={styles.formBar} onSubmit={onFormSubmit}>
            <div className={styles.formPrimaryInputs}>
              <input
                type="text"
                placeholder="Search/Add Snack"
                className={styles.taskInput}
                value={title}
                required
                onChange={onInputChange}
                disabled={loadingAddOrEdit}
                ref={inputRef}
              />
              {title && ( // Show the close button only when there's text in the input
                <div
                  className={styles.clearButton}
                  onClick={() => clearInputs("")}
                >
                  <i className="fa-solid fa-circle-xmark"></i>
                </div>
              )}
              <button
                className={styles.buttonAdd}
                type="submit"
                disabled={loadingAddOrEdit}
              >
                {loadingAddOrEdit ? (
                  <i className="fa-solid fa-spinner fa-spin-pulse fa-xl"></i>
                ) : editMode ? (
                  "Update"
                ) : (
                  "Add"
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
          <div
            className={`${styles.resultsList} ${
              dropdownOpen ? styles.open : ""
            }`}
            ref={dropdownRef}
          >
            {dropdownLoading && (
              <p className={styles.loadingMessage}>Loading...</p>
            )}
            {results.map((item) => (
              <div
                onClick={() => onSelectItem(item)}
                className={styles.dropdownRow}
                key={item.id}
              >
                <div className={styles.searchResult} key={item.id}>
                  <span className={styles.resultItemTitle}>
                    {item.itemTitle}
                  </span>
                  <span className={styles.resultRestaurantInfo}>
                    {item.restaurantName},
                  </span>
                  <span className={styles.resultRestaurantInfo}>
                    {item.restaurantLocation}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.snacksContainer}>
          {listLoading ? (
            <p className={styles.loadingMessage}>
              <i className="fa-solid fa-cookie-bite fa-2xl"></i> Loading
              snacks...
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
      </div>
    </>
  );
};

export default SnacksList;
