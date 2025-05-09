
// import React, { useState, useEffect } from "react";
// import "./ItineraryPage.css";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import ithero from"../src/Asset/it-hero.png";
// import instagram from "../src/Asset/instagram.png";
// import facebook from "../src/Asset/facebook.png";
// import linkedin from "../src/Asset/linkedin.png";
// import icon1 from "../src/Asset/Group 284.png";
// import icon2 from"../src/Asset/monas tower.png";
// import icon3 from"../src/Asset/Food (1).png";
// import icon4 from"../src/Asset/Tourist (1).png";

// const ItineraryPage = () => {
//   const [journeyPreferences, setJourneyPreferences] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const [journeyPreferencesId, setJourneyPreferencesId] = useState(null); // Store journeyPreferencesId for deletion

//   var Handleptv = () => {
//     navigate("/Placestovisit");
//   }
//   var Handlepts = () => {
//     navigate("/placetostay");
//   }
//   var Handlebaf = () => {
//     navigate("/balineseAdventureForm");
//   }

//   var Handlecf = () => {
//     navigate("/choosefoods");
//   }
//   var Handlets = () => {
//     navigate("/Transports");
//   }
//   var Handletd = () => {
//     navigate("/Transports");
//   }
//   var Handletgl = () => {
//     navigate("/Tourguide");
//   }
//   var Handlecf = () => {
//     navigate("/choosefoods");
//   }
//   var Handlepw = () => {
//     navigate("/paperwork");
//   }
//   var Handlefc = () => {
//     navigate("/Indianfood");
//   }
//   var Handlev = () => {
//     navigate("/vendor");
//   }
//   var Handleer = () => {
//     navigate("/ExtraRequest");
//   }

//   const handleCancel = async () => {
//     const confirmCancel = window.confirm("Are you sure you want to cancel and delete the journey preferences?");
//     if (confirmCancel) {
//       if (journeyPreferencesId) {
//         await deleteJourneyPreferences(journeyPreferencesId);
//         navigate("/dashboardpreferences"); // Redirect to the preferences dashboard page after deletion
//       }
//     }
//   };

//   const deleteJourneyPreferences = async (journeyPreferencesId) => {
//     const token = localStorage.getItem("access_token");

//     try {
//       const response = await axios.delete(
//         `https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/journeys/journey_preferences/delete/${journeyPreferencesId}/`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.status === 200) {
//         console.log("Journey preferences deleted successfully");
//       }
//     } catch (err) {
//       console.error("Error deleting journey preferences:", err);
//     }
//   };

//   // const finishJourney = () => {
//   //   const confirmBooking = window.confirm("Booking Confirmed! Our Team will reach out to you shortly.");
//   //   navigate("/dashboardpreferences");
//   //   // if (confirmBooking) {
//   //   //   alert("Booking Confirmed");
//   //   //   navigate("/dashboardpreferences"); // Redirect to the preferences dashboard page
//   //   // }
//   // };
//   // const finishJourney = async () => {
//   //   const confirmBooking = window.confirm("Booking Confirmed! Our Team will reach out to you shortly.");
  
//   //   if (confirmBooking) {
//   //     // Send a GET request to the backend to fetch the itinerary details
//   //     const token = localStorage.getItem("access_token");
//   //     sessionStorage.clear();
  
//   //     try {
//   //       // Make the request to the backend to fetch itinerary data
//   //       const response = await axios.get(
//   //         "http://192.168.31.111:8000/api/journeys/itinerarydate/", // Endpoint to get itineraries (replace with actual endpoint)
//   //         {
//   //           headers: {
//   //             Authorization: `Bearer ${token}`,
//   //           },
//   //         }
//   //       );
  
//   //       // Handle the response (the data can be logged or displayed as needed)
//   //       console.log(response.data);
  
//   //       // After the data is fetched, navigate to the preferences dashboard
//   //       navigate("/dashboardpreferences");
//   //     } catch (error) {
//   //       console.error("Error fetching itinerary data:", error);
//   //       alert("Error fetching itinerary data. Please try again later.");
//   //     }
//   //   }
//   // };
//   const finishJourney = async () => {
//     const confirmBooking = window.confirm("Booking Confirmed! Our Team will reach out to you shortly.");
  
//     if (confirmBooking) {
//       const token = localStorage.getItem("access_token");
//       const journeyPreferencesId = sessionStorage.getItem("journeyPreferencesId"); 
  
