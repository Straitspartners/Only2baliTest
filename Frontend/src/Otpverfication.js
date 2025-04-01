import React, { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";

const OtpContainer = () => {
  const location = useLocation();
  const mobile_number = location.state?.mobile_number;
  console.log(mobile_number);
  
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = () => {
    const userData = { otp };

    axios
      .post(`https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/users/verify-otp/${mobile_number}/`, userData)
      .then((response) => {
        setMessage("Your registration has been successfully completed.");
        setError("");
        setShowSuccessPopup(true);
        setShowErrorPopup(false);
      })
      .catch((error) => {
        setError("Error verifying OTP. Please try again.");
        setMessage("");
        setShowErrorPopup(true);
        setShowSuccessPopup(false);
      });
  };

  return (
    <div className="signup-container">
      <div className="signup-section">
        <h1 className="signup-section-h1">One Step Closer To Your Bali!</h1>
        <div className="signup-overlay">
          <h2 className="signup-section-h2">OTP Verification</h2>
          <br />
          <div className="signup-form">
            <h2 style={{ color: "white" }}>
              Just enter the OTP we sent to your phone!
            </h2>
            <p style={{ color: "white" }}>({mobile_number})</p>
            <p> We've also sent the OTP to your email for your convenience.</p>
            <input
              className="input-field"
              style={{ width: "80%" }}
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            {/* <p className="resend">
              Didn’t Get a code? <span>Resend Code</span>
            </p> */}
            <button className="signup-btn" onClick={handleSubmit}>
              Register
            </button>
          </div>
        </div>
      </div>

      {/* Error Popup */}
      {showErrorPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <p className="error">{error}</p>
            <button onClick={() => setShowErrorPopup(false)}>OK</button>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <p className="message">{message}</p>
            <button onClick={() => navigate("/signin")}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OtpContainer;
