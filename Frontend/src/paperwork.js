import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./paperwork.css";
import leftbtn from "../src/Asset/Button 2.png";
import rightbtn from "../src/Asset/Button 3.png";

import icon1 from "../src/Asset/scan.png";
import icon2 from "../src/Asset/Customer.png";
import icon3 from "../src/Asset/guidance.png";


const Paperwork = () => {
  const navigate = useNavigate();
  const Handlenext = () => {
   
    navigate("/ExtraRequest");
  };


  return (
    <div className="backgroundss">
      <h1 className="pw-h1">Don't Forget to Keep These Documents Ready!</h1>
      <p className="pw-p">
      These are essential documents you’ll need before your trip.
      </p>
      <p className="pw-p">
      Make sure to check them off your list!
      </p>
      <br></br>
      <div className="div-paperwork text-center w-40">
        <p className="p-p">
          <img alt="date" className="it-icon" src={icon1}></img> KYC Documents
        </p>
        <p className="p-p">
          <img alt="to_date" className="it-icon" src={icon2}></img> Visa
          Processing Assistance
        </p>
        <p className="p-p">
          {" "}
          <img alt="type" className="it-icon1" src={icon3}></img> Travel
          Requirement Guidance
        </p>
      </div>
      <br></br>
      <div className="nxt-btn">
        <button
          onClick={() => navigate(-1)}
     
          className="nxt-btns"
        >
          <img
            src={leftbtn}
            alt="icon"
            style={{ width: "50px", height: "auto", maxWidth: "100%" }}
          />
        </button>
        <button
           onClick={(Handlenext)}
          className="nxt-btns"
         
        >
     
          <img
            src={rightbtn}
            alt="icon"
            style={{ width: "50px", height: "auto", maxWidth: "100%" }}
          />
        </button>
      </div>

    </div>
  );
};

export default Paperwork;
