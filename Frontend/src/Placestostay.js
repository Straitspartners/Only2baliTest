import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Placestostay.css";
import { useNavigate } from "react-router-dom";
import stay1 from "../src/Asset/stay1.png";
import stay2 from "../src/Asset/stay2.png";
import stay3 from "../src/Asset/stay3.png";
import stay4 from "../src/Asset/stay4.png";
import stay5 from "../src/Asset/stay5.png";
import stay6 from "../src/Asset/stay6.png";

import leftbtn from "../src/Asset/Button 2.png";
import rightbtn from "../src/Asset/Button 3.png";

const categories = [
  { id: 1, type: "hotel", name: "Hotel", img: stay1 },
  { id: 2, type: "motel", name: "Motel", img: stay2 },
  { id: 3, type: "villa", name: "Villa", img: stay3 },
  { id: 4, type: "cottage", name: "Cottage", img: stay4 },
  { id: 5, type: "apartment", name: "Apartment", img: stay5 },
  { id: 6, type: "guesthouse", name: "Guesthouse", img: stay6 },
];

const Placestostay = () => {
  const [selectedStays, setSelectedStays] = useState([]);
  const [error, setError] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [journeyPreferencesId, setJourneyPreferencesId] = useState(null);
  const [existingStayPreferences, setExistingStayPreferences] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const id = sessionStorage.getItem("journeyPreferencesId");
    if (id) {
      setJourneyPreferencesId(id);
      fetchStayPreferences(id); // Fetch existing stay preferences if available
    } else {
      setError("You've reloaded the page or closed the tab. Please start filling preferences again.");
      setShowErrorPopup(true);
    }

    // Add event listener for beforeunload to delete data when the tab is closed
    const handleBeforeUnload = async () => {
      if (journeyPreferencesId) {
        deleteJourneyData(journeyPreferencesId);
      }
      sessionStorage.clear();
      //localStorage.clear();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [journeyPreferencesId]);

  const fetchStayPreferences = async (journeyPreferencesId) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await axios.get(
        `https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/journeys/stay-preferences/?journey_preferences_id=${journeyPreferencesId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        setExistingStayPreferences(response.data);
        setSelectedStays(response.data.stay_type || []);
      }
    } catch (err) {
      console.error("API Error:", err.response?.data);
    }
  };

  const handleStaySelect = (categoryId) => {
    setSelectedStays((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      }
      if (prev.length >= 2) {
        setError("You can only select up to 2 places to stay");
        setShowErrorPopup(true);
        return prev;
      }
      setError("");
      return [...prev, categoryId];
    });
  };

  const handleSubmit = async () => {
    if (!journeyPreferencesId) {
      setError("You've reloaded the page or closed the tab. Please start filling preferences again.");
      setShowErrorPopup(true);
      return;
    }

    if (selectedStays.length === 0) {
      setError("Please select at least one place to stay");
      setShowErrorPopup(true);
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem("access_token");

    try {
      const response = existingStayPreferences
        ? await axios.put(
            `https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/journeys/stay-preferences/`,
            {
              journey_preferences_id: journeyPreferencesId,
              stay_type: selectedStays,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          )
        : await axios.post(
            "https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/journeys/stay-preferences/",
            {
              journey_preferences_id: journeyPreferencesId,
              stay_type: selectedStays,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

      if (response.status === 201 || response.status === 200) {
        navigate("/Transports");
      }
    } catch (err) {
      console.error("API Error:", err.response?.data);
      setError(
        err.response?.data?.message ||
          "An error occurred while submitting your request."
      );
      setShowErrorPopup(true);
      if (window.confirm("Your session is expired. Please log in again")) {
        navigate('/signin');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteJourneyData = async (journeyPreferencesId) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await axios.delete(
        `https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/journeys/journey_preferences/delete/${journeyPreferencesId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        console.log("Journey preferences data deleted successfully");
      }
    } catch (err) {
      console.error("Error deleting journey preferences:", err);
    }
  };

  return (
    <div className="Pts-container"> <div className="loading-bar-container">
    <div className="loading-bar" style={{ width: "35%" }}></div>
  </div>
      <h1 className="ptv-h1">Where You'd Say Goodnight to Your Beloved Ones?</h1>
      <p className="ptv-p">
      Choose any two of your accommodation preferences.
      </p>
      <div className="grid">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`card ${
              selectedStays.includes(category.id) ? "selected" : ""
            }`}
          >
            <img
              src={category.img}
              alt={category.name}
              className="ps-card-img w-50"
            />
            <button
              type="button"
              className={`ps-card-button ${
                selectedStays.includes(category.id) ? "selected" : ""
              }`}
              onClick={() => handleStaySelect(category.id)}
              disabled={
                selectedStays.length >= 2 && !selectedStays.includes(category.id)
              }
            >
              {selectedStays.includes(category.id)
                ? "✓ Selected"
                : `+ ${category.name}`}
            </button>
          </div>
        ))}
      </div>
  

<div className="nxt-btn">
  <button
    onClick={() => navigate(-1)}
    disabled={isLoading}
    className="nxt-btns"
  >
    <img
      src={leftbtn}
      alt="icon"
      style={{ width: "50px", height: "auto", maxWidth: "100%" }}
    />
  </button>
      <button
  type="button"
  onClick={handleSubmit}
  className="nxt-btns"
  disabled={isLoading}
>
  {isLoading ? "..." : ""}
  <img
              src={rightbtn}
              alt="icon"
              style={{ width: "50px", height: "auto", maxWidth: "100%" }}
            />
</button>
</div>    <br></br>
      {/* Error Popup */}
      {showErrorPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <p className="error">{error}</p>
            <button
              onClick={() => {
                setShowErrorPopup(false);
                if (error === "You've reloaded the page or closed the tab. Please start filling preferences again.") {
                  navigate("/dashboardPreferences");
                }
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Placestostay;
