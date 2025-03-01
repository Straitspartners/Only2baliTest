import React, { useState } from 'react';
import './Signup.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PasswordReset = () => {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const { uid, token } = useParams(); 
  const [newPassword, setNewPassword] = useState(""); 
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = () => {
    setShowSuccessPopup(false);
    navigate("/signin");
  };

  const handleResetPassword = () => {
    const userData = {
      uid,
      token,
      new_password: newPassword,
      confirm_password: confirmPassword
    };
    console.log('User Data:', userData); // Debugging log

    axios.post('https://pybackend-eeamcqf4evb6hacn.centralindia-01.azurewebsites.net/api/users/password-reset-verify/', userData)
      .then(response => {
        console.log('Response:', response);
        setMessage('Password reset successful. Please log in with your new password.');
        setError('');
        setShowSuccessPopup(true); 
        setShowErrorPopup(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setError('Error resetting password. Please try again.');
        setMessage('');
        setShowErrorPopup(true);
        setShowSuccessPopup(false);
      });
  };

  return (
    <div className="signup-container">
      <div className='signup-section'>
        <h1 className='signup-section-h1'>One Step Closer To Your Bali!</h1>
        <br />
        <div className="signup-overlay">
          <h1 className='signup-section-h2'>Reset Your Password</h1>
          <br />
          <p style={{ color: "white" }}>Must be at least 8 characters. Include a mix of letters, numbers, and symbols.</p>
          <br />
          <div className="signup-form">
            <input 
              type="password" 
              placeholder="Enter New Password" 
              className="input-field" 
              style={{ width:"80%" }} 
              onChange={(e) => setNewPassword(e.target.value)}  
              value={newPassword}
            />
            <input 
              type="password" 
              placeholder="Confirm New Password" 
              className="input-field" 
              style={{ width:"80%" }} 
              onChange={(e) => setConfirmPassword(e.target.value)}  
              value={confirmPassword}
            />
            <button 
              className="signup-btn"
              onClick={handleResetPassword}
            >
              Confirm
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

export default PasswordReset;
