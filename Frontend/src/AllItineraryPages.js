import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./ItineraryPage.css";
import instagram from "../src/Asset/instagram.png";
import facebook from "../src/Asset/facebook.png";
import linkedin from "../src/Asset/linkedin.png";
import ithero from"../src/Asset/it-hero.png";
import icon1 from "../src/Asset/Group 284.png";
import icon2 from"../src/Asset/monas tower.png";
import icon3 from"../src/Asset/Food (1).png";
import icon4 from"../src/Asset/Tourist (1).png";
const ItineraryPage2 = () => {
  const [journeyPreferences, setJourneyPreferences] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get query params from the URL
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const fromDate = queryParams.get("from_date");
  const toDate = queryParams.get("to_date");
  const internationalAirport = queryParams.get("international_airport");
  const crewType = queryParams.get("crew_type");

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        // Make an API call to your backend with the from_date and to_date parameters
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          `https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/journeys/itinerary/?from_date=${fromDate}&to_date=${toDate}&international_airport=${internationalAirport}&crew_type_display=${crewType}`, 
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

    if (fromDate && toDate) {
      fetchPreferences();
    }
  }, [fromDate, toDate ,internationalAirport, crewType]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div className="it-container">
           <div ><img className="it-hero" src={ithero} alt=""></img> </div>
      <div className="it-content">
        <h2 className="it-h2">Your Itinerary</h2>
        <div className="it-timeline">
          {/* Places to Visit */}
          {journeyPreferences?.places_to_visit.map((item, index) => (
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
              </div>
            </div>
          ))}

          {/* Travel Details */}
          {journeyPreferences?.travel_details.map((item, index) => (
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
              </div>
            </div>
          ))}

          {/* Stay Preferences */}
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
              </div>
            </div>
          ))}

          {/* Food Preferences */}
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
                    Vegetarian Choice - {item.vegetarian_choice_names.join(", ")}
                  </li>
                  <li>
                    Non-Vegetarian Choice - {item.non_vegetarian_choice_names.join(", ")}
                  </li>
                  <li>
                    Dietary Choice - {item.dietary_choice_names.join(", ")}
                  </li>
                  <li>
                    Balinese Dish - {item.balinese_choice_names.join(", ")}
                  </li>
                </ul>
              </div>
            </div>
          ))}

          {/* Vehicle Preferences */}
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
              </div>
            </div>
          ))}

          {/* Tour Guide Preferences */}
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
                  <li>Tour Guide Language: {item.preferred_languages_names.join(", ")}</li>
                </ul>
              </div>
            </div>
          ))}

          {/* Catering / Chef Preferences */}
          {journeyPreferences?.catering_or_chef.map((item, index) => (
            <div
              key={index}
              className={`it-timeline-item ${index % 2 === 0 ? "left" : "right"}`}
            >
              <div className="it-icon">
              <img src={icon3} alt="it-icon" />
              </div>
              <div className="it-details">
                <h3>Food Service</h3>
                <ul>
                  <li>Service: {item.service_type}</li>
                </ul>
              </div>
            </div>
          ))}

          {/* Paperwork Assistance */}
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
                  <li>Assistance Type: {item.assistance_type_names.join(", ")}</li>
                </ul>
              </div>
            </div>
          ))}

          {/* Vendor Preferences */}
          {journeyPreferences?.vendor.map((item, index) => (
            <div
              key={index}
              className={`it-timeline-item ${index % 2 === 0 ? "left" : "right"}`}
            >
              <div className="it-icon">
              <img src={icon1} alt="it-icon" />
              </div>
              <div className="it-details">
                <h3>Vendor</h3>
                <ul>
                  <li>Categories: {item.vendor_type_names.join(", ")}</li>
                </ul>
              </div>
            </div>
          ))}

          {/* Extra Requests */}
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
              </div>
            </div>
          ))}

        </div>
      </div>

     
      <div className="Get-Started-footer">
        <table class="footer-table">
          <thead>
            <tr>
              <th class="footer-table-tr1">Only 2 Bali</th>
              <th class="footer-table-tr2">
                <img src={facebook} className="social-icon" alt="Facebook" />
                <img src={instagram} className="social-icon" alt="Instagram" />
                <img src={linkedin} className="social-icon" alt="LinkedIn" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="copyright">Copyright ©2024 Only2Bali. All Rights Reserved</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItineraryPage2;
