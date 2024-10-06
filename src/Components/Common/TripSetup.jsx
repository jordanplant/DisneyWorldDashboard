import React, { useState } from "react";
import ModalForm from "./ModalForm";

const today = new Date();
const minDate = new Date(today);
minDate.setMonth(minDate.getMonth() - 1);
const formattedMinDate = minDate.toISOString().split("T")[0];

const futureDate = new Date(today);
futureDate.setDate(futureDate.getDate() + 14);
const defaultEndDate = futureDate.toISOString().split("T")[0];
const defaultStartDate = today.toISOString().split("T")[0];

const parkToCityMap = {
  "Walt Disney World": "Orlando",
  // "Disneyland California": "Anaheim",
  "Disneyland Paris": "Paris",
  // "Tokyo Disneyland": "Tokyo",
  // "Shanghai Disneyland": "Shanghai",
  // "Hong Kong Disneyland": "Hong Kong",
};

const TripSetup = ({ onClose, onSave, onCityChange }) => {
  const [tripData, setTripData] = useState({
    name: "",
    startDate: defaultStartDate,
    endDate: defaultEndDate,
    additionalDetails: "",
  });
  const [currentPage, setCurrentPage] = useState(0);

  const handleSave = () => {
    const city = parkToCityMap[tripData.name];
    const newTrip = {
      id: Date.now(),
      ...tripData,
      city,
      park: tripData.name,
    };
    
    // Only update city and park when the form is submitted
    onCityChange(city, tripData.name);
    onSave(newTrip);
  };

  const handleInputChange = (field, value) => {
    setTripData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  const mainFields = [
    {
      className: "tripSelect",
      id: "name",
      label: "Where are you going?",
      type: "select",
      value: tripData.name,
      onChange: (e) => handleInputChange("name", e.target.value),
      required: true,
      options: [
        { value: "", label: "Select a location" },
        ...Object.keys(parkToCityMap).map(park => ({
          value: park,
          label: park
        }))
      ]
    },
    {
      id: "startDate",
      className: "tripDate",
      label: "Trip Start Date",
      type: "date",
      value: tripData.startDate,
      onChange: (e) => handleInputChange("startDate", e.target.value),
      min: formattedMinDate,
      required: true,
    },
    {
      className: "tripDate",
      id: "endDate",
      label: "Trip End Date",
      type: "date",
      value: tripData.endDate,
      onChange: (e) => handleInputChange("endDate", e.target.value),
      min: tripData.startDate,
      required: true,
    },
  ];

  // Define optional additional fields
  const additionalFields = [
    {
      id: "additionalDetails",
      label: "Additional Details",
      type: "textarea",
      value: tripData.additionalDetails,
      onChange: (e) => handleInputChange("additionalDetails", e.target.value),
      required: false,
    },
  ];

 // Decide whether to show additional fields
 const shouldShowAdditionalFields = false; // You can make this dynamic based on your needs

 // Construct pages array based on whether additional fields should be shown
 const pages = shouldShowAdditionalFields 
   ? [mainFields, additionalFields]
   : [mainFields];

 return (
   <ModalForm
     formTitle="Create New Trip"
     pages={pages}
     currentPage={currentPage}
     handleSave={handleSave}
     onClose={onClose}
     goToNextPage={() => setCurrentPage(prev => prev + 1)}
     goToPreviousPage={() => setCurrentPage(prev => prev - 1)}
   />
 );
};

export default TripSetup;