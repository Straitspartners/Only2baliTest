import React, { useState, useEffect } from "react";
import "./Transports.css";
import vehicle1 from "../src/Asset/motorbike flipped.png";
import vehicle2 from "../src/Asset/bus.png";
import vehicle3 from "../src/Asset/mini bus.png";
import vehicle4 from "../src/Asset/van.png";
import vehicle5 from "../src/Asset/car.png";
import vehicle6 from "../src/Asset/luxury car.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const categories = [
  { id: 8, type: "motorbike", name: "Motorbike > 1-2 People", img: vehicle1 },
  { id: 9, type: "bus", name: "Bus >30 People", img: vehicle2 },
  { id: 10, type: "minibus", name: "Mini Bus > 20-30 People", img: vehicle3 },
  { id: 11, type: "van", name: "Van > 12-15 People", img: vehicle4 },
  { id: 12, type: "car", name: "Car > 5-10 people", img: vehicle5 },
  { id: 13, type: "luxury_car", name: "Luxury Car >5-8 people", img: vehicle6 },
];

const Rents = [
  { id: "1-2 Days", name: "1-2 Days" },
  { id: ">3 Days", name: ">3 Days" },
];

const drivers = [
  { id: "Yes", name: "+ Yes" },
  { id: "No", name: "+ No" },
];

const Transports = () => {
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedRent, setSelectedRent] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [otherPeriod, setOtherPeriod] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [journeyPreferencesId, setJourneyPreferencesId] = useState(null);
  const [existingPreferences, setExistingPreferences] = useState(null);

  useEffect(() => {
    const id = sessionStorage.getItem("journeyPreferencesId");
    if (id) {
      setJourneyPreferencesId(id);
      fetchTransportPreferences(id); // Fetch existing preferences if available
    } else {
      setError("You've reloaded the page or closed the tab. Please start filling preferences again.");
    }

    const handleBeforeUnload = async () => {
      if (journeyPreferencesId) {
        deleteTransportPreferences(journeyPreferencesId); // Call delete function on tab close
      }
      sessionStorage.clear();
      //localStorage.clear();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [journeyPreferencesId]);

  // Fetch existing transport preferences if available
  const fetchTransportPreferences = async (journeyPreferencesId) => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await axios.get(
        `http://192.168.31.111:8000/api/journeys/vehicle-preferences/?journey_preferences_id=${journeyPreferencesId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setExistingPreferences(response.data);
        setSelectedVehicle(response.data.vehicle[0] || null);
        setSelectedRent(response.data.rent_period || null);
        setSelectedDriver(response.data.include_driver || null);
        setOtherPeriod(response.data.other_period || "");
      }
    } catch (err) {
      console.error("API Error:", err.response?.data);
    }
  };

  // Delete the transport preferences on tab close
  const deleteTransportPreferences = async (journeyPreferencesId) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await axios.delete(
        `http://192.168.31.111:8000/api/journeys/journey_preferences/delete/${journeyPreferencesId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        console.log("Transport preferences deleted successfully");
      }
    } catch (err) {
      console.error("Error deleting transport preferences:", err);
    }
  };

  // Handle vehicle selection
  const handleVehicleSelect = (categoryId) => {
    setSelectedVehicle(categoryId);
    setError("");
  };

  // Handle rent period selection
  const handleRentSelect = (rentId) => {
    setSelectedRent(rentId);
    setError("");
  };

  // Handle driver selection
  const handleDriverSelect = (driverId) => {
    setSelectedDriver(driverId);
    setError("");
  };

  // Submit form
  const handleSubmit = async () => {
    if (!journeyPreferencesId) {
      setError("You've reloaded the page or closed the tab. Please start filling preferences again.");
      return;
    }
    if (!selectedVehicle || !selectedRent || !selectedDriver) {
      setError("Please select all required options");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");

      const payload = {
        journey_preferences_id: journeyPreferencesId,
        vehicle: [selectedVehicle],
        rent_period: selectedRent,
        include_driver: selectedDriver,
        other_period: otherPeriod || null,
      };

      // Check if there are existing preferences and update (PUT) or create new (POST)
      if (existingPreferences) {
        const response = await axios.put(
          `http://192.168.31.111:8000/api/journeys/vehicle-preferences/`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          navigate("/Tourguide");
        }
      } else {
        const response = await axios.post(
          "http://192.168.31.111:8000/api/journeys/vehicle-preferences/",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 201) {
          navigate("/Tourguide");
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
    <div className="Ts-container">
      <div className="loading-bar-container">
       <div className="loading-bar" style={{ width: "55%" }}></div>
       </div>
      <div>
        <h1 className="Ts-h1">Now, Choose Your Ride!</h1>
        <p className="ts-p">
          Getting stuck in traffic or lost on the road is a pain. Let the best
          local drivers guide you
        </p>
      </div>
      <div className="content">
        <div className="section section-60">
          <h4 className="ts-h4">Type of vehicle?</h4>
          <div className="ts-grid">
            {categories.map((category) => (
              <div className="card" key={category.id}>
                <img
                  src={category.img}
                  alt={category.name}
                  className="ts-card-imgs"
                />
                <button
                  className={`ts-card-button ${
                    selectedVehicle === category.id ? "selected" : ""
                  }`}
                  onClick={() => handleVehicleSelect(category.id)}
                >
                  {selectedVehicle === category.id
                    ? "✓ Selected"
                    : category.name}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="section section-40">
          <h4 className="ts-h4">Rent Period?</h4>
          <div className="tp-grid">
            {Rents.map((rent) => (
              <div className="card" key={rent.id}>
                <button
                  className={`ts-card-button ${
                    selectedRent === rent.id ? "selected" : ""
                  }`}
                  onClick={() => handleRentSelect(rent.id)}
                >
                  {selectedRent === rent.id ? "✓ Selected" : rent.name}
                </button>
              </div>
            ))}
          </div>
          <form>
            <div
              className="mb-2"
              style={{ justifySelf: "center", textAlign: "center" }}
            >
              <br />
              <input
                type="text"
                className="ts-form-control"
                id="name"
                name="name"
                placeholder="Type Something..."
                value={otherPeriod}
                onChange={(e) => setOtherPeriod(e.target.value)}
              />
            </div>
          </form>
          <h4 className="ts-h4">Include Driver?</h4>
          <div className="tp-grid">
            {drivers.map((driver) => (
              <div className="card" key={driver.id}>
                <button
                  className={`ts-card-button ${
                    selectedDriver === driver.id ? "selected" : ""
                  }`}
                  onClick={() => handleDriverSelect(driver.id)}
                >
                  {selectedDriver === driver.id ? "✓ Selected" : driver.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="ts-btn">
        <button
          onClick={handleSubmit}
          className="Go-next"
          style={{ color: "white" }}
          disabled={isLoading} // Removed selection-based disabling
        >
          {isLoading ? "Submitting..." : "Go Next"}
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

export default Transports;
