// import React, { useState, useEffect } from "react";
// import "./Tourguide.css";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const categories = [
//   { id: 1, name: "Tamil" },
//   { id: 2, name: "English" },
//   { id: 3, name: "Hindi" },
//   { id: 4, name: "Marathi" },
//   { id: 5, name: "Gujarati" },
//   { id: 6, name: "Kannada" },
// ];

// const Tourguide = () => {
//   const navigate = useNavigate();
//   const [selectedLanguages, setSelectedLanguages] = useState([]);
//   const [otherLanguage, setOtherLanguage] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [journeyPreferencesId, setJourneyPreferencesId] = useState(null);
//   const [existingPreferences, setExistingPreferences] = useState(null);

//   useEffect(() => {
//     const id = sessionStorage.getItem("journeyPreferencesId");
//     if (id) {
//       setJourneyPreferencesId(id);
//       fetchTourGuidePreferences(id); // Fetch existing preferences if available
//     } else {
//       setError("You've reloaded the page or closed the tab. Please start filling preferences again.");
//     }

//     const handleBeforeUnload = async () => {
//       if (journeyPreferencesId) {
//         deleteTourGuidePreferences(journeyPreferencesId);
//       }
//       sessionStorage.clear();
//       //localStorage.clear();
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);
//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, [journeyPreferencesId]);

//   // Fetch existing tour guide preferences if available
//   const fetchTourGuidePreferences = async (journeyPreferencesId) => {
//     const token = localStorage.getItem("access_token");

//     try {
//       const response = await axios.get(
//         `http://192.168.31.111:8000/api/journeys/tour-guide-preferences/?journey_preferences_id=${journeyPreferencesId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       if (response.data) {
//         setExistingPreferences(response.data);
//         setSelectedLanguages(response.data.preferred_languages || []);
//         setOtherLanguage(response.data.other_language || "");
//       }
//     } catch (err) {
//       console.error("API Error:", err.response?.data);
//     }
//   };

//   // Delete the tour guide preferences on tab close
//   const deleteTourGuidePreferences = async (journeyPreferencesId) => {
//     const token = localStorage.getItem("access_token");
//     try {
//       const response = await axios.delete(
//         `http://192.168.31.111:8000/api/journeys/journey_preferences/delete/${journeyPreferencesId}/`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       if (response.status === 200) {
//         console.log("Tour guide preferences deleted successfully");
//       }
//     } catch (err) {
//       console.error("Error deleting tour guide preferences:", err);
//     }
//   };

//   // Handle language selection
//   const handleLanguageSelect = (categoryId) => {
//     setSelectedLanguages((prev) => {
//       if (prev.includes(categoryId)) {
//         return prev.filter((id) => id !== categoryId);
//       }
//       if (prev.length >= 3) {
//         setError("You can only select up to 3 languages");
//         return prev;
//       }
//       setError("");
//       return [...prev, categoryId];
//     });
//   };

//   // Submit form
//   const handleSubmit = async () => {
//     if (!journeyPreferencesId) {
//       setError("You've reloaded the page or closed the tab. Please start filling preferences again.");
//       return;
//     }
//     if (selectedLanguages.length === 0) {
//       setError("Please select at least one language");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const token = localStorage.getItem("access_token");

//       const payload = {
//         journey_preferences_id: journeyPreferencesId,
//         preferred_languages: selectedLanguages,
//         other_language: otherLanguage || null,
//       };

//       if (existingPreferences) {
//         const response = await axios.put(
//           `http://192.168.31.111:8000/api/journeys/tour-guide-preferences/`,
//           payload,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         if (response.status === 200) {
//           navigate("/Indianfood");
//         }
//       } else {
//         const response = await axios.post(
//           "http://192.168.31.111:8000/api/journeys/tour-guide-preferences/",
//           payload,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         if (response.status === 201) {
//           navigate("/Indianfood");
//         }
//       }
//     } catch (err) {
//       console.error("API Error:", err.response?.data);
//       setError(err.response?.data?.message || "An error occurred");
//       if (window.confirm("Your session is expired. Please log in again")) {
//         navigate('/signin');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="tg-container">
//        <div className="loading-bar-container">
//        <div className="loading-bar" style={{ width: "65%" }}></div>
//        </div>
//       <div className="tg-inner">
//         <h1 className="tg-h1">Want to Find a Hidden Gem? </h1>
//         <p className="tg-p">
//           Hidden Gem destinations can only be found by the knowledgeable guide.
//           Now, how about combining an experienced tour guide with Indian language
//           skills? You'll be like talking to a friend!
//         </p>
//         <h4 className="tg-h4">I Prefer a Tour Guide Who Speaks...</h4>
//         <div className="tg-grid">
//           {categories.map((category) => (
//             <div className="card" key={category.id}>
//               <button
//                 className={`card-button ${
//                   selectedLanguages.includes(category.id) ? "selected" : ""
//                 }`}
//                 onClick={() => handleLanguageSelect(category.id)}
//                 disabled={
//                   selectedLanguages.length >= 3 &&
//                   !selectedLanguages.includes(category.id)
//                 }
//               >
//                 {selectedLanguages.includes(category.id)
//                   ? "✓ Selected"
//                   : category.name}
//               </button>
//             </div>
//           ))}
//         </div>
//         <form>
//           <div
//             className="mb-2"
//             style={{ justifySelf: "left", textAlign: "left" }}
//           >
//             <label
//               htmlFor="name"
//               className="form-label"
//               style={{ color: "black" }}
//             >
//               Others
//             </label>
//             <br />
//             <input
//               type="text"
//               className="ts-form-control"
//               id="7"
//               name="others"
//               placeholder="Type Something..."
//               value={otherLanguage}
//               onChange={(e) => setOtherLanguage(e.target.value)}
//             />
//           </div>
//         </form>
//       </div>
//       <div style={{ justifyItems: "center" }}>
//         <button
//           onClick={handleSubmit}
//           className="Go-next"
//           disabled={isLoading} // Removed check for no selections to allow error popup
//         >
//           {isLoading ? "Submitting..." : "Go Next"}
//         </button>
//       </div>
//       {error && (
//         <div className="popup-overlay">
//           <div className="popup">
//             <p className="error">{error}</p>
//             <button
//               onClick={() => {
//                 if (error === "You've reloaded the page or closed the tab. Please start filling preferences again.") {
//                   navigate("/dashboardPreferences");
//                 } else {
//                   setError("");
//                 }
//               }}
//             >
//               OK
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Tourguide;
import React, { useState, useEffect } from "react";
import "./Tourguide.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const categories = [
  { id: 8, name: "Tamil" },
  { id: 9, name: "English" },
  { id: 10, name: "Hindi" },
  { id: 11, name: "Marathi" },
  { id: 12, name: "Gujarati" },
  { id: 13, name: "Kannada" },
];

