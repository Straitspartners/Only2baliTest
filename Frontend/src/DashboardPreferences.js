import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Carousel from "react-bootstrap/Carousel";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import "./dashboardPreferences.css"; // Import your custom CSS
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import profile from "./Asset/profile.png"; 
import Heroimg from "./Asset/DP-Hero-img.png"; 
import Journey1 from "./Asset/journey1.png"; // Correct import path
import Journey2 from "./Asset/journey2.png"; // Correct import path
import Journey3 from "./Asset/journey3.png"; // Correct import path
import { useNavigate } from "react-router-dom"; // Use useNavigate hook
import Route from "./Asset/Route.png"; 
import Settings from "./Asset/settings.png"; 
import logout from "./Asset/logout.png";
import logo from "./Asset/bali loogoo.svg";
function DashboardPreferences() {
  const navigate = useNavigate(); // Initialize useNavigate hook
  
  const HandleStartjourney = () => {
    navigate("/journeystart");
  };

  const settings=()=>{
    navigate ("/Settings")
  }
  const HandleItineraryDate =()=>{
    navigate("/ItineraryDate")
  }
const home=()=>{
  navigate("/")
}

  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
    try {
      setLoading(true); // Set loading to true when the logout process starts
  
      // Retrieve the refresh token (from localStorage or wherever it's stored)
      const refreshToken = localStorage.getItem("refresh_token");
      const accessToken = localStorage.getItem("access_token"); // Access token for authorization
  
      if (!refreshToken || !accessToken) {
        throw new Error("Tokens not found.");
      }
  
      // Make the logout API call
      const response = await fetch("http://192.168.31.111:8000/api/users/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`, // Add Authorization header with the access token
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      });

      if (response.ok) {
        localStorage.clear();
        sessionStorage.clear();
        console.log('Logged out successfully')
      }
  
      if (!response.ok) {
        throw new Error("Logout failed");
      }
  
      // Logout successful, clear the refresh token
      localStorage.removeItem("refresh_token"); // Clear the refresh token
      localStorage.removeItem("access_token"); // Clear the access token (optional)
  
      // Redirect to the login page after successful logout
      navigate("/"); // Redirect to login page
  
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false); // Set loading to false once the process is done
    }
  };
  
  return (
    <>
           <Navbar  className="fw-bold" expand="lg" style={{ backgroundColor: "#F8F2E5" }} variant="light" sticky="top">
      <Container fluid>
        <Navbar.Brand href="#home" onClick={home}><img src={logo} alt="only2bali" className="logo" /></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <NavDropdown
              title={
                <span className="d-flex align-items-center">
                  <img
                    src={profile}
                    alt="Profile"
                    width="30"
                    height="30"
                    className="rounded-circle me-2"
                  />
                  <span>Profile</span>
                </span>
              }
              id="profile-dropdown"
              align="end"
              drop="down" // Ensure dropdown shows below the profile button
            >
              <NavDropdown.Item onClick={HandleItineraryDate} className="d-flex align-items-center">
                <img src={Route}   alt="Itinerary" width="25" height="25" className="me-4" />
                Your Itinerary
              </NavDropdown.Item>  <NavDropdown.Item onClick={settings} className="d-flex align-items-center">
  <img src={Settings} alt="Settings" width="25" height="25" className="me-4" />
  Settings
</NavDropdown.Item>
            

<NavDropdown.Item onClick={handleLogout} className="d-flex align-items-center">
                <img src={logout} alt="Logout" width="25" height="25" className="me-4" />
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
      
    <Container fluid className="p-0 m-0" >
        <Row className="g-0 ">
          <Col xs={12}className="DP-Hero">
          <div className="DP-Hero-content ">
            <h1 className="overlay-text1">Namaste!</h1>
            <h2 className="db-overlay-text2">
              Experience Bali 
            </h2>
            <h2 className="db-overlay-text2">
            Exactly Like India
            </h2>
            <p className="db-overlay-text3">Feel yourself basking in the balinese sun and the scent of frangipani filling the air. We help you to create perfect Balinese adventure!</p>
            <div className="btn-div" style={{ display: "flex", justifyContent: "flex-start" }}>
              <button style={{ width: "40%" }} className="d-none d-md-block"> <a href="#Journey"> Lets Get Started </a></button>
            </div>
            </div>
          </Col>
        </Row>
      </Container>
      <div className="Journey-C" id="Journey-C">
        <h1 className="Journey-h1">Unforgettable Experience Start From a Great Plan</h1>
        <p className="Journey-p">Planning your dream holiday shouldn't be stressful, that’s why we are here. So these are our plans</p>
        <div className="carousel-div1">
          <div style={{ display: "block", width: 900, padding: 20 }}>
            <Carousel id="carouselExample" interval={2000} indicators={false}>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src={Journey1}
                  alt="First Slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src={Journey2}
                  alt="Second Slide"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src={Journey3}
                  alt="Third Slide"
                />
              </Carousel.Item>
            </Carousel>
          </div>
         
        </div> <div className="btn-div"> <button onClick={HandleStartjourney}>View All Plans</button> </div>
      </div>
     
    </>
  );
}

export default DashboardPreferences;