//       if (!journeyPreferencesId) {
//         alert("Journey ID not found.");
//         return;
//       }
  
//       try {
//         await axios.patch(
//           `https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/journeys/confirm/${journeyPreferencesId}/`,
//           {},  // No body needed, just updating `confirmed` field
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
  
//         sessionStorage.clear();
//         navigate("/dashboardpreferences");
//       } catch (error) {
//         console.error("Error confirming journey:", error);
//         alert("Error confirming journey. Please try again.");
//       }
//     }
//   };
  
  

//   useEffect(() => {
//     const id = sessionStorage.getItem("journeyPreferencesId");
//     if (id) {
//       setJourneyPreferencesId(id);
//       fetchPreferences(id);
//     } else {
//       setError("You've reloaded the page or closed the tab. Please start filling preferences again.");
//     }

//     const handleBeforeUnload = async () => {
//       if (journeyPreferencesId) {
//         await deleteJourneyPreferences(journeyPreferencesId); // Call delete when the tab is closed
//       }
//       sessionStorage.clear();
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);

//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, [journeyPreferencesId]);

//   const fetchPreferences = async (journeyPreferencesId) => {
//     const token = localStorage.getItem("access_token");

//     try {
//       const response = await axios.get(
//         `https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/journeys/select_preferences/`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setJourneyPreferences(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching preferences:", error);
//       setError("Failed to load preferences.");
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className="it-container">
//       <div ><img className="it-hero" src={ithero} alt=""></img> </div>
//       <div className="it-content">
//         <h2 className="it-h2">Proposed Itinerary</h2>
//         <div className="it-timeline">
//           {journeyPreferences?.placestovisit_preferences.map((item, index) => (
//             <div
//               key={index}
//               className={`it-timeline-item ${index % 2 === 0 ? "left" : "right"}`}
//             >
//               <div className="it-icon">
//                 <img src={icon1} alt="it-icon" />
//               </div>
//               <div className="it-details">
//                 <h3>Picture Your Perfect Bali</h3>
//                 <ul>
//                   <li>Place Name - {item.place_names.join(", ")}</li>
//                 </ul>
//                 <button onClick={Handleptv}>Edit</button>
//               </div>
//             </div>
//           ))}

//           {journeyPreferences?.traveldetails_preferences.map((item, index) => (
//             <div
//               key={index}
//               className={`it-timeline-item ${index % 2 === 0 ? "left" : "right"}`}
//             >
//               <div className="it-icon">
//                 <img src={icon2} alt="it-icon" />
//               </div>
//               <div className="it-details">
//                 <h3>Travel Details</h3>
//                 <ul>
//                   <li>From: {item.from_date}</li>
//                   <li>To: {item.to_date}</li>
//                   <li>Airport: {item.international_airport}</li>
//                   <li>Flight Class: {item.flight_class}</li>
//                 </ul>
//                 <button onClick={Handlebaf} className="it-btn"  > Edit</button>
//               </div>
//             </div>
//           ))}

//           {journeyPreferences?.stay_preferences.map((item, index) => (
//             <div
//               key={index}
//               className={`it-timeline-item ${index % 2 === 0 ? "left" : "right"}`}
//             >
//               <div className="it-icon">
//                 <img src={icon4}  alt="it-icon" />
//               </div>
//               <div className="it-details">
//                 <h3>Where to Stay?</h3>
//                 <ul>
//                   <li>Stay Type - {item.stay_type_names.join(", ")}</li>
//                 </ul>
//                 <button onClick={Handlepts}className="it-btn">Edit</button>
//               </div>
//             </div>
//           ))}

//           {journeyPreferences?.food_preferences.map((item, index) => (
//             <div
//               key={index}
//               className={`it-timeline-item ${index % 2 === 0 ? "left" : "right"}`}
//             >
//               <div className="it-icon">
//                 <img src={icon3} alt="it-icon" />
//               </div>
//               <div className="it-details">
//                 <h3>Food Preferences</h3>
//                 <ul>
//                   <li>
//                     Vegetarian Choice - {item.vegetarian_choice_names.length > 0 ? item.vegetarian_choice_names.join(", ") : "None"}
//                   </li>
//                   <li>
//                     Non-Vegetarian Choice - {item.non_vegetarian_choice_names.length > 0 ? item.non_vegetarian_choice_names.join(", ") : "None"}
//                   </li>
//                   <li>
//                     Dietary Choice - {item.dietary_choice_names.length > 0 ? item.dietary_choice_names.join(", ") : "None"}
//                   </li>
//                   <li>
//                     Balinese Dish - {item.balinese_choice_names.length > 0 ? item.balinese_choice_names.join(", ") : "None"}
//                   </li>
//                 </ul>   
//                 <button onClick={Handlecf}className="it-btn" >Edit</button>
//               </div>
//             </div>
//           ))}