const Tourguide = () => {
  const navigate = useNavigate();
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [otherLanguage, setOtherLanguage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [journeyPreferencesId, setJourneyPreferencesId] = useState(null);
  const [existingPreferences, setExistingPreferences] = useState(null);

  useEffect(() => {
    const id = sessionStorage.getItem("journeyPreferencesId");
    if (id) {
      setJourneyPreferencesId(id);
      fetchTourGuidePreferences(id); // Fetch existing preferences if available
    } else {
      setError("You've reloaded the page or closed the tab. Please start filling preferences again.");
    }

    const handleBeforeUnload = async () => {
      if (journeyPreferencesId) {
        deleteTourGuidePreferences(journeyPreferencesId);
      }
      sessionStorage.clear();
      localStorage.clear();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [journeyPreferencesId]);

  // Fetch existing tour guide preferences if available
  const fetchTourGuidePreferences = async (journeyPreferencesId) => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await axios.get(
        `http://192.168.31.111:8000/api/journeys/tour-guide-preferences/?journey_preferences_id=${journeyPreferencesId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        setExistingPreferences(response.data);
        setSelectedLanguages(response.data.preferred_languages || []);
        setOtherLanguage(response.data.other_language || "");
      }
    } catch (err) {
      console.error("API Error:", err.response?.data);
    }
  };

  // Delete the tour guide preferences on tab close
  const deleteTourGuidePreferences = async (journeyPreferencesId) => {
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
        console.log("Tour guide preferences deleted successfully");
      }
    } catch (err) {
      console.error("Error deleting tour guide preferences:", err);
    }
  };

  // Handle language selection
  const handleLanguageSelect = (categoryId) => {
    setSelectedLanguages((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      }
      if (prev.length >= 3) {
        setError("You can only select up to 3 languages");
        return prev;
      }
      setError("");
      return [...prev, categoryId];
    });
  };

  // Submit form
  const handleSubmit = async () => {
    if (!journeyPreferencesId) {
      setError("You've reloaded the page or closed the tab. Please start filling preferences again.");
      return;
    }
    if (selectedLanguages.length === 0) {
      setError("Please select at least one language");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");

      const payload = {
        journey_preferences_id: journeyPreferencesId,
        preferred_languages: selectedLanguages,
        other_language: otherLanguage || null,
      };

      if (existingPreferences) {
        const response = await axios.put(
          `http://192.168.31.111:8000/api/journeys/tour-guide-preferences/`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          navigate("/Indianfood");
        }
      } else {
        const response = await axios.post(
          "http://192.168.31.111:8000/api/journeys/tour-guide-preferences/",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 201) {
          navigate("/Indianfood");
        }
      }
    } catch (err) {
      console.error("API Error:", err.response?.data);
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tg-container">
       <div className="loading-bar-container">
       <div className="loading-bar" style={{ width: "65%" }}></div>
       </div>
      <div className="tg-inner">
        <h1 className="tg-h1">Want to Find a Hidden Gem? </h1>
        <p className="tg-p">
          Hidden Gem destinations can only be found by the knowledgeable guide.
          Now, how about combining an experienced tour guide with Indian language
          skills? You'll be like talking to a friend!
        </p>
        <h4 className="tg-h4">I Prefer a Tour Guide Who Speaks...</h4>
        <div className="tg-grid">
          {categories.map((category) => (
            <div className="card" key={category.id}>
              <button
                className={`card-button ${
                  selectedLanguages.includes(category.id) ? "selected" : ""
                }`}
                onClick={() => handleLanguageSelect(category.id)}
                disabled={
                  selectedLanguages.length >= 3 &&
                  !selectedLanguages.includes(category.id)
                }
              >
                {selectedLanguages.includes(category.id)
                  ? "✓ Selected"
                  : category.name}
              </button>
            </div>
          ))}
        </div>
        <form>
          <div
            className="mb-2"
            style={{ justifySelf: "left", textAlign: "left" }}
          >
            <label
              htmlFor="name"
              className="form-label"
              style={{ color: "black" }}
            >
              Others
            </label>
            <br />
            <input
              type="text"
              className="ts-form-control"
              id="7"
              name="others"
              placeholder="Type Something..."
              value={otherLanguage}
              onChange={(e) => setOtherLanguage(e.target.value)}
            />
          </div>
        </form>
      </div>
      <div style={{ justifyItems: "center" }}>
        <button
          onClick={handleSubmit}
          className="Go-next"
          disabled={isLoading} // Removed check for no selections to allow error popup
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
                  navigate("/signin");
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

export default Tourguide;
