// import React, { useState, useEffect } from "react";
// import "./vendor.css";
// import organizer from "../src/Asset/organizer.png";
// import vegetables from "../src/Asset/vegetablevendors.png";
// import utensils from "../src/Asset/utensilsvendors.png";
// import travel from "../src/Asset/travelagent.png";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const vendors = [

//   { id: 4, type: "event_organizer", name: "Event Organizer", img: organizer },
//   { id: 3, type: "travel_agent", name: "Travel Agent", img: travel },
//   { id: 2, type: "utensil", name: "Utensil Vendors", img: utensils },
//   { id: 1, type: "vegetable", name: "Vegetable Vendors", img: vegetables },

// ];

// const Vendor = () => {
//   const [selectedVendors, setSelectedVendors] = useState([]);
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [journeyPreferencesId, setJourneyPreferencesId] = useState(null);
//   const [existingPreferences, setExistingPreferences] = useState(null);
//   const navigate = useNavigate();

//   // On component mount, get the journeyPreferencesId from session storage.
//   useEffect(() => {
//     const id = sessionStorage.getItem("journeyPreferencesId");
//     console.log("Retrieved journeyPreferencesId:", id);
//     if (id) {
//       setJourneyPreferencesId(id);
//       fetchVendorPreferences(id);
//     } else {
//       setError("You've reloaded the page or closed the tab. Please start filling preferences again.");
//     }
//   }, []);

//   // Clear session and local storage synchronously on unload.
//   useEffect(() => {
//     const handleBeforeUnload = () => {
//       sessionStorage.clear();
//       //localStorage.clear();
//     };
//     window.addEventListener("beforeunload", handleBeforeUnload);
//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, []);

//   // If the error indicates the journey ID is missing, auto-navigate to signin after a delay.
//   useEffect(() => {
//     if (error === "You've reloaded the page or closed the tab. Please start filling preferences again.") {
//       const timer = setTimeout(() => {
//         navigate("/signin");
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [error, navigate]);

//   const fetchVendorPreferences = async (journeyPreferencesId) => {
//     const token = localStorage.getItem("access_token");
//     try {
//       const response = await axios.get(
//         `http://192.168.31.111:8000/api/journeys/vendor/?journey_preferences_id=${journeyPreferencesId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       if (response.data) {
//         setExistingPreferences(response.data);
//         setSelectedVendors(response.data.vendor_type || []);
//       }
//     } catch (err) {
//       console.error("API Error:", err.response?.data);
//     }
//   };

//   const handleVendorSelect = (vendorId) => {
//     setSelectedVendors((prev) => {
//       if (prev.includes(vendorId)) {
//         return prev.filter((id) => id !== vendorId);
//       }
//       if (prev.length >= 3) {
//         setError("You can only select up to 3 vendors.");
//         return prev;
//       }
//       setError("");
//       return [...prev, vendorId];
//     });
//   };

//   const handleSubmit = async () => {
//     if (!journeyPreferencesId) {
//       setError("You've reloaded the page or closed the tab. Please start filling preferences again.");
//       return;
//     }
//     if (selectedVendors.length === 0) {
//       setError("Please select at least one vendor");
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const token = localStorage.getItem("access_token");
//       const payload = {
//         journey_preferences_id: journeyPreferencesId,
//         vendor_type: selectedVendors,
//       };

//       if (existingPreferences) {
//         const response = await axios.put(
//           `http://192.168.31.111:8000/api/journeys/vendor/`,
//           payload,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         if (response.status === 200) {
//           navigate("/extrarequest");
//         }
//       } else {
//         const response = await axios.post(
//           "http://192.168.31.111:8000/api/journeys/vendor/",
//           payload,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         if (response.status === 201) {
//           navigate("/extrarequest");
//         }
//       }
//     } catch (err) {
//       console.error("API Error:", err.response?.data);
//       setError(
//         err.response?.data?.message ||
//           "An error occurred while submitting your request."
//       );
//       if (window.confirm("Your session is expired. Please log in again")) {
//         navigate('/signin');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="v-container">
//           <div className="loading-bar-container">
//        <div className="loading-bar" style={{ width: "95%" }}></div>
//        </div>
//       <h1 className="v-h1">Collaborate with Trusted Local Experts</h1>
//       <p className="v-p">
//         Select the vendors you'd like to collaborate with. You can select up to 3 vendors.
//       </p>

//       <div className="card-containers">
//         {vendors.map((vendor) => (
//           <div
//             key={vendor.id}
//             className={`cards ${selectedVendors.includes(vendor.id) ? "selected" : ""}`}
//           >
//             {vendor.img && (
//               <img src={vendor.img} alt={vendor.name} className="card-images" />
//             )}
//             <button
//               type="button"
//               className={`card-buttons ${selectedVendors.includes(vendor.id) ? "selected" : ""}`}
//               onClick={() => handleVendorSelect(vendor.id)}
//               disabled={selectedVendors.length >= 3 && !selectedVendors.includes(vendor.id)}
//             >
//               {selectedVendors.includes(vendor.id) ? "✓ Selected" : `+ ${vendor.name}`}
//             </button>
//           </div>
//         ))}
//       </div>

