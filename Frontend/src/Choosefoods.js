import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Choosefoods.css";
import leftbtn from "../src/Asset/Button 2.png";
import rightbtn from "../src/Asset/Button 3.png";
// Import images
import food1 from "../src/Asset/food1.png";
import food2 from "../src/Asset/food2.png";
import food3 from "../src/Asset/food3.png";
import food4 from "../src/Asset/food4.png";
import food5 from "../src/Asset/food5.png";
import food6 from "../src/Asset/food6.png";
import food7 from "../src/Asset/food7.png";
import food8 from "../src/Asset/food8.png";
import food9 from "../src/Asset/food9.png";
import food10 from "../src/Asset/food10.png";
import food11 from "../src/Asset/food11.png";
import food12 from "../src/Asset/food12.png";
import food13 from "../src/Asset/food13.png";
import food14 from "../src/Asset/food14.png";

// Food categories
const vegetarian = [
  { id: 1, type: "north_indian", name: "North Indian Vegetarian", img: food1 },
  { id: 2, type: "south_indian", name: "South Indian Vegetarian", img: food2 },
  { id: 3, type: "gujarati", name: "Gujarati", img: food3 },
  { id: 4, type: "jain", name: "Jain", img: food4 },
];

const balinese = [
  { id: 1, type: "jimbaran_seafood", name: "Jimbaran Seafood", img: food5 },
  { id: 2, type: "balinese_culinary", name: "Balinese Culinary", img: food6 },
  { id: 3, type: "indonesian_food", name: "Indonesian Food", img: food7 },
  { id: 4, type: "local_snacks", name: "Local Snacks", img: food8 },
];

const dietary = [
  { id: 1, type: "vegan", name: "Vegan", img: food9 },
  { id: 2, type: "keto", name: "Keto", img: food10 },
  { id: 3, type: "halal", name: "Halal", img: food11 },
  { id: 4, type: "souvenir", name: "Souvenir", img: food12 },
];

const nonveg = [
  { id: 1, type: "north_indian", name: "North Indian Non-Vegetarian", img: food13 },
  { id: 2, type: "south_indian", name: "South Indian Non-Vegetarian", img: food14 },
];

