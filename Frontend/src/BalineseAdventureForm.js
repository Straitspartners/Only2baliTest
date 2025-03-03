import "./balineseAdventureForm.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BalineseAdventureForm = () => {
  const [formData, setFormData] = useState({
    from_date: "",
    to_date: "",
    international_airport: "",
    flight_class: "Economy",
  });
  const airports = [
    {
      icao_code: 'Indira Gandhi International Airport (Delhi)',
      airport_name: 'Indira Gandhi International Airport (Delhi)',
      available_classes: ['Economy', 'Business', 'First Class']
    },
    {
      icao_code: 'Chhatrapati Shivaji Maharaj International Airport (Mumbai)',
      airport_name: 'Chhatrapati Shivaji Maharaj International Airport (Mumbai)',
      available_classes: ['Economy', 'Business', 'First Class']
    },
    {
      icao_code: 'Kempegowda International Airport (Bangalore)',
      airport_name: 'Kempegowda International Airport (Bangalore)',
      available_classes: ['Economy', 'Business', 'First Class']
    },
    {
      icao_code: 'Netaji Subhas Chandra Bose International Airport (Kolkata)',
      airport_name: 'Netaji Subhas Chandra Bose International Airport (Kolkata)',
      available_classes: ['Economy', 'Business', 'First Class']
    },
    {
      icao_code: 'Chennai International Airport (Chennai)',
      airport_name: 'Chennai International Airport (Chennai)',
      available_classes: ['Economy', 'Business', 'First Class']
    },
    {
      icao_code: 'Rajiv Gandhi International Airport (Hyderabad)',
      airport_name: 'Rajiv Gandhi International Airport (Hyderabad)',
      available_classes: ['Economy', 'Business', 'First Class']
    },
    {
      icao_code: 'Sardar Vallabhbhai Patel International Airport (Ahmedabad)',
      airport_name: 'Sardar Vallabhbhai Patel International Airport (Ahmedabad)',
      available_classes: ['Economy', 'Business', 'First Class']
    },
  ];
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [journeyPreferencesId, setJourneyPreferencesId] = useState(null);
  const [existingData, setExistingData] = useState(null); // To store existing travel details
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const navigate = useNavigate();

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const id = sessionStorage.getItem("journeyPreferencesId");
    if (id) {
      setJourneyPreferencesId(id);
      fetchTravelDetails(id); // Fetch travel details if ID exists
    } else {
      setError("You've reloaded the page or closed the tab. Please start filling preferences again.");
      setShowErrorPopup(true);
    }

    // Add event listener for beforeunload to delete data when the tab is closed
    const handleBeforeUnload = async () => {
      if (journeyPreferencesId) {
        deleteJourneyData(journeyPreferencesId); // Call delete function on tab close
      }
      // Clear sessionStorage and localStorage
      sessionStorage.clear();
      //localStorage.clear();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [journeyPreferencesId]);

  const fetchTravelDetails = async (journeyPreferencesId) => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await axios.get(
        `https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/journeys/travel-details/?journey_preferences_id=${journeyPreferencesId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.data) {
        setFormData({
          from_date: "",
          to_date: "",
          international_airport: "",
          flight_class: "Economy",
        });
        setExistingData(null);
      } else {
        setExistingData(response.data); // Store existing data
        setFormData({
          from_date: response.data.from_date || "",
          to_date: response.data.to_date || "",
          international_airport: response.data.international_airport || "",
          flight_class: response.data.flight_class || "Economy",
        });
      }
    } catch (err) {
      console.error("API Error:", err.response?.data);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateDates = () => {
    const fromDate = new Date(formData.from_date);
    const toDate = new Date(formData.to_date);
    return fromDate < toDate;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.from_date ||
      !formData.to_date ||
      !formData.international_airport ||
      !formData.flight_class
    ) {
      setError("Please fill all fields");
      setShowErrorPopup(true);
      return;
    }

    if (!validateDates()) {
      setError("To date must be after From date");
      setShowErrorPopup(true);
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem("access_token");

    try {
      const response = existingData
        ? await axios.put(
            `https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/journeys/travel-details/`,
            {
              journey_preferences_id: journeyPreferencesId,
              ...formData,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          )
        : await axios.post(
            "https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/journeys/travel-details/",
            {
              journey_preferences_id: journeyPreferencesId,
              ...formData,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

      if (response.status === 201 || response.status === 200) {
        navigate("/placetostay");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
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
    <div className="adventure-form">
       <div className="loading-bar-container">
       <div className="loading-bar" style={{ width: "25%" }}></div>
       </div>
      <h2>When Will This Balinese Adventure Begin?</h2>
      <p className="ba-p">
        The more specific you are, the more we can ensure your experience on this paradise island.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="form-actions">
            <div className="col-md-3 ">
              <label className="form-label">From</label>
              <input
                type="date"
                name="from_date"
                value={formData.from_date}
                onChange={handleChange}
                className="form-control"
                required
                min={today}
              />
            </div>

            <div className="col-md-3 ">
              <label htmlFor="toDate" className="form-label">
                To
              </label>
              <input
                type="date"
                name="to_date"
                value={formData.to_date}
                onChange={handleChange}
                className="form-control"
                required
                min={today}
              />
            </div>

            <div className="col-md-3 ">
              <label className="form-label">International Airport</label>
              <select
                name="international_airport"
                value={formData.international_airport}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">Select an Airport</option>
                {airports.map((airport) => (
                  <option key={airport.icao_code} value={airport.icao_code}>
                    {airport.airport_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3 ">
              <label className="form-label">Flight Class</label>
              <select
                name="flight_class"
                value={formData.flight_class}
                className="form-control custom-select"
                onChange={handleChange}
                required
                id="flightClass"
              >
                <option value="Economy">Economy</option>
                <option value="Business">Business</option>
                <option value="First Class">First Class</option>
              </select>
            </div>
          </div>
        </div>

        <div className="Bd-btn">
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-success"
          >
            {isLoading ? "Submitting..." : "Go-Next"}
          </button>
        </div>
      </form>

      {/* Error Popup */}
      {showErrorPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <p className="error">{error}</p>
            <button
              onClick={() => {
                setShowErrorPopup(false);
                // If journeyPreferencesId was not found, navigate to signin
                if (!journeyPreferencesId) {
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

export default BalineseAdventureForm;
