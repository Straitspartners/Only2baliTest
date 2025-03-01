import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Itinerarydate.css";
import { Link } from "react-router-dom";
import instagram from "../src/Asset/instagram.png";
import facebook from "../src/Asset/facebook.png";
import linkedin from "../src/Asset/linkedin.png";
import ithero1 from"../src/Asset/it-hero1.png";
import iticon1 from "../src/Asset/people.png"
import iticon2 from "../src/Asset/Date.png"
import iticon3 from "../src/Asset/Airport.png"
const ItineraryCard = ({ itinerary }) => {
  return (
    <div className="itinerary-card">
     
      <div className="itinerary-info">
        <p className="info-p"><img alt="date"  className="it-icon" src={iticon2 }></img> From Date: {itinerary.traveldetails__from_date}</p>
        <p className="info-p"><img alt="to_date"  className="it-icon" src={iticon2 }></img>  To Date:{itinerary.traveldetails__to_date}</p>
        <p className="info-p"> <img alt="type" className="it-icon1" src={iticon1 }></img> Crew Type: {itinerary.crew_type_display}</p>
        <p className="info-p"><img alt="travek"  className="it-icon" src={iticon3 }></img> Airport ➝ {itinerary.traveldetails__international_airport} </p>
      </div>
      <div className="see-more">
      <Link to={`/AllItineraryPages?from_date=${itinerary.traveldetails__from_date}&to_date=${itinerary.traveldetails__to_date}&international_airport=${itinerary.traveldetails__international_airport}&crew_type=${itinerary.crew_type_display}`}>
          view All →
        </Link>
      </div>
    </div>
  );
};

const ItineraryDate = () => {
  const [pastItineraries, setPastItineraries] = useState([]);
  const [presentItineraries, setPresentItineraries] = useState([]);
  const [futureItineraries, setFutureItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        // Assuming token is stored in localStorage
        const token = localStorage.getItem("access_token"); // Or replace this with how you store your token

        // Make a request to the DRF backend to fetch itinerary data with Authorization header
        const response = await axios.get("http://192.168.31.111:8000/api/journeys/itinerarydate/", {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the request header
          },
        });

        setPastItineraries(response.data.past_itineraries);
        setPresentItineraries(response.data.present_itineraries);
        setFutureItineraries(response.data.future_itineraries);
        setLoading(false);
      } catch (err) {
        setError("Error fetching itineraries");
        setLoading(false);
      }
    };

    fetchItineraries();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="itinerary-container">
       <div ><img className="it-hero" src={ithero1} alt="it-hero" ></img> </div>
      <h2 className="section-title">Upcoming Itinerary</h2>
      <div className="itinerary-section">
        {futureItineraries.length === 0 ? (
          <p>No itineraries</p>
        ) : (futureItineraries.map((itinerary, index) => (
          <ItineraryCard key={index} itinerary={itinerary} />
        )))}
      </div>

      <h2 className="section-title">Present Itinerary</h2>
      <div className="itinerary-section">
        {presentItineraries.length === 0 ? (
          <p>You currently have no active itineraries.</p>
        ) : (presentItineraries.map((itinerary, index) => (
          <ItineraryCard key={index} itinerary={itinerary} />
        )))}
      </div>

      <h2 className="section-title">Past Itinerary</h2>
      <div className="itinerary-section">
        {pastItineraries.length === 0 ? (
          <p>You have no past itineraries.</p>
        ) : (pastItineraries.map((itinerary, index) => (
          <ItineraryCard key={index} itinerary={itinerary} />
        )))}
      </div>

   
      <div className="Get-Started-footer">
        <table class="footer-table">
          <thead>
            <tr>
              <th class="footer-table-tr1">Only 2 Bali</th>
              <th class="footer-table-tr2">
                <img alt="fb" src={facebook} className="social-icon"/>
                <img alt="fb"  src={instagram} className="social-icon" />
                <img alt="fb" src={linkedin} className="social-icon"/>
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

export default ItineraryDate;
