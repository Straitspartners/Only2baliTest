import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Signup.css';

const Login = () => {
  const [loginType, setLoginType] = useState("password");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [showPopup, setShowPopup] = useState(false); 
  const [countdown, setCountdown] = useState(0); 
  const [isOtpButtonDisabled, setIsOtpButtonDisabled] = useState(false); 
  const navigate = useNavigate();

  const Forgetpassword = () => {
    navigate("/forgotpassword");
  };

  // Function to check if identifier is a valid mobile number (without country code)
  const isValidMobileNumber = (input) => {
    const mobileRegex = /^[0-9]{10}$/; // 10 digits mobile number check
    return mobileRegex.test(input);
  };

  // Function to check if identifier already contains the country code
  const hasCountryCode = (input) => {
    return input.startsWith("+91");
  };

  // Function to clean up input (remove spaces and format correctly)
  const cleanInput = (input) => {
    // Remove any spaces in the input
    let cleanedInput = input.replace(/\s+/g, "");

    // If it's a valid mobile number without country code, prepend +91
    if (isValidMobileNumber(cleanedInput) && !hasCountryCode(cleanedInput)) {
      return `+91${cleanedInput}`;
    }
    return cleanedInput;
  };

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!identifier) {
      setError("Please enter your email or mobile number.");
      setShowPopup(true);
      return;
    }

    // Clean and format identifier
    const formattedIdentifier = cleanInput(identifier);

    const loginData = {
      login_type: loginType,
      identifier: formattedIdentifier,
      password,
      otp: loginType === "otp" ? otp : undefined,
    };

    try {
      const response = await axios.post(
        "https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/users/login/",
        loginData
      );
      if (response.data.tokens) {
        localStorage.setItem("access_token", response.data.tokens.access);
        localStorage.setItem("refresh_token", response.data.tokens.refresh);
        navigate("/dashboardpreferences");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Something went wrong");
      setShowPopup(true);
    }
  };

  // Handle OTP request
  const requestOtp = async () => {
    if (!identifier) {
      setError("Please enter your email or mobile number.");
      setShowPopup(true);
      return;
    }

    // Clean and format identifier
    const formattedIdentifier = cleanInput(identifier);

    try {
      const response = await axios.post(
        "https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/users/login/",
        { identifier: formattedIdentifier, login_type: "otp" }
      );
      if (response.data.message === "OTP sent successfully.") {
        setIsOtpSent(true);
        setError("");
        startCountdown(); // Start countdown for resend OTP
      }
    } catch (error) {
      setError(error.response?.data?.error || "Something went wrong");
      setShowPopup(true);
    }
  };

  // Start countdown timer for OTP resend
  const startCountdown = () => {
    setCountdown(120); 
    setIsOtpButtonDisabled(true);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsOtpButtonDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Format time in mm:ss
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  // Handle user input and maintain the value with +91 visible if no country code is entered
  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    // Clean up the input (remove spaces and format it properly)
    const cleanedInput = cleanInput(inputValue);

    // Set the cleaned input value
    setIdentifier(cleanedInput);
  };

  return (
    <div className="signup-container">
      <div className="signup-section gap-4">
        <h1 className="signup-section-h1">One Step Closer To Your Bali!</h1>
        <div className="signup-overlay">
          <h2 className="signup-section-h2 " style={{ marginBottom: "15px" }}>Sign in</h2>

          <div className="signup-form">
            <form onSubmit={handleLogin}>
              <div className="form-group gap-4">
                <input
                  className="input-field gap-4"
                  placeholder={loginType === "otp" ? "Enter Mobile Number" : "Email or Mobile Number"}
                  type="text"
                  style={{ marginBottom: "15px" }}
                  id="identifier"
                  value={identifier}
                  onChange={handleInputChange}  // Use the new input change handler
                  required
                />
              </div>

              {loginType === "password" ? (
                <div className="form-group">
                  <input
                    className="input-field gap-4"
                    type="password"
                    id="password"
                    style={{ marginBottom: "15px" }}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <>
                  {isOtpSent ? (
                    <div className="form-group">
                      <label htmlFor="otp">Enter OTP</label>
                      <input
                        type="text"
                        id="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                      <div>
                        {countdown > 0 ? (
                          <p>Resend OTP in: {formatTime(countdown)}</p>
                        ) : (
                          <button
                            className="signup-btn"
                            type="button"
                            onClick={requestOtp}
                            disabled={isOtpButtonDisabled}
                          >
                            Resend OTP
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="signup-btn-div">
                      <button
                        className="signup-btn"
                        type="button"
                        onClick={requestOtp}
                        disabled={isOtpButtonDisabled}
                      >
                        Send OTP
                      </button>
                    </div>
                  )}
                </>
              )}

              <div className="form-group">
                <label>
                  <input
                    style={{ marginBottom: "15px" }}
                    type="radio"
                    value="password"
                    checked={loginType === "password"}
                    onChange={() => setLoginType("password")}
                  />
                  Login with Password
                </label>
                <span style={{ padding: "10px" }}></span>
                <label>
                  <input
                    className="signin-radio"
                    type="radio"
                    value="otp"
                    checked={loginType === "otp"}
                    onChange={() => setLoginType("otp")}
                  />
                  Login with OTP
                </label>
                <div style={{ marginBottom: "15px" }} className="signup-btn-div ">
                  <button className="signup-btn" type="submit">
                    Login
                  </button>
                </div>
              </div>
              
              <div className='signin-div'>
              <p className="signin-text">Forget password? <button onClick={Forgetpassword}>Reset</button></p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <p>{error}</p>
            <button onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