//           {journeyPreferences?.vehicle_preferences.map((item, index) => (
//             <div
//               key={index}
//               className={`it-timeline-item ${index % 2 === 0 ? "left" : "right"}`}
//             >
//               <div className="it-icon">
//                 <img src={icon1} alt="it-icon" />
//               </div>
//               <div className="it-details">
//                 <h3>Choose Your Ride !</h3>
//                 <ul>
//                     <li>
//                       Type of vehicle -  {item.vehicle_names.join(", ")}
//                     </li>
//                     <li> Rent Period - {item.rent_period}</li>
//                     <li> Include Driver - {item.include_driver}</li>
//                 </ul>
//                 <button onClick={Handlets}className="it-btn">Edit</button>
//               </div>
//             </div>
//           ))}

//           {journeyPreferences?.tour_guide_preferences.map((item, index) => (
//             <div
//               key={index}
//               className={`it-timeline-item ${index % 2 === 0 ? "left" : "right"}`}
//             >
//               <div className="it-icon">
//                 <img src={icon2} alt="it-icon" />
//               </div>
//               <div className="it-details">
//                 <h3> Tour Guide </h3>
//                 <ul>
//                     <li> Tour Guide Language : {item.preferred_languages_names.join(", ")}</li>
//                 </ul>
//                 <button onClick={Handletgl}className="it-btn" >Edit</button>
//               </div>
//             </div>
//           ))}
          
//           {journeyPreferences?.catering_chef_preferences.map((item, index) => (
//             <div
//               key={index}
//               className={`it-timeline-item ${index % 2 === 0 ? "left" : "right"}`}
//             >
//               <div className="it-icon">
//                 <img src={icon2}alt="it-icon" />
//               </div>
//               <div className="it-details">
//                 <h3> Food Service </h3>
//                 <ul>
//                     <li> Service  : {item.service_type}</li>
//                 </ul>
//                 <button onClick={Handlefc}className="it-btn" >Edit</button>
//               </div>
//             </div>
//           ))}

// {journeyPreferences?.paperwork_assistance.map((item, index) => (
//             <div
//               key={index}
//               className={`it-timeline-item ${index % 2 === 0 ? "left" : "right"}`}
//             >
//               <div className="it-icon">
//                 <img src={icon4} alt="it-icon" />
//               </div>
//               <div className="it-details">
//                 <h3> Paperwork </h3>
//                 <ul>
//                     <li> Tour Guide Language : {item.assistance_type_names.join(", ")}</li>
//                 </ul>
//                 <button onClick={Handlepw}className="it-btn">Edit</button>
//               </div>
//             </div>
//           ))}

// {journeyPreferences?.vendor.map((item, index) => (
//             <div
//               key={index}
//               className={`it-timeline-item ${index % 2 === 0 ? "left" : "right"}`}
//             >
//               <div className="it-icon">
//                 <img src={icon3} alt="it-icon" />
//               </div>
//               <div className="it-details">
//                 <h3> Vendor </h3>
//                 <ul>
//                 <li>
//                     Categories: {item.vendor_type_names.join(", ")}
//                 </li>
//                 </ul>
//                 <button onClick={Handlev}className="it-btn">Edit</button>
//               </div>
//             </div>
//           ))}

// {journeyPreferences?.extra_requests.map((item, index) => (
//             <div
//               key={index}
//               className={`it-timeline-item ${index % 2 === 0 ? "left" : "right"}`}
//             >
//               <div className="it-icon">
//                 <img src={icon2} alt="it-icon" />
//               </div>
//               <div className="it-details">
//                 <h3> Extra Requests </h3>
//                 <ul>
//                     <li> Message : {item.requests}</li>
//                 </ul>
//                 <button onClick={Handleer}className="it-btn">Edit</button>
                
//               </div>
//             </div>
         
