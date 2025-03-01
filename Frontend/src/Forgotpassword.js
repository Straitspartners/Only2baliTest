import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';
import Badgecheck from './Asset/badgecheck.png';

const Forgetpassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/signin");
  };

  const handleClick = () => {
    const userData = { email };

    axios.post('http://192.168.31.111:8000/api/users/password-reset-request/', userData)
      .then(response => {
        setMessage('If the email is registered, you will receive a password reset link.');
        setError('');
        setShowSuccessPopup(true); 
        setShowErrorPopup(false); 
      })
      .catch(error => {
        setError('Error sending password reset link. Please enter your mail ID.');
        setMessage('');
        setShowErrorPopup(true);
        setShowSuccessPopup(false);
      });
  };

  return (
    <div className="signup-container">
    <div className='signup-section'>
      <h1 className='signup-section-h1'>One Step Closer To Your Bali!</h1>
      <div className="signup-overlay">
        <h2 className='signup-section-h2'>Forget password</h2>
          <br></br>
          <p  style={{ color: "white" }}>We'll send you the instructions to reset your password.</p>
          <br></br>
          <div className="signup-form">
            <input 
              type="text" 
              placeholder="Enter Your Email Id" 
              className="input-field" 
              style={{ width:"80%" }} 
              onChange={(e) => setEmail(e.target.value)} 
              value={email}
            />
            <button className="signup-btn" onClick={handleClick}>
              Request Link
            </button>
            <button className='Forgetpassword-btn' onClick={() => navigate("/signin")}>
              Back To Sign-In
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
            <button onClick={handleSignIn}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forgetpassword;