const Choosefoods = () => {
  const [selectedFoods, setSelectedFoods] = useState({
    vegetarian_choice: [],
    non_vegetarian_choice: [],
    dietary_choice: [],
    balinese_choice: [],
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [journeyPreferencesId, setJourneyPreferencesId] = useState(null);
  const [existingFoodPreferences, setExistingFoodPreferences] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const id = sessionStorage.getItem("journeyPreferencesId");
    if (id) {
      setJourneyPreferencesId(id);
      fetchFoodPreferences(id); // Fetch existing food preferences if available
    } else {
      setError("You've reloaded the page or closed the tab. Please start filling preferences again.");
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

  const fetchFoodPreferences = async (journeyPreferencesId) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await axios.get(
        `https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/journeys/food-preferences/?journey_preferences_id=${journeyPreferencesId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        setExistingFoodPreferences(response.data);
        setSelectedFoods({
          vegetarian_choice: response.data.vegetarian_choice || [],
          non_vegetarian_choice: response.data.non_vegetarian_choice || [],
          dietary_choice: response.data.dietary_choice || [],
          balinese_choice: response.data.balinese_choice || [],
        });
      }
    } catch (err) {
      console.error("API Error:", err.response?.data);
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

  const updateFoodPreferences = async (journeyPreferencesId, payload) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await axios.put(
        `https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/journeys/food-preferences/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        console.log("Food preferences updated successfully");
        navigate("/ExtraRequest")     }
    } catch (err) {
      console.error("Error updating food preferences:", err);
      setError("Failed to update food preferences");
    }
  };

  const getCategoryKey = (category) => {
    switch (category) {
      case "vegetarian":
        return "vegetarian_choice";
      case "nonveg":
        return "non_vegetarian_choice";
      case "dietary":
        return "dietary_choice";
      case "balinese":
        return "balinese_choice";
      default:
        return "";
    }
  };

  const handleFoodSelect = (category, id) => {
    setSelectedFoods((prev) => {
      const categoryKey = getCategoryKey(category);
      const currentSelections = [...prev[categoryKey]];
      if (currentSelections.includes(id)) {
        return {
          ...prev,
          [categoryKey]: currentSelections.filter((t) => t !== id),
        };
      }
      const totalSelected = Object.values(prev).flat().length;
      if (totalSelected >= 4) {
        setError("You can only select up to 4 food preferences");
        return prev;
      }
      return {
        ...prev,
        [categoryKey]: [...currentSelections, id],
      };
    });
    setError("");
  };

  const handleSubmit = async () => {
    if (!journeyPreferencesId) {
      setError("You've reloaded the page or closed the tab. Please start filling preferences again.");
      return;
    }
    const totalSelected = Object.values(selectedFoods).flat().length;
    if (totalSelected === 0) {
      setError("Please select at least one food preference");
      return;
    }
    const payload = {
      journey_preferences_id: journeyPreferencesId,
      vegetarian_choice: selectedFoods.vegetarian_choice || [],
      non_vegetarian_choice: selectedFoods.non_vegetarian_choice || [],
      dietary_choice: selectedFoods.dietary_choice || [],
      balinese_choice: selectedFoods.balinese_choice || [],
    };
    setIsLoading(true);
    try {
      if (existingFoodPreferences) {
        await updateFoodPreferences(journeyPreferencesId, payload);
      } else {
        const response = await axios.post(
          "https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/journeys/food-preferences/",
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 201) {
          navigate("/ExtraRequest");
        }
      }
    } catch (err) {
      console.error("API Error:", err.response?.data);
      setError(err.response?.data?.message || "An error occurred");
      if (window.confirm("Your session is expired. Please log in again")) {
        navigate('/signin');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="foods-container">
      <div className="loading-bar-container">
    <div className="loading-bar" style={{ width: "45%" }}></div>
  </div>
      <h1 className="ptv-h1">
        The Thing You Will Miss Most About India is The Food
      </h1>
      <p className="ptv-p">
        So tell us what the dishes are like when you come home and are greeted by your family.
      </p>

      <h2 className="section-title">Vegetarian</h2>
      <div className="food-grid">
        {vegetarian.map((item) => (
          <div
            key={item.id}
            className={`food-card ${selectedFoods.vegetarian_choice.includes(item.id) ? "selected" : ""}`}
          >
            <img src={item.img} alt={item.name} className="food-card-img" />
            <button
              onClick={() => handleFoodSelect("vegetarian", item.id)}
              className={`food-card-button ${selectedFoods.vegetarian_choice.includes(item.id) ? "selected" : ""}`}
              disabled={selectedFoods.vegetarian_choice.length >= 4 && !selectedFoods.vegetarian_choice.includes(item.id)}
            >
              {selectedFoods.vegetarian_choice.includes(item.id)
                ? "✓ Selected"
                : `+ ${item.name}`}
            </button>
          </div>
        ))}
      </div>

      <h2 className="section-title">Balinese Food</h2>
      <div className="food-grid">
        {balinese.map((item) => (
          <div
            key={item.id}
            className={`food-card ${selectedFoods.balinese_choice.includes(item.id) ? "selected" : ""}`}
          >
            <img src={item.img} alt={item.name} className="food-card-img" />
            <button
              onClick={() => handleFoodSelect("balinese", item.id)}
              className={`food-card-button ${selectedFoods.balinese_choice.includes(item.id) ? "selected" : ""}`}
              disabled={selectedFoods.balinese_choice.length >= 4 && !selectedFoods.balinese_choice.includes(item.id)}
            >
              {selectedFoods.balinese_choice.includes(item.id)
                ? "✓ Selected"
                : `+ ${item.name}`}
            </button>
          </div>
        ))}
      </div>

      <h2 className="section-title">Other Dietary</h2>
      <div className="food-grid">
        {dietary.map((item) => (
          <div
            key={item.id}
            className={`food-card ${selectedFoods.dietary_choice.includes(item.id) ? "selected" : ""}`}
          >
            <img src={item.img} alt={item.name} className="food-card-img" />
            <button
              onClick={() => handleFoodSelect("dietary", item.id)}
              className={`food-card-button ${selectedFoods.dietary_choice.includes(item.id) ? "selected" : ""}`}
              disabled={selectedFoods.dietary_choice.length >= 4 && !selectedFoods.dietary_choice.includes(item.id)}
            >
              {selectedFoods.dietary_choice.includes(item.id)
                ? "✓ Selected"
                : `+ ${item.name}`}
            </button>
          </div>
        ))}
      </div>

      <h2 className="section-title">Non-Vegetarian</h2>
      <div className="food-grid">
        {nonveg.map((item) => (
          <div
            key={item.id}
            className={`food-card ${selectedFoods.non_vegetarian_choice.includes(item.id) ? "selected" : ""}`}
          >
            <img src={item.img} alt={item.name} className="food-card-img" />
            <button
              onClick={() => handleFoodSelect("nonveg", item.id)}
              className={`food-card-button ${selectedFoods.non_vegetarian_choice.includes(item.id) ? "selected" : ""}`}
              disabled={selectedFoods.non_vegetarian_choice.length >= 4 && !selectedFoods.non_vegetarian_choice.includes(item.id)}
            >
              {selectedFoods.non_vegetarian_choice.includes(item.id)
                ? "✓ Selected"
                : `+ ${item.name}`}
            </button>
          </div>
        ))}
      </div>

      <div className="selection-info">
        Selected: {Object.values(selectedFoods).flat().length}/4
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
        onClick={handleSubmit}
     className="nxt-btns"
        disabled={isLoading} // Removed the check for no selections to allow error popup.
      >
        {isLoading ? "..." : ""}
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

export default Choosefoods;
