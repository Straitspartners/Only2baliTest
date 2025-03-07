
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Placestovisit.css";
import beaches from "../src/Asset/beaches.png";
import cultures from "../src/Asset/cultures.png";
import wellness from "../src/Asset/wellness.png";
import wedding from "../src/Asset/wedding.png";
import adventure from "../src/Asset/adventure.png";
import culinary from "../src/Asset/culinary.png";
import shopping from "../src/Asset/shopping.png";
import luxury from "../src/Asset/luxury.png";
import leftbtn from "../src/Asset/Button 2.png";
import rightbtn from "../src/Asset/Button 3.png";

const categories = [
  { id: 1, name: "Natural Beauty And Beaches", img: beaches },
  { id: 2, name: "Local Cultures & Traditions", img: cultures },
  { id: 3, name: "Wellness & Relaxation", img: wellness },
  { id: 4, name: "Wedding & Pre-Wedding", img: wedding },
  { id: 5, name: "Adventure & Activities", img: adventure },
  { id: 6, name: "Local Culinary", img: culinary },
  { id: 7, name: "Shopping In Bali", img: shopping },
  { id: 8, name: "Luxury & Unique Experiences", img: luxury },
];

const Placestovisit = () => {
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [journeyPreferencesId, setJourneyPreferencesId] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false); // For PUT vs. POST
  const navigate = useNavigate();

  useEffect(() => {
    const id = sessionStorage.getItem("journeyPreferencesId");
    if (id) {
      setJourneyPreferencesId(id);
      fetchPreviousSelections(id);
    } else {
      setError("You've reloaded the page or closed the tab. Please start filling preferences again.");
    }
 
    // Delete journey data on tab close
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

  const fetchPreviousSelections = async (journeyPreferencesId) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await axios.get(
        `https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/journeys/places-to-visit/?journey_preferences_id=${journeyPreferencesId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (
        response.data &&
        response.data.journey_preferences === parseInt(journeyPreferencesId)
      ) {
        setSelectedPlaces(response.data.place || []);
        setIsUpdate(true);
      } else {
        setIsUpdate(false);
      }
    } catch (err) {
      console.error("API Error:", err.response?.data);
    }
  };

  const handlePlaceSelect = (categoryId) => {
    setSelectedPlaces((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      }
      return [...prev, categoryId];
    });
    setError(""); // Clear previous errors on selection change
  };

  const handleSubmit = async () => {
    if (!journeyPreferencesId) {
      setError("You've reloaded the page or closed the tab. Please start filling preferences again.");
      return;
    }
    if (selectedPlaces.length === 0) {
      setError("Please select at least one place");
      return;
    }
    setIsLoading(true);
    const token = localStorage.getItem("access_token");

    try {
      const response = await axios.post(
        "https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/journeys/places-to-visit/",
        {
          journey_preferences_id: journeyPreferencesId,
          place: selectedPlaces,
          others_description: null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setIsUpdate(true);
        navigate("/BalineseAdventureForm");
      }
    } catch (err) {
      setError("Your session is expired.Please Login again");
      console.error(err);
      if (window.confirm("Your session is expired. Please log in again")) {
        navigate('/signin'); // Redirect to sign-in page
    }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!journeyPreferencesId) {
      setError("You've reloaded the page or closed the tab. Please start filling preferences again.");
      return;
    }
    // Add the same check as in handleSubmit
    if (selectedPlaces.length === 0) {
      setError("Please select at least one place");
      return;
    }
    setIsLoading(true);
    const token = localStorage.getItem("access_token");

    try {
      const response = await axios.put(
        `https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/journeys/places-to-visit/`,
        {
          journey_preferences_id: journeyPreferencesId,
          place: selectedPlaces,
          others_description: null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        navigate("/BalineseAdventureForm");
      }
    } catch (err) {
      setError("An error occurred while updating your selections.");
      console.error(err);
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
    <div className="Ptv-container">
        <div className="loading-bar-container">
    <div className="loading-bar" style={{ width: "15%" }}></div>
  </div>
      <h1 className="ptv-h1">
        Picture Your Perfect Bali: Beaches, Temples, or Adventures?
      </h1>
      <p className="ptv-p">
        Where would you like to see your travel buddy smiling?
      </p>
      <div className="grid">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`card ${
              selectedPlaces.includes(category.id) ? "selected" : ""
            }`}
          >
            <img src={category.img} alt={category.name} className="card-img" />
            <button
              type="button"
              className={`card-button ${
                selectedPlaces.includes(category.id) ? "selected" : ""
              }`}
              onClick={() => handlePlaceSelect(category.id)}
            >
              {selectedPlaces.includes(category.id)
                ? "✓ Selected"
                : `+ ${category.name}`}
            </button>
          </div>
        ))}
      </div>
      
      <br></br>

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
        onClick={isUpdate ? handleUpdate : handleSubmit}
         className="nxt-btns"
        disabled={isLoading}
      >
        {isLoading ? "Submitting..." : ""}
    
            
              <img
                src={rightbtn}
                alt="icon"
                style={{ width: "50px", height: "auto", maxWidth: "100%" }}
              />
      </button>
</div>
      {error && (
        <div className="popup-overlay">
          <div className="popup">
            <p className="error">{error}</p>
            <button
              onClick={() => {
                if (error === "You've reloaded the page or closed the tab. Please start filling preferences again.") {
                  navigate("/dashboardPreferences");
                } else {
                  setError("");
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

export default Placestovisit;
