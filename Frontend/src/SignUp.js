import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import './Signup.css';

const Signup = () => {
  const formRef = useRef(null);
  const [mobile_number, setMobileNumber] = useState("");
  const [username, setName] = useState("");
  const [password, setPassword] = useState(""); 
  const [password_confirmation, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const Handlesignin = () => {
    navigate("/signin")
   }
  const handleSubmit = (e) => {
    e.preventDefault();
    // Trigger built-in validation
    if (formRef.current.checkValidity()) {
      const userData = { mobile_number, username, password, dob, gender, password_confirmation, email };

      axios.post('https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/users/register/', userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          setMessage('Registration successful. Please verify your OTP.');
          setError('');
          navigate("/otpverfication", { state: { mobile_number } });
        })
        .catch(error => {
          // Check if there's a response from the backend with error details
          if (error.response && error.response.data) {
            const errorData = error.response.data;
            let errorMessages = '';

            // If the backend returns field-specific errors, display them

            if (errorData.username) {
              errorMessages += `Username: ${errorData.username} `;
            }

            if (errorData.email) {
              errorMessages += `Email: ${errorData.email} `;
            }
            if (errorData.mobile_number) {
              errorMessages += `Mobile Number: ${errorData.mobile_number} `;
            }
            if (errorData.password) {
              errorMessages += `Password: ${errorData.password} `;
            }
            if (errorData.password_confirmation) {
              errorMessages += `Password: ${errorData.password_confirmation} `;
            }

            setError(errorMessages);
            setMessage(''); // Clear the success message if error occurs
          } else {
            // If there's no error response from the backend
            setError('Error registering user. Please try again.');
            setMessage('');
          }
          setShowPopup(true); // Show the popup when an error occurs
        });
    } else {
      // This will show the default browser tooltips
      formRef.current.reportValidity();
    }
  };


  return (
    <div className="signup-container">
      <form ref={formRef} className='signup-section' onSubmit={handleSubmit}>
        <h1 className='signup-section-h1'>One Step Closer To Your Bali!</h1>
        <div className="signup-overlay">
          <h2 className='signup-section-h2'>Sign up</h2>
          <div className="signup-form">
            <input type="text" placeholder="Name" className="input-field" value={username} onChange={(e) => setName(e.target.value)} required />
            <input
              type="text"
              placeholder="Phone Number"
              className="input-field"
              value={mobile_number}
              onChange={(e) => {
                let value = e.target.value;
                if (!value.startsWith('+91')) {
                  value = `+91${value.replace(/^\+91/, '')}`;
                }
                if (/^\+91\d*$/.test(value)) {
                  setMobileNumber(value);
                }
              }}
              maxLength={13}
              required
            />
          <select
  className="input-field"
  value={gender}
  required
  onChange={(e) => setGender(e.target.value)}
>
  <option value="" disabled selected hidden>Gender</option>
  <option style={{ color: "black" }} value="Male">Male</option>
  <option style={{ color: "black" }} value="Female">Female</option>
  <option style={{ color: "black" }} value="Other">Prefer not to say</option>
</select>

            <input type="date" placeholder="Date of Birth" className="input-field" value={dob} required onChange={(e) => setDob(e.target.value)}  min="1900-01-01" max="2025-12-31" />
                        <div className="form-group" style={{ position: "relative", width:"100%"}}>
               <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "40%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "white"
                }}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            <div className="form-group" style={{ position: "relative" ,width:"100%"}}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="input-field"
                value={password_confirmation}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "40%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "white"
                }}
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            <input type="email" placeholder="Email" className="input-field" value={email} required onChange={(e) => setEmail(e.target.value)} />
            <button type="submit" className="signup-btn">Get OTP</button>
           <div className='signin-div'>
            <p className="signin-text">Already have an account? <button onClick={Handlesignin}>Sign In</button></p></div>
            </div>
        </div>
      </form>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <p>{error}</p>
            <p>{message}</p>
            <button onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
