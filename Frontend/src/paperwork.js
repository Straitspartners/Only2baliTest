import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./paperwork.css";
import leftbtn from "../src/Asset/Button 2.png";
import rightbtn from "../src/Asset/Button 3.png";
const assistanceTypes = [
  { id: 1, name: "KYC Integration" },
  { id: 2, name: "Visa Processing Assistance" },
  { id: 3, name: "Travel Requirement Guidance" },
];

const Paperwork = () => {
  const [showInput, setShowInput] = useState(false);
  const navigate = useNavigate();
  const [selectedAssistance, setSelectedAssistance] = useState([]);
  const [otherAssistance, setOtherAssistance] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [journeyPreferencesId, setJourneyPreferencesId] = useState(null);
  const [existingPreferences, setExistingPreferences] = useState(null);

  useEffect(() => {
    const id = sessionStorage.getItem("journeyPreferencesId");
    if (id) {
      setJourneyPreferencesId(id);
      fetchPaperworkPreferences(id); // Fetch preferences if available
    } else {
      setError("You've reloaded the page or closed the tab. Please start filling preferences again.");
    }

    const handleBeforeUnload = async () => {
      if (journeyPreferencesId) {
        deletePaperworkPreferences(journeyPreferencesId); // Call delete on tab close
      }
      sessionStorage.clear();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [journeyPreferencesId]);

  // Fetch existing paperwork preferences if available
  const fetchPaperworkPreferences = async (journeyPreferencesId) => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await axios.get(
        `https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/journeys/paperwork-assistance/?journey_preferences_id=${journeyPreferencesId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setExistingPreferences(response.data);
        setSelectedAssistance(response.data.assistance_type || []);
        setOtherAssistance(response.data.other_assistance || "");
      }
    } catch (err) {
      console.error("API Error:", err.response?.data);
    }
  };

  // Delete the preferences when the tab is closed
  const deletePaperworkPreferences = async (journeyPreferencesId) => {
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
        console.log("Paperwork preferences deleted successfully");
      }
    } catch (err) {
      console.error("Error deleting preferences:", err);
    }
  };

  const handleAssistanceSelect = (assistanceId) => {
    setSelectedAssistance((prev) => {
      if (prev.includes(assistanceId)) {
        return prev.filter((id) => id !== assistanceId);
      }
      if (prev.length >= 3) {
        setError("You can only select up to 3 assistance types");
        return prev;
      }
      setError("");
      return [...prev, assistanceId];
    });
  };

  const handleSubmit = async () => {
    if (!journeyPreferencesId) {
      setError("You've reloaded the page or closed the tab. Please start filling preferences again.");
      return;
    }

    if (selectedAssistance.length === 0) {
      setError("Please select at least one assistance type");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");

      const payload = {
        journey_preferences_id: journeyPreferencesId,
        assistance_type: selectedAssistance, // The selected assistance types
        other_assistance: otherAssistance || null, // Pass null if no other assistance is provided
      };

      // Check if there are existing preferences and update (PUT) or create new (POST)
      if (existingPreferences) {
        const response = await axios.put(
          `https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/journeys/paperwork-assistance/`,
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
          "https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/journeys/paperwork-assistance/",
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
    <div className="pw-container">
          <div className="loading-bar-container">
       <div className="loading-bar" style={{ width: "85%" }}></div>
       </div>
      <div className="backgroundss">
        <h1 className="pw-h1">Don't Forget About All The Paperwork!</h1>
        <p className="pw-p">
          These are the things that will drain your energy the most before leaving, need assistance?
        </p>

        <div className="options">
          {assistanceTypes.map((assistance) => (
            <div className="options" key={assistance.id}>
              <button
                className={`option ${selectedAssistance.includes(assistance.id) ? "selected" : ""}`}
                onClick={() => handleAssistanceSelect(assistance.id)}
                disabled={
                  selectedAssistance.length >= 3 && !selectedAssistance.includes(assistance.id)
                }
              >
                {selectedAssistance.includes(assistance.id)
                  ? "✓ Selected"
                  : assistance.name}
              </button>
            </div>
          ))}
        </div>

        {/* "Others" Section */}
        <form>
          <div className="mb-2" style={{ textAlign: "center" }}>
            <label
              htmlFor="others"
              className="others"
              style={{ color: "black", cursor: "pointer" }}
              onClick={() => setShowInput(true)}
            >
              Others
            </label>
            <br />
            {showInput && (
              <input
                type="text"
                className="ts-form-control"
                id="others"
                name="others"
                placeholder="Type Something..."
                value={otherAssistance}
                onChange={(e) => setOtherAssistance(e.target.value)}
              />
            )}
          </div>
        </form>

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

export default Paperwork;
