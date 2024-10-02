import React, { useState, useEffect, useRef, useCallback } from "react";
import Snacks from "./Snacks";
import styles from "./SnacksList.module.css";
import SnackListNav from "./SnackListNav";
import SnackSearchForm from "./SnackSearchForm";
import SnackListManualAdd from "./SnackListManualAdd"; 

const apiUrl = "/api";

const SnacksList = ({ selectedPark, selectedCity }) => {
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
  const [loadingSnackId, setLoadingSnackId] = useState(null);
  const [activeTab, setActiveTab] = useState("outstandingSnacks");
  const [selectedParks, setSelectedParks] = useState([]);
  const [showManualAddPopup, setShowManualAddPopup] = useState(true);
  const [lastFetchTimestamp, setLastFetchTimestamp] = useState(null);
  const cachedSnacksRef = useRef(null);
  const [error, setError] = useState(null);
  

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
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
    clearTimeout(searchTimeout);

    if (searchTerm.length >= 3 && fetchEnabled) {
      setDropdownOpen(true);
      setDropdownLoading(true);

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
              setDropdownLoading(false);
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
              setDropdownLoading(false);
            });
        }, 200)
      );
    } else {
      setResults([]);
      setDropdownOpen(false);
      setDropdownLoading(false);
    }
  };

  const onInputChange = (event) => {
    const { value } = event.target;
    setTitle(value);

    clearTimeout(searchTimeout);

    if (value.length >= 3) {
      setSearchTimeout(
        setTimeout(() => {
          fetchData(value);
        }, 200)
      );
    } else {
      setResults([]);
      setDropdownOpen(false);
      setDropdownLoading(false);
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

  const fetchSnacks = useCallback(async (forceRefresh = false) => {
    if (cachedSnacksRef.current && !forceRefresh) {
      setSnacks(cachedSnacksRef.current);
      setListLoading(false);
      return;
    }

    setListLoading(true);
    try {
      const response = await fetch(`${apiUrl}/getSnacks`);
      if (!response.ok) throw new Error("Error fetching snacks");

      const data = await response.json();
      const sortedSnacks = sortSnacksByCreatedAt(data);

      setSnacks(sortedSnacks);
      cachedSnacksRef.current = sortedSnacks;
      setLastFetchTimestamp(new Date().toISOString());
    } catch (error) {
      console.error("Failed to fetch snacks:", error);
      setError("Failed to load snacks. Please try again later.");
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSnacks();
  }, [fetchSnacks]);

  const resetFormFields = () => {
    setTitle("");
    setPrice("");
    setLocation("");
    setDescription("");
    setPark("");
    setLand("");
  };

  const sortSnacksByCreatedAt = (snacks) => {
    return snacks.sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  const onFormSubmit = async (event, snackData = null) => {
    if (event) event.preventDefault();
    setLoadingAddOrEdit(true);

    const timestamp = new Date().toISOString();
    const dataToSubmit = snackData || {
      title,
      price,
      location,
      description,
      park,
      land,
      resort: selectedPark,
    };

    try {
      if (editMode && editedSnack) {
        const response = await fetch(`${apiUrl}/updateSnack`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editedSnack.id,
            ...dataToSubmit,
            updatedAt: timestamp,
          }),
        });
        if (!response.ok) throw new Error("Error updating snack");
      } else {
        const response = await fetch(`${apiUrl}/createSnack`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...dataToSubmit,
            createdAt: timestamp,
          }),
        });
        if (!response.ok) throw new Error("Error adding snack");
      }

      await fetchSnacks(true);

      setEditMode(false);
      setEditedSnack(null);
      resetFormFields();
    } catch (error) {
      console.error("Failed to add/update snack:", error);
    } finally {
      setLoadingAddOrEdit(false);
      setDropdownOpen(false);
      setFetchEnabled(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      const updatedSnacks = snacks.map((snack) =>
        snack.id === id ? { ...snack, title: "Deleting..." } : snack
      );
      setSnacks(updatedSnacks);

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

      await fetchSnacks(true);
    } catch (error) {
      console.error("Failed to delete snack:", error);
    }
  };

  const handleEdit = (snack) => {
    setEditMode(true);
    setTitle(snack.title);
    setPrice(snack.price);
    setLocation(snack.location);
    setEditedSnack(snack);
  };

  const noSnacksMessage = (
    <p className={styles.noSnacksMessage}>
      Oh no, you're going to be hungry! 😱 Please add some snacks!
    </p>
  );

  const handleComplete = async (id) => {
    setLoadingSnackId(id);

    try {
      const snackToUpdate = snacks.find((snack) => snack.id === id);
      if (!snackToUpdate) {
        console.error("Snack to update not found.");
        return;
      }

      const updatedSnacks = snacks.map((snack) =>
        snack.id === id
          ? {
              ...snack,
              completed: !snack.completed,
            }
          : snack
      );

      setSnacks(updatedSnacks);
      cachedSnacksRef.current = updatedSnacks;

      const response = await fetch(`${apiUrl}/updateSnack`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: snackToUpdate.id,
          title: snackToUpdate.title,
          completed: !snackToUpdate.completed,
          price: snackToUpdate.price,
          location: snackToUpdate.location,
        }),
      });
      if (!response.ok) {
        throw new Error(
          "Failed to update snack completion status on the server."
        );
      }
    } catch (error) {
      console.error("Failed to complete snack:", error);
      await fetchSnacks(true);
    } finally {
      setLoadingSnackId(null);
    }
  };

  const handleUndocomplete = async (id) => {
    try {
      setLoadingSnackId(id);

      const snackToUpdate = snacks.find((snack) => snack.id === id);
      if (!snackToUpdate) {
        console.error("Snack to update not found.");
        return;
      }

      const updatedSnacks = snacks.map((snack) =>
        snack.id === id
          ? {
              ...snack,
              completed: false,
            }
          : snack
      );

      setSnacks(updatedSnacks);
      cachedSnacksRef.current = updatedSnacks;

      const response = await fetch(`${apiUrl}/updateSnack`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: snackToUpdate.id,
          title: snackToUpdate.title,
          completed: false,
          price: snackToUpdate.price,
          location: snackToUpdate.location,
        }),
      });

      if (!response.ok) {
        throw new Error(
          "Failed to update snack completion status on the server."
        );
      }
    } catch (error) {
      console.error("Failed to mark snack as incomplete:", error);
      await fetchSnacks(true);
    } finally {
      setLoadingSnackId(null);
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const filteredSnacks = snacks.filter((snack) =>
    activeTab === "outstandingSnacks" ? !snack.completed : snack.completed
  );

  const handleParkSelectionChange = (selectedParks) => {
    setSelectedParks(selectedParks);
  };


  const handleManualAddSubmit = (event) => {
    event.preventDefault();
    onFormSubmit();
    setShowManualAddPopup(false);
  };

  const handleSearchSubmit = (item) => {
    setTitle(item.itemTitle);
    setPrice(item.itemPrice);
    setLocation(item.restaurantName);
    setDescription(item.itemDescription);
    setPark(item.restaurantLocation);
    setLand(item.subLocation);

    onFormSubmit(null, {
      title: item.itemTitle,
      price: item.itemPrice,
      location: item.restaurantName,
      description: item.itemDescription,
      park: item.restaurantLocation,
      land: item.subLocation,
      resort: selectedPark,
    });
  };

  return (
    <>
      <div className={styles.container}>
        <SnackSearchForm
          onSubmit={handleSearchSubmit}
          loadingAddOrEdit={loadingAddOrEdit}
          showManualAddPopup={showManualAddPopup}
          setShowManualAddPopup={setShowManualAddPopup}
        />

<SnackListManualAdd
        showManualAddPopup={showManualAddPopup}
        setShowManualAddPopup={setShowManualAddPopup}
        handleManualAddSubmit={handleManualAddSubmit}
        title={title}
        setTitle={setTitle}
        price={price}
        setPrice={setPrice}
        location={location}
        setLocation={setLocation}
        park={park}
        setPark={setPark}
        onSubmit={handleManualAddSubmit}
            onClose={() => setShowManualAddPopup(false)} // Close function for the pop-up
          
      />

        <SnackListNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          selectedPark={selectedPark}
          selectedCity={selectedCity}
          onParkChange={handleParkSelectionChange}
        />
        <div className={styles.snacksContainer}>
          {listLoading ? (
            <p className={styles.loadingMessage}>
              <i className="fa-solid fa-cookie-bite fa-2xl"></i> Loading
              snacks...
            </p>
          ) : filteredSnacks.length === 0 ? (
            activeTab === "outstandingSnacks" ? (
              noSnacksMessage
            ) : (
              <p className={styles.noSnacksMessage}>
                No completed snacks yet. Keep snacking! 🍪
              </p>
            )
          ) : (
            <Snacks
              snacks={snacks}
              setSnacks={setSnacks}
              handleComplete={handleComplete}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handleUndocomplete={handleUndocomplete}
              activeTab={activeTab}
              selectedParks={selectedParks}
              selectedPark={selectedPark}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default SnacksList;
