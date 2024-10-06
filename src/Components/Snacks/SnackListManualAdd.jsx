import React, { useState } from "react";
import PropTypes from "prop-types";
import ModalForm from "../Common/ModalForm"; // Adjust the import path as needed

const SnackListManualAdd = ({ onClose, onSave }) => {
  const [snackData, setSnackData] = useState({
    title: "",
    price: "",
    location: "",
    park: "",
  });

  const handleInputChange = (field, value) => {
    setSnackData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSave = () => {
    const newSnack = {
      ...snackData,
      price: Number(snackData.price), // Convert price to number
    };
    onSave(newSnack);
  };

  const fields = [
    [
      {
        id: "title",
        className: "snackInput",
        label: "Snack name",
        type: "text",
        value: snackData.title,
        onChange: (e) => handleInputChange("title", e.target.value),
        placeholder: "Mickey Pretzel",
        required: true,
      },
      {
        id: "price",
        className: "snackInput",
        label: "Price",
        type: "number",
        value: snackData.price,
        onChange: (e) => handleInputChange("price", e.target.value),
        placeholder: "5.00",
        required: true,
      },
      {
        id: "location",
        className: "snackInput",
        label: "Restaurant",
        type: "text",
        value: snackData.location,
        onChange: (e) => handleInputChange("location", e.target.value),
        placeholder: "Tomorrowland Terrace",
        required: true,
      },
      {
        id: "park",
        className: "snackInput",
        label: "Park",
        type: "text",
        value: snackData.park,
        onChange: (e) => handleInputChange("park", e.target.value),
        placeholder: "Magic Kingdom",
        required: true,
      },
    ],
  ];

  return (
    <ModalForm
      formTitle="Add Snack Details"
      pages={fields}
      currentPage={0}
      handleSave={handleSave}
      onClose={onClose}
      submitLabel="Add Snack"
      goToNextPage={() => {}} // Not needed for single page
      goToPreviousPage={() => {}} // Not needed for single page
    />
  );
};

SnackListManualAdd.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default SnackListManualAdd;