//       <button
//         type="button"
//         onClick={handleSubmit}
//         className="Go-next"
//         disabled={isLoading}
//       >
//         {isLoading ? "Submitting..." : "Go Next"}
//       </button>

//       {/* {error && (
//         // <div className="popup-overlay">
//         //   <div className="popup">
//         //     <p className="error">{error}</p>
//         //     <button onClick={() => navigate("/signin")}>OK</button>
//         //   </div>
//         // </div>
//       )} */}
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

// export default Vendor;


import React, { useState, useEffect } from "react";
import "./vendor.css";
import organizer from "../src/Asset/organizer.png";
import vegetables from "../src/Asset/vegetablevendors.png";
import utensils from "../src/Asset/utensilsvendors.png";
import travel from "../src/Asset/travelagent.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const vendors = [

  { id: 9, type: "event_organizer", name: "Event Organizer", img: organizer },
  { id: 8, type: "travel_agent", name: "Travel Agent", img: travel },
  { id: 7, type: "utensil", name: "Utensil Vendors", img: utensils },
  { id: 6, type: "vegetable", name: "Vegetable Vendors", img: vegetables },

];

const Vendor = () => {
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [journeyPreferencesId, setJourneyPreferencesId] = useState(null);
  const [existingPreferences, setExistingPreferences] = useState(null);
  const navigate = useNavigate();

  // On component mount, get the journeyPreferencesId from session storage.
  useEffect(() => {
    const id = sessionStorage.getItem("journeyPreferencesId");
    console.log("Retrieved journeyPreferencesId:", id);
    if (id) {
      setJourneyPreferencesId(id);
      fetchVendorPreferences(id);
    } else {
      setError("You've reloaded the page or closed the tab. Please start filling preferences again.");
    }
  }, []);

  // Clear session and local storage synchronously on unload.
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.clear();
      localStorage.clear();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // If the error indicates the journey ID is missing, auto-navigate to signin after a delay.
  useEffect(() => {
    if (error === "You've reloaded the page or closed the tab. Please start filling preferences again.") {
      const timer = setTimeout(() => {
        navigate("/signin");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, navigate]);

  const fetchVendorPreferences = async (journeyPreferencesId) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await axios.get(
        `http://192.168.31.111:8000/api/journeys/vendor/?journey_preferences_id=${journeyPreferencesId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        setExistingPreferences(response.data);
        setSelectedVendors(response.data.vendor_type || []);
      }
    } catch (err) {
      console.error("API Error:", err.response?.data);
    }
  };

  const handleVendorSelect = (vendorId) => {
    setSelectedVendors((prev) => {
      if (prev.includes(vendorId)) {
        return prev.filter((id) => id !== vendorId);
      }
      if (prev.length >= 3) {
        setError("You can only select up to 3 vendors.");
        return prev;
      }
      setError("");
      return [...prev, vendorId];
    });
  };

  const handleSubmit = async () => {
    if (!journeyPreferencesId) {
      setError("You've reloaded the page or closed the tab. Please start filling preferences again.");
      return;
    }
    if (selectedVendors.length === 0) {
      setError("Please select at least one vendor");
      return;
    }
    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const payload = {
        journey_preferences_id: journeyPreferencesId,
        vendor_type: selectedVendors,
      };

      if (existingPreferences) {
        const response = await axios.put(
          `http://192.168.31.111:8000/api/journeys/vendor/`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          navigate("/extrarequest");
        }
      } else {
        const response = await axios.post(
          "http://192.168.31.111:8000/api/journeys/vendor/",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 201) {
          navigate("/extrarequest");
        }
      }
    } catch (err) {
      console.error("API Error:", err.response?.data);
      setError(
        err.response?.data?.message ||
          "An error occurred while submitting your request."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="v-container">
          <div className="loading-bar-container">
       <div className="loading-bar" style={{ width: "95%" }}></div>
       </div>
      <h1 className="v-h1">Collaborate with Trusted Local Experts</h1>
      <p className="v-p">
        Select the vendors you'd like to collaborate with. You can select up to 3 vendors.
      </p>

      <div className="card-containers">
        {vendors.map((vendor) => (
          <div
            key={vendor.id}
            className={`cards ${selectedVendors.includes(vendor.id) ? "selected" : ""}`}
          >
            {vendor.img && (
              <img src={vendor.img} alt={vendor.name} className="card-images" />
            )}
            <button
              type="button"
              className={`card-buttons ${selectedVendors.includes(vendor.id) ? "selected" : ""}`}
              onClick={() => handleVendorSelect(vendor.id)}
              disabled={selectedVendors.length >= 3 && !selectedVendors.includes(vendor.id)}
            >
              {selectedVendors.includes(vendor.id) ? "✓ Selected" : `+ ${vendor.name}`}
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="Go-next"
        disabled={isLoading}
      >
        {isLoading ? "Submitting..." : "Go Next"}
      </button>

      {/* {error && (
        // <div className="popup-overlay">
        //   <div className="popup">
        //     <p className="error">{error}</p>
        //     <button onClick={() => navigate("/signin")}>OK</button>
        //   </div>
        // </div>
      )} */}
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

export default Vendor;
