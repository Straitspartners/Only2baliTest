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
           ✅ KYC Documents
        </p>
        <p className="p-p">
           ✅ Passport – Valid for at least six months from your travel date.
        </p>
        <p className="p-p">
          {" "}
           ✅ Visa – Required for entry; check country-specific rules.
        </p>
        <p className="p-p">
          {" "}
           ✅ Travel Insurance – Covers medical emergencies and trip disruptions.
        </p>
        <p className="p-p">
          {" "}
           ✅ Currency Exchange – Ensure your International payment method before travel.
        </p>
      </div>
      <br></br>
      <div className="nxt-btnn"   style={{ width: "15%", maxWidth: "100%" }}>
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
