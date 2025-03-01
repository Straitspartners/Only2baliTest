import React, { useState } from 'react';
import './Signinusingotp.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const OtpContainer = () => {
  const [loginType, setLoginType] = useState('otp'); // Default to OTP login
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [mobile_number, setMobileNumber] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  // Handle OTP request
  const requestOtp = async () => {
    try {
      const response = await axios.post('http://152.58.199.128:8000/login', { identifier, login_type: 'otp' });
      if (response.data.message === 'OTP sent successfully.') {
        setIsOtpSent(true);
        setMessage('');
        setError('');
      }
    } catch (error) {
      setError('Error sending OTP. Please try again.');
      setMessage('');
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    const userData = {
      otp,
      identifier
    };

    try {
      const response = await axios.post('http://152.58.199.128:8000/login', userData);
      setMessage('OTP verification successful.');
      setError('');
      navigate("/preferencesdashboard");
    } catch (error) {
      setError('Error verifying OTP. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="OTP-container">
      <div className='OTP-section'>
        <h1>One Step Closer To Your Bali!</h1>
        <br />
        <div className="OTP-overlay">
          <h1 className='OTP-section-h2'>OTP Verification</h1>
          <br />
          <div className="OTP-form">
            <p className='p1'>Just enter the OTP we sent to your phone!</p>
            <p className="phone-number">({mobile_number})</p>

            <div className="otp-inputs-">
              {loginType === 'otp' && (
                <>
                  <input
                    style={{ width: '300px' }}
                    type="text"
                    onChange={(e) => setIdentifier(e.target.value)}
                    value={identifier}
                    placeholder='Enter Your Phone Number'
                  />
                  {isOtpSent ? (
                    <input
                      type="text"
                      maxLength="6"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                    />
                  ) : (
                    <button type="button" onClick={requestOtp}>
                      Send OTP
                    </button>
                  )}
                </>
              )}
            </div>
            
            <p className="resend">
              Didn’t get a code? <span onClick={requestOtp}>Resend Code</span>
            </p>

            <button className="register-btn" onClick={handleSubmit}>
              Register
            </button>

            <p className="message">{message}</p>
            <p className="error">{error}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpContainer;
