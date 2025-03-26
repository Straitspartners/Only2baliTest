import "./balineseAdventureForm.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import leftbtn from "../src/Asset/Button 2.png";
import rightbtn from "../src/Asset/Button 3.png";

const BalineseAdventureForm = () => {
  const [formData, setFormData] = useState({
    from_date: "",
    to_date: "",
    international_airport: "",
    flight_class: "Economy",
  });
  const airports = [
    {
      icao_code: "VOBZ",
      airport_name: "Coimbatore International Airport (Coimbatore)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VOMM",
      airport_name: "Chennai International Airport (Chennai)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VOMD",
      airport_name: "Madurai International Airport (Madurai)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VIDP",
      airport_name: "Indira Gandhi International Airport (New Delhi)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VABB",
      airport_name:
        "Chhatrapati Shivaji Maharaj International Airport (Mumbai)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VOBL",
      airport_name: "Kempegowda International Airport (Bengaluru)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VECC",
      airport_name:
        "Netaji Subhas Chandra Bose International Airport (Kolkata)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VOHS",
      airport_name: "Rajiv Gandhi International Airport (Hyderabad)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VAAH",
      airport_name:
        "Sardar Vallabhbhai Patel International Airport (Ahmedabad)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VAPO",
      airport_name: "Pune International Airport (Pune)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VOCI",
      airport_name: "Cochin International Airport (Kochi)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VOGO",
      airport_name: "Goa International Airport (Dabolim, Goa)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VOTV",
      airport_name: "Trivandrum International Airport (Thiruvananthapuram)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VOML",
      airport_name: "Mangalore International Airport (Mangalore)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VIJP",
      airport_name: "Jaipur International Airport (Jaipur)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VEBS",
      airport_name: "Biju Patnaik International Airport (Bhubaneswar)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VOVZ",
      airport_name: "Visakhapatnam International Airport (Visakhapatnam)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VISR",
      airport_name: "Srinagar International Airport (Srinagar)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VILK",
      airport_name: "Lucknow International Airport (Lucknow)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VICG",
      airport_name: "Chandigarh International Airport (Chandigarh)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VABO",
      airport_name: "Vadodara International Airport (Vadodara)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VAST",
      airport_name: "Surat International Airport (Surat)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VEIM",
      airport_name: "Imphal International Airport (Imphal)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VEBD",
      airport_name: "Bagdogra International Airport (Bagdogra)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VEGY",
      airport_name: "Gaya International Airport (Gaya)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VORJ",
      airport_name: "Rajahmundry Airport (Rajahmundry)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VIDO",
      airport_name: "Dehradun Airport (Dehradun)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VIJU",
      airport_name: "Jammu Airport (Jammu)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VOBM",
      airport_name: "Belagavi Airport (Belagavi)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VIKA",
      airport_name: "Kanpur Airport (Kanpur)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VOPB",
      airport_name: "Port Blair Airport (Port Blair)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VABJ",
      airport_name: "Bhuj Airport (Bhuj)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VEAG",
      airport_name: "Agartala Airport (Agartala)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VAAU",
      airport_name: "Aurangabad Airport (Aurangabad)",
      available_classes: ["Economy", "Business", "First Class"],
    },
    {
      icao_code: "VIKP",
      airport_name: "Kolhapur Airport (Kolhapur)",
      available_classes: ["Economy", "Business", "First Class"],
    },
  ];

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [journeyPreferencesId, setJourneyPreferencesId] = useState(null);
  const [existingData, setExistingData] = useState(null); // To store existing travel details
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const navigate = useNavigate();

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const id = sessionStorage.getItem("journeyPreferencesId");
    if (id) {
      setJourneyPreferencesId(id);
      fetchTravelDetails(id); // Fetch travel details if ID exists
    } else {
      setError(
        "You've reloaded the page or closed the tab. Please start filling preferences again."
      );
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
        navigate("/signin");
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
        The more specific you are, the more we can ensure your experience on
        this paradise island.
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
                  <option key={airport.airport_name} value={airport.airport_name}>
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

        <br></br>

        <div className="nxt-btn"  >
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
          <button type="submit" disabled={isLoading} className="nxt-btns">
            {isLoading ? "..." : ""}
            <img
              src={rightbtn}
              alt="icon"
              style={{ width: "50px", height: "auto", maxWidth: "100%" }}
            />
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
