import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./JourneyStart.css";
import vector from "./Asset/vector.png";
import alumnimeeting from "./Asset/alumni-meeting.png";
import businesspartners from "./Asset/business-partners.png";
import corporatemeeting from "./Asset/corporate-meeting.png";
import family from "./Asset/family.png";
import familygettogether from "./Asset/familygettogether.png";
import friendsgettogether from "./Asset/friends-get-together.png";
import newcouple from "./Asset/new-couple.png";
import teambonding from "./Asset/team-bonding.png";
import leftbtn from "../src/Asset/Button 2.png";
import rightbtn from "../src/Asset/Button 3.png";

const JourneyStart = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    occupation: "",
    times_visited_bali: "",
    number_of_people: "",
    crew_type: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [journeyPreferencesId, setJourneyPreferencesId] = useState(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const navigate = useNavigate();

  const crewOptions = [
    {
      id: "business_partners",
      title: "Business Partners",
      description: "Business trips, project survey, or site visits",
      image: businesspartners,
    },
    {
      id: "corporate_meeting",
      title: "Corporate Meeting",
      description: "Corporate events, annual meeting",
      image: corporatemeeting,
    },
    {
      id: "team_bonding",
      title: "Team Bonding",
      description: "Team building and bonding event",
      image: teambonding,
    },
    {
      id: "alumni_meeting",
      title: "Alumni Meeting",
      description: "Reuniting with college friends",
      image: alumnimeeting,
    },
    {
      id: "friends_get_together",
      title: "Friends Get-Together",
      description: "Groups of friends, even your best friends",
      image: friendsgettogether,
    },
    {
      id: "family",
      title: "Family",
      description: "Family with children under 5 y.o",
      image: family,
    },
    {
      id: "new_couple",
      title: "New Couple",
      description: "Couple creating unforgettable memories",
      image: newcouple,
    },
    {
      id: "family_get_together",
      title: "Family Get-Together",
      description: "From Grandma to Grandson",
      image: familygettogether,
    },
  ];

  useEffect(() => {
    const id = sessionStorage.getItem("journeyPreferencesId");
    if (id) {
      setJourneyPreferencesId(id);
      fetchJourneyData(id);
    }

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

  const fetchJourneyData = async (journeyPreferencesId) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await axios.get(
        `https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/journeys/journey-preferences/?journey_preferences_id=${journeyPreferencesId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        setFormData(response.data);
        setIsUpdate(true);
      } else {
        setIsUpdate(false);
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
        console.log("Journey preferences deleted successfully");
      }
    } catch (err) {
      console.error("Error deleting journey preferences:", err);
    }
  };

  const handleCrewSelect = (crewId) => {
    setFormData((prev) => ({
      ...prev,
      crew_type: crewId,
    }));
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For age input, ensure it is within the specified range (1-99)
    if (name === "age") {
      if (value >= 1 && value <= 99) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      } else {
        // Optional: show a message or alert if the value is out of range
        return;
      }
    }

    // For number_of_people input, ensure it is within the specified range (1-100)
    if (name === "number_of_people") {
      if (value >= 1 && value <= 100) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      } else {
        // Optional: show a message or alert if the value is out of range
        return;
      }
    }

    // Update for other form fields
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = {
      name: formData.name,
      age: formData.age,
      occupation: formData.occupation,
      times_visited_bali: formData.times_visited_bali,
      crew_type: formData.crew_type,
      number_of_people: formData.number_of_people,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      setError(`Please fill in: ${missingFields.join(", ")}`);
      setShowErrorPopup(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    const token = localStorage.getItem("access_token");

    try {
      let response;
      if (isUpdate) {
        response = await axios.put(
          `https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/journeys/journey-preferences/`,
          { ...formData, journey_preferences_id: journeyPreferencesId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        response = await axios.post(
          "https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/journeys/journey-preferences/",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (response.status === 200 || response.status === 201) {
        const { id } = response.data;
        sessionStorage.setItem("journeyPreferencesId", id);
        navigate("/Placestovisit");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Session expired. Please login again");
        localStorage.removeItem("access_token");
        window.confirm("Your session is expired. Please log in again");
        navigate("/signin");
      } else {
        setError(err.response?.data?.message || "An error occurred");
      }
      setShowErrorPopup(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="journey-container">
      <div className="row g-0">
        <div className="col-12 col-md-4 section-style form-section">
          <div className="form-wrapper">
            <div className="from-align">
              <h2 className="text-center mb-4" style={{ color: "#fff" }}>
                Your Journey Begins Here
              </h2>
              <img
                className="Start-journey-img"
                src={vector}
                alt="Journey Start"
              />
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    What's Your Name?
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    placeholder="Type Something..."
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="age" className="form-label">
                    How Old Are You?
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="age"
                    name="age"
                    value={formData.age || ""}
                    onChange={handleChange}
                    placeholder="Type Something..."
                    required
                    min="1"
                    max="99"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="occupation" className="form-label">
                    What is your profession?
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="occupation"
                    name="occupation"
                    value={formData.occupation || ""}
                    onChange={handleChange}
                    placeholder="Type Something..."
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="number_of_people" className="form-label">
                    No of people traveling with you?
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="number_of_people"
                    name="number_of_people"
                    value={formData.number_of_people || ""}
                    onChange={handleChange}
                    placeholder="Type Something..."
                    required
                    min="1"
                    max="100"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="times_visited_bali" className="form-label">
                    How Many Times Have You Been to Bali?
                  </label>
                  <select
                    className="form-control"
                    id="times_visited_bali"
                    name="times_visited_bali"
                    value={formData.times_visited_bali || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select an option</option>
                    <option value="first_time">First Time</option>
                    <option value="more_than_5_times">More than 5 times</option>
                    <option value="frequently_visit">Frequently visit</option>
                  </select>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="right-section">
          <h1 style={{ color: "#fff" }}>Tell Us About Your Incredible Crew!</h1>
          <p style={{ color: "#fff" }}>
            The more we know, the better we can tailor your trip
          </p>

          <div className="crew-options">
            {crewOptions.map((crew) => (
              <div
                key={crew.id}
                className={`crew-item ${
                  formData.crew_type === crew.id ? "selected" : ""
                }`}
                onClick={() => handleCrewSelect(crew.id)}
              >
                <img src={crew.image} alt={crew.title} />
                <h3>{crew.title}</h3>
                <p>{crew.description}</p>
                <button
                  type="button"
                  className={`crew-btn ${
                    formData.crew_type === crew.id ? "selected" : ""
                  }`}
                >
                  {formData.crew_type === crew.id ? "✓ Selected" : "+ Choose"}
                </button>
              </div>
            ))}
          </div>

          <br></br>

          <div className="nxt-btnn"   style={{ width: "20%", maxWidth: "100%" }}>
            <button
              onClick={() => navigate(-1)}
              disabled={isLoading}
              className="nxt-btns"
            >
              <img
                src={leftbtn}
                alt="icon"
                style={{ width: "40px", height: "auto", maxWidth: "100%" }}
              />
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="nxt-btns"
            >
              <img
                src={rightbtn}
                alt="icon"
                style={{ width: "40px", height: "auto", maxWidth: "100%" }}
              />

              {isLoading ? "..." : ""}
            </button>
          </div>
        </div>
      </div>

      {/* Error Popup */}
      {showErrorPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <p className="error">{error}</p>
            <button onClick={() => setShowErrorPopup(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JourneyStart;