//           ))}

//         </div>

//         <div className="close-btn">
//           <button onClick={handleCancel}>Cancel</button>
//           <button onClick={finishJourney}>Finish</button>
//         </div>
//       </div>
//       <div className="Get-Started-footer">
//         <table class="footer-table">
//           <thead>
//             <tr>
//               <th class="footer-table-tr1">Only 2 Bali</th>
//               <th class="footer-table-tr2">
//                 <img src={facebook} alt="Facebook"  className="social-icon"/>
//                 <img src={instagram} alt="Instagram"  className="social-icon" />
//                 <img src={linkedin} alt="LinkedIn" className="social-icon"/>
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td className="copyright">Copyright ©2024 Only2Bali. All Rights Reserved</td>
//               <td></td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ItineraryPage;
import React, { useState, useEffect } from "react";
import "./ItineraryPage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ithero from "../src/Asset/it-hero.png";
import instagram from "../src/Asset/instagram.png";
import facebook from "../src/Asset/facebook.png";
import linkedin from "../src/Asset/linkedin.png";
import icon1 from "../src/Asset/Group 284.png";
import icon2 from "../src/Asset/monas tower.png";
import icon3 from "../src/Asset/Food (1).png";
import icon4 from "../src/Asset/Tourist (1).png";
import Celebration from "../src/Asset/White And Orange Minimalist Instagram Profile Picture.gif";
const ItineraryPage = () => {
  const [journeyPreferences, setJourneyPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [journeyPreferencesId, setJourneyPreferencesId] = useState(null); // Store journeyPreferencesId for deletion
  const [showPopup, setShowPopup] = useState(false);

  // Navigation handlers
  var Handleptv = () => {
    navigate("/Placestovisit");
  };
  var Handlepts = () => {
    navigate("/placetostay");
  };
  var Handlebaf = () => {
    navigate("/balineseAdventureForm");
  };
  var Handlecf = () => {
    navigate("/choosefoods");
  };
  var Handlets = () => {
    navigate("/Transports");
  };
  var Handletd = () => {
    navigate("/Transports");
  };
  var Handletgl = () => {
    navigate("/Tourguide");
  };
  var Handlepw = () => {
    navigate("/paperwork");
  };
  var Handlefc = () => {
    navigate("/Indianfood");
  };
  var Handlev = () => {
    navigate("/vendor");
  };
  var Handleer = () => {
    navigate("/ExtraRequest");
  };

  // Cancel journey preferences handler
  const handleCancel = async () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel and delete the journey preferences?"
    );
    if (confirmCancel) {
      if (journeyPreferencesId) {
        await deleteJourneyPreferences(journeyPreferencesId);
        navigate("/dashboardpreferences"); // Redirect after deletion
      }
    }
  };

  const deleteJourneyPreferences = async (journeyPreferencesId) => {
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

  // finishJourney now only opens the custom popup
  const finishJourney = () => {
    setShowPopup(true);
  };

  // confirmBooking performs the API call to confirm booking when OK is clicked
  const confirmBooking = async () => {
    setShowPopup(false);
    const token = localStorage.getItem("access_token");
    const journeyPreferencesId = sessionStorage.getItem("journeyPreferencesId");
    if (!journeyPreferencesId) {
      alert("Journey ID not found.");
      return;
    }
    try {
      await axios.patch(
        `https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/journeys/confirm/${journeyPreferencesId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      sessionStorage.clear();
      navigate("/dashboardpreferences");
    } catch (error) {
      console.error("Error confirming journey:", error);
      alert(`Error confirming journey: ${error.response?.data?.error || error.message}`);
    }
  };

  useEffect(() => {
    const id = sessionStorage.getItem("journeyPreferencesId");
    if (id) {
      setJourneyPreferencesId(id);
      fetchPreferences(id);
    } else {
      setError("You've reloaded the page or closed the tab. Please start filling preferences again.");
    }

    const handleBeforeUnload = async () => {
      if (journeyPreferencesId) {
        await deleteJourneyPreferences(journeyPreferencesId); // Call delete when tab is closed
      }
      sessionStorage.clear();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [journeyPreferencesId]);

  const fetchPreferences = async (journeyPreferencesId) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await axios.get(
        `https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/journeys/select_preferences/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setJourneyPreferences(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching preferences:", error);
      setError("Failed to load preferences.");
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="it-container">
      <div>
        <img className="it-hero" src={ithero} alt="Itinerary Hero" />
      </div>
      <div className="it-content">
        <h2 className="it-h2">Proposed Itinerary</h2>
        <div className="it-timeline">
          {journeyPreferences?.placestovisit_preferences.map((item, index) => (
            <div
              key={index}
              className={`it-timeline-item ${index % 2 === 0 ? "left" : "right"}`}
            >
              <div className="it-icon">
                <img src={icon1} alt="it-icon" />
              </div>
              <div className="it-details">
                <h3>Picture Your Perfect Bali</h3>
                <ul>
                  <li>Place Name - {item.place_names.join(", ")}</li>
                </ul>
                <button onClick={Handleptv}>Edit</button>
              </div>
            </div>
          ))}

          {journeyPreferences?.traveldetails_preferences.map((item, index) => (
            <div
              key={index}
              className={`it-timeline-item ${index % 2 === 0 ? "left" : "right"}`}
            >
              <div className="it-icon">
                <img src={icon2} alt="it-icon" />
              </div>
              <div className="it-details">
                <h3>Travel Details</h3>
                <ul>
                  <li>From: {item.from_date}</li>
                  <li>To: {item.to_date}</li>
                  <li>Airport: {item.international_airport}</li>
                  <li>Flight Class: {item.flight_class}</li>
                </ul>
                <button onClick={Handlebaf} className="it-btn">
                  Edit
                </button>
              </div>
            </div>
          ))}

          {journeyPreferences?.stay_preferences.map((item, index) => (
            <div
              key={index}
              className={`it-timeline-item ${index % 2 === 0 ? "left" : "right"}`}
            >
              <div className="it-icon">
                <img src={icon4} alt="it-icon" />
              </div>
              <div className="it-details">
                <h3>Where to Stay?</h3>
                <ul>
                  <li>Stay Type - {item.stay_type_names.join(", ")}</li>
                </ul>
                <button onClick={Handlepts} className="it-btn">
                  Edit
                </button>
              </div>
            </div>
          ))}

          {journeyPreferences?.food_preferences.map((item, index) => (
            <div
              key={index}
              className={`it-timeline-item ${index % 2 === 0 ? "left" : "right"}`}
            >
              <div className="it-icon">
                <img src={icon3} alt="it-icon" />
              </div>
              <div className="it-details">
                <h3>Food Preferences</h3>
                <ul>
                  <li>
                    Vegetarian Choice -{" "}
                    {item.vegetarian_choice_names.length > 0
                      ? item.vegetarian_choice_names.join(", ")
                      : "None"}
                  </li>
                  <li>
                    Non-Vegetarian Choice -{" "}
                    {item.non_vegetarian_choice_names.length > 0
                      ? item.non_vegetarian_choice_names.join(", ")
                      : "None"}
                  </li>
                  <li>
                    Dietary Choice -{" "}
                    {item.dietary_choice_names.length > 0
                      ? item.dietary_choice_names.join(", ")
                      : "None"}
                  </li>
                  <li>
                    Balinese Dish -{" "}
                    {item.balinese_choice_names.length > 0
                      ? item.balinese_choice_names.join(", ")
                      : "None"}
                  </li>
                </ul>
                <button onClick={Handlecf} className="it-btn">
                  Edit
                </button>
              </div>
            </div>
          ))}

          {journeyPreferences?.vehicle_preferences.map((item, index) => (
            <div
              key={index}
              className={`it-timeline-item ${index % 2 === 0 ? "left" : "right"}`}
            >
              <div className="it-icon">
                <img src={icon1} alt="it-icon" />
              </div>
              <div className="it-details">
                <h3>Choose Your Ride!</h3>
                <ul>
                  <li>Type of vehicle - {item.vehicle_names.join(", ")}</li>
                  <li>Rent Period - {item.rent_period}</li>
                  <li>Include Driver - {item.include_driver}</li>
                </ul>
                <button onClick={Handlets} className="it-btn">
                  Edit
                </button>
              </div>
            </div>
          ))}

          {journeyPreferences?.tour_guide_preferences.map((item, index) => (
            <div
              key={index}
              className={`it-timeline-item ${index % 2 === 0 ? "left" : "right"}`}
            >
              <div className="it-icon">
                <img src={icon2} alt="it-icon" />
              </div>
              <div className="it-details">
                <h3>Tour Guide</h3>
                <ul>
                  <li>
                    Tour Guide Language:{" "}
                    {item.preferred_languages_names.join(", ")}
                  </li>
                </ul>
                <button onClick={Handletgl} className="it-btn">
                  Edit
                </button>
              </div>
            </div>
          ))}

          {journeyPreferences?.catering_chef_preferences.map((item, index) => (
            <div
              key={index}
              className={`it-timeline-item ${index % 2 === 0 ? "left" : "right"}`}
            >
              <div className="it-icon">
                <img src={icon2} alt="it-icon" />
              </div>
              <div className="it-details">
                <h3>Food Service</h3>
                <ul>
                  <li>Service: {item.service_type}</li>
                </ul>
                <button onClick={Handlefc} className="it-btn">
                  Edit
                </button>
              </div>
            </div>
          ))}

          {journeyPreferences?.paperwork_assistance.map((item, index) => (
            <div
              key={index}
              className={`it-timeline-item ${index % 2 === 0 ? "left" : "right"}`}
            >
              <div className="it-icon">
                <img src={icon4} alt="it-icon" />
              </div>
              <div className="it-details">
                <h3>Paperwork</h3>
                <ul>
                  <li>Assistance: {item.assistance_type_names.join(", ")}</li>
                </ul>
                <button onClick={Handlepw} className="it-btn">
                  Edit
                </button>
              </div>
            </div>
          ))}

          {journeyPreferences?.vendor.map((item, index) => (
            <div
              key={index}
              className={`it-timeline-item ${index % 2 === 0 ? "left" : "right"}`}
            >
              <div className="it-icon">
                <img src={icon3} alt="it-icon" />
              </div>
              <div className="it-details">
                <h3>Vendor</h3>
                <ul>
                  <li>Categories: {item.vendor_type_names.join(", ")}</li>
                </ul>
                <button onClick={Handlev} className="it-btn">
                  Edit
                </button>
              </div>
            </div>
          ))}

          {journeyPreferences?.extra_requests.map((item, index) => (
            <div
              key={index}
              className={`it-timeline-item ${index % 2 === 0 ? "left" : "right"}`}
            >
              <div className="it-icon">
                <img src={icon2} alt="it-icon" />
              </div>
              <div className="it-details">
                <h3>Extra Requests</h3>
                <ul>
                  <li>Message: {item.requests}</li>
                </ul>
                <button onClick={Handleer} className="it-btn">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Celebratory Popup Modal for booking confirmation */}
        {showPopup && (
          <div style={styles.overlay}>
            <div style={styles.popup}>
              <div style={styles.animationContainer}>
                <img
                  src={Celebration}
                  alt="Celebration Animation"
                  style={styles.animation}
                />
              </div>
              <h2 style={styles.popupTitle}>Booking Confirmed! </h2>
              <p style={styles.popupText}>Our team will reach out to you shortly.</p>
              <button onClick={confirmBooking} style={styles.closeButton}>
             Okay
              </button>
            </div>
          </div>
        )}
        <div className="close-btn">
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={finishJourney}>Finish</button>
        </div>
      </div>
      <div className="Get-Started-footer">
        <table className="footer-table">
          <thead>
            <tr>
              <th className="footer-table-tr1">Only 2 Bali</th>
              <th className="footer-table-tr2">
                <img src={facebook} alt="Facebook" className="social-icon" />
                <img src={instagram} alt="Instagram" className="social-icon" />
                <img src={linkedin} alt="LinkedIn" className="social-icon" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="copyright">
                Copyright ©2024 Only2Bali. All Rights Reserved
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  popup: {
    backgroundColor: "white",
    padding: "10px",
    borderRadius: "12px",
    boxShadow: "0 6px 10px rgba(0,0,0,0.15)",
    textAlign: "center",
    width: "90%",
    maxWidth: "400px",
    position: "relative",
  },
  animationContainer: {
    marginBottom: "0px",
  },
  animation: {
    width: "100%",
    maxWidth: "200px",
  },
  popupTitle: {
    fontSize: "1.8rem",
    margin: "1px 0",
    fontWeight: "bold",
  },
  
  popupText: {
    fontSize: "1rem",
    
  },
  closeButton: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
    display: "block",
    margin: "0 auto"
  },
  
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },}

export default ItineraryPage;
