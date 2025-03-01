import React, { useState, useEffect } from "react";
import "./ExtraRequest.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ExtraRequest = () => {
  const [request, setRequest] = useState("");
  const [error, setError] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [journeyPreferencesId, setJourneyPreferencesId] = useState(null);
  const [existingRequest, setExistingRequest] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get the journeyPreferencesId from session storage.
    const id = sessionStorage.getItem("journeyPreferencesId");
    if (id) {
      setJourneyPreferencesId(id);
      fetchExtraRequest(id);
    } else {
      setError("You've reloaded the page or closed the tab. Please start filling preferences again.");
      setShowErrorPopup(true);
    }

    // Clear storage synchronously on page unload/refresh.
    const handleBeforeUnload = () => {
      sessionStorage.clear();
      //localStorage.clear();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const fetchExtraRequest = async (id) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await axios.get(
        `http://192.168.31.111:8000/api/journeys/extra-requests/?journey_preferences_id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        setExistingRequest(response.data);
        setRequest(response.data.requests || "");
      }
    } catch (err) {
      console.error("API Error:", err.response?.data);
    }
  };

  // Removed asynchronous delete in beforeunload as it’s not reliable.
  // If needed, you could call deleteExtraRequest at other safe moments.

  const handleRequestChange = (e) => {
    setRequest(e.target.value);
  };

  const handleSubmit = async () => {
    if (!journeyPreferencesId) {
      setError("You've reloaded the page or closed the tab. Please start filling preferences again.");
      setShowErrorPopup(true);
      return;
    }

    if (!request.trim()) {
      setError("Please enter a request");
      setShowErrorPopup(true);
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem("access_token");
    const payload = {
      journey_preferences_id: journeyPreferencesId,
      requests: request.trim(),
    };

    try {
      if (existingRequest) {
        const response = await axios.put(
          `http://192.168.31.111:8000/api/journeys/extra-requests/`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          navigate("/itineraryPage");
        }
      } else {
        const response = await axios.post(
          "http://192.168.31.111:8000/api/journeys/extra-requests/",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 201) {
          navigate("/itineraryPage");
        }
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

  return (
    <div className="background">
        <div className="loading-bar-container">
       <div className="loading-bar" style={{ width: "100%" }}></div>
       </div>
      <h1>Almost Done!</h1>
      <h4>Any special notes for us?</h4>
      <h4 className="bold-text">Request Box</h4>
      <textarea
        value={request}
        onChange={handleRequestChange}
        placeholder="Type Something..."
        className="input-box"
      />
      <br />
      <button
        onClick={handleSubmit}
        className="submit-button"
        disabled={isLoading}
      >
        {isLoading ? "Submitting..." : "Go-next"}
      </button>

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

export default ExtraRequest;
