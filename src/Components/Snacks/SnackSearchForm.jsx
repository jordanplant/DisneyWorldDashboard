import React, { useState, useEffect, useRef } from "react";
import styles from "./SnacksList.module.css";

const SnackSearchForm = ({
  onSubmit,
  loadingAddOrEdit,
  showManualAddPopup,
  setShowManualAddPopup
}) => {
  const [title, setTitle] = useState("");
  const [results, setResults] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [fetchEnabled, setFetchEnabled] = useState(true);
  const [searchTimeout, setSearchTimeout] = useState(null);

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

  const clearInputs = () => {
    setTitle("");
    setDropdownOpen(false);
    inputRef.current && inputRef.current.focus();
    setFetchEnabled(true);
  };

  const onSelectItem = (item) => {
    if (item === "manual") {
      setShowManualAddPopup(true);
      setDropdownOpen(false);
    } else {
      onSubmit(item);
    }

    clearTimeout(searchTimeout);
    setDropdownLoading(false);
    setFetchEnabled(false);
    clearInputs();
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.formBar}>
        <div className={styles.formPrimaryInputs}>
            <div className={styles.formSearchBar}>
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
          {title && (
            <div className={styles.clearButton} onClick={clearInputs}>
              <i className="fa-solid fa-circle-xmark"></i>
            </div>
          )}
          </div>
        </div>
      </form>
      <div
        className={`${styles.resultsList} ${dropdownOpen ? styles.open : ""}`}
        ref={dropdownRef}
      >
        {dropdownLoading && <p className={styles.loadingMessage}>Loading...</p>}
        <div
          className={`${styles.searchManualAdd} ${styles.searchResult}`}
          onClick={() => onSelectItem("manual")}
        >
          <p>Add Manually</p>
        </div>
        {results.map((item) => (
          <div
            onClick={() => onSelectItem(item)}
            className={styles.dropdownRow}
            key={item.id}
          >
            <div className={styles.searchResult}>
              <span className={styles.resultItemTitle}>{item.itemTitle}</span>
              <span className={styles.resultItemPrice}>{item.itemPrice},</span>
              <span className={styles.resultRestaurantInfo}>
                {item.restaurantName},
              </span>
              <span className={styles.resultParkInfo}>
                {item.restaurantLocation}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SnackSearchForm;