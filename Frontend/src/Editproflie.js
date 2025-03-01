
import React, { useState, useEffect } from "react";
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
import "./Editprofile.css";
import { Button } from "react-bootstrap";
import axios from 'axios';  // Import axios
import logo from "../src/Asset/bali loogoo.svg"
const Editprofile = () => {
  const [userName, setUserName] = useState("");
  const [mobile_number, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");  // Optional if updating password
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(true); // To track loading state
  const [error, setError] = useState(null); // To store error messages

  const navigate = useNavigate();
  const HandleItineraryDate =()=>{
    navigate("/ItineraryDate")
  }
const home=()=>{
  navigate("/")
}


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
  useEffect(() => {
    // Fetch the current user's profile when the component mounts
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/users/user-profile/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`, // Pass the token for authentication
          }
        });
        const { username, mobile_number, email, gender, dob } = response.data;

        // Set the form fields with the fetched data
        setUserName(username);
        setMobileNumber(mobile_number);
        setGender(gender);
        setDob(dob);
        setEmail(email);
        setPassword(''); // You might not want to preload the password for security reasons

        setLoading(false);
      } catch (error) {
        setError('Failed to load user profile. Please try again.');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  const settings = () => {
    navigate("/Settings");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get the updated data from the state
    const updatedProfile = {
      username: userName,
      mobile_number: mobile_number,
      gender: gender,
      dob: dob,
      email: email,
      password: password, // Include this if the password is being updated
    };

    try {
      // Send the PUT request to the backend API
      const response = await axios.put(
        'https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/users/profile/update/',  // Your backend API endpoint
        updatedProfile,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`, // Authentication token
          }
        }
      );

      if (response.status === 200) {
        alert("Profile updated successfully!");
        navigate("/Settings");
      }
    } catch (error) {
      // Handle error (e.g., if email is already taken)
      if (error.response) {
        alert(error.response.data.error || 'An error occurred.');
      } else {
        alert("Network error.");
      }
    }
  };



  // Show loading indicator while fetching the profile
  if (loading) {
    return <div>Loading...</div>;  // You can replace this with a spinner for better UX
  }

  // Show error message if fetching fails
  if (error) {
    return <div>{error}</div>;
  }

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

      {/* Full page container */}
      <div className="body-setting d-flex justify-content-center align-items-center min-vh-100">
        <div className="div-setting text-center w-60" style={{ width: "50%" }}>
          <div className="p-4 rounded" style={{ width: "400px" }}>
            <h1>Edit Profile</h1>
            <br></br>
            {/* Form Fields */}
            <form className="w-100 w-md-75 mx-auto" onSubmit={handleSubmit}>
              <lable className="Ep-lable">User Name</lable>
              <input 
                 className="form-control"
                
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <lable className="Ep-lable">Mobile Number</lable>
              <input
                label="Mobile Number"className="form-control"
                value={mobile_number}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
                <lable className="Ep-lable">Date of Birth</lable>
              <input
              type="date"
                label="D.O.B"  className="form-control"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
                <lable className="Ep-lable">Gender</lable>
            < input
                label="Gender" className="form-control"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              />
                <lable className="Ep-lable">E-mail</lable>
              <input
                label="Email Id" className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* Submit Button */}
              <div className="text-center mt-3">
                <button
                  type="submit"
                  className="btn btn-success px-4 rounded-pill"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Editprofile;
