import React, { useState, useEffect } from "react";
import "./Indianfood.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import leftbtn from "../src/Asset/Button 2.png";
import rightbtn from "../src/Asset/Button 3.png";
const serviceTypes = [
  { value: "Personal Chef", name: "Personal Chef" },
  { value: "Catering", name: "Catering" },
];

const IndianFood = () => {
  const navigate = useNavigate();
  const [selectedServices, setSelectedServices] = useState(null);
  const [otherService, setOtherService] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [journeyPreferencesId, setJourneyPreferencesId] = useState(null);
  const [existingPreferences, setExistingPreferences] = useState(null);

  useEffect(() => {
    const id = sessionStorage.getItem("journeyPreferencesId");
    if (id) {
      setJourneyPreferencesId(id);
      fetchIndianFoodPreferences(id); // Fetch preferences if available
    } else {
      setError("You've reloaded the page or closed the tab. Please start filling preferences again.");
    }

    const handleBeforeUnload = async () => {
      if (journeyPreferencesId) {
        deleteIndianFoodPreferences(journeyPreferencesId); // Call delete on tab close
      }
      sessionStorage.clear();
      //localStorage.clear();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [journeyPreferencesId]);

  // Fetch existing Indian food preferences if available
  const fetchIndianFoodPreferences = async (journeyPreferencesId) => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await axios.get(
        `https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/journeys/catering-or-chef/?journey_preferences_id=${journeyPreferencesId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setExistingPreferences(response.data);
        setSelectedServices(response.data.service_type || null);
        setOtherService(response.data.other_service || "");
      }
    } catch (err) {
      console.error("API Error:", err.response?.data);
    }
  };

  // Delete the preferences when the tab is closed
  const deleteIndianFoodPreferences = async (journeyPreferencesId) => {
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
        console.log("Indian food preferences deleted successfully");
      }
    } catch (err) {
      console.error("Error deleting preferences:", err);
    }
  };

  const handleServiceSelect = (serviceValue) => {
    // Toggle selection: deselect if already selected
    if (selectedServices === serviceValue) {
      setSelectedServices(null);
    } else {
      setSelectedServices(serviceValue);
    }
    setError("");
  };

  const handleSubmit = async () => {
    if (!journeyPreferencesId) {
      setError("You've reloaded the page or closed the tab. Please start filling preferences again.");
      return;
    }

    if (!selectedServices) {
      setError("Please select a service");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");

      const serviceType = selectedServices; // The selected service value

      const payload = {
        journey_preferences_id: journeyPreferencesId,
        service_type: serviceType, // Ensure it's in lowercase
        other_service: otherService || null,
      };

      // Check if there are existing preferences and update (PUT) or create new (POST)
      if (existingPreferences) {
        const response = await axios.put(
          `https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/journeys/catering-or-chef/`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          navigate("/vendor");
        }
      } else {
        const response = await axios.post(
          "https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/journeys/catering-or-chef/",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 201) {
          navigate("/vendor");
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
    <div className="in-container">
       <div className="loading-bar-container">
       <div className="loading-bar" style={{ width: "75%" }}></div>
       </div>
      <div className="in-inner">
        <h1 className="in-h1">
          The Ease of Eating Indian Food Anytime and Anywhere!
        </h1>
        <p className="in-p">
          You may find Indian restaurants, but they are far from your hotel.
          Then when you bring a big group, it might be difficult to prepare
          everything. Let the local chef do the cooking for you!
        </p>

        <div className="in-grid">
          {serviceTypes.map((service) => (
            <div className="card" key={service.value}>
              <button
                className={`in-card-button ${
                  selectedServices === service.value ? "selected" : ""
                }`}
                onClick={() => handleServiceSelect(service.value)}
              >
                {selectedServices === service.value
                  ? "✓ Selected"
                  : service.name}
              </button>
            </div>
          ))}
        </div>

        {/* Input for Other Service */}
        {/* <div className="mb-2" style={{ marginTop: "10px" }}>
          <input
            type="text"
            className="in-form-control"
            placeholder="Type Something..."
            value={otherService}
            onChange={(e) => setOtherService(e.target.value)}
          />
        </div> */}

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
            onClick={handleSubmit}
            className="nxt-btns"
            disabled={isLoading} // Only disable during loading
          >
            {isLoading ? "..." : ""}
            <img
              src={rightbtn}
              alt="icon"
              style={{ width: "50px", height: "auto", maxWidth: "100%" }}
            />
          </button>
        </div>
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

export default IndianFood;
