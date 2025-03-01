import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Route from "./Asset/Route.png";
import Settings from "./Asset/settings.png";
import profile from "./Asset/profile.png";
import logout from "./Asset/logout.png";
import "./Settings.css";
import { Button } from "react-bootstrap";
import logo from "./Asset/bali loogoo.svg";
const Setting = () => {
  const navigate = useNavigate();

  var HandleEditprofile = () => {
    navigate("/Editprofile");
  };
  var Handlechangepassword = () => {
    navigate("/forgotpassword");
  };
  const HandleFaq = () => {
    navigate("/FaqPage");
  };
  const HandleItineraryDate =()=>{
    navigate("/ItineraryDate")
  }
  const Hnadlehome =()=>{
    navigate("/dashboardpreferences")
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
        const response = await fetch("https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/users/logout/", {
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
        <Navbar.Brand  onClick={Hnadlehome}><img src={logo} alt="only2bali" className="logo" /></Navbar.Brand>
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
              </NavDropdown.Item>  <NavDropdown.Item className="d-flex align-items-center">
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
      {/* Full page container */}
      <div className="body-setting d-flex justify-content-center align-items-center min-vh-100">
  <div className="div-setting text-center w-60" style={{ width: "60%" }}>
    <h1>
      <Button className="it-custom-button"></Button> Settings
    </h1>

    <p className="it-p1 border-1 fw-bold">👨🏻‍💼 Account</p>
    <div className="d-flex justify-content-center">
      <hr className="w-50 border-1 border-black" />
    </div>
    <p className="it-p">
      Edit profile{" "}
      <Button className="custom-button" onClick={HandleEditprofile}>
        >
      </Button>
    </p>

    <p className="it-p">
      Change Password
      <Button className="custom-button" onClick={Handlechangepassword}>
        >
      </Button>
    </p>
    <p className="it-p1 fw-bold">📍 Itinerary</p>
    <div className="d-flex justify-content-center">
      <hr className="w-50 border-1 border-black" />
    </div>

    <p className="it-p">
      Your Itinerary
      <Button className="custom-button" onClick={HandleItineraryDate}>
        >
      </Button>
    </p>

    <p className="it-p1 fw-bold">💬 Feedback & Support</p>
    <div className="d-flex justify-content-center">
      <hr className="w-50 border-1 border-black" />
    </div>
    <p className="it-p">
      FAQ'S
      <Button className="custom-button" onClick={HandleFaq}>
        >
      </Button>
    </p>
  </div>
</div>
    </>
  );
};

export default Setting;
