// GlobalLoader.js
import React from "react";
import { PacmanLoader } from "react-spinners";

const GlobalLoader = ({ loading }) => {
  if (!loading) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.loaderContainer}>
        <PacmanLoader color="#ffcc00" size={40} loading={loading} />
        <p style={styles.text}>Loading, please wait...</p>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.6)", // Darker background for better contrast
    backdropFilter: "blur(5px)", // Adds a nice blur effect
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    animation: "fadeIn 0.3s ease-in-out",
  },
  loaderContainer: {
    textAlign: "center",
    animation: "scaleUp 0.3s ease-in-out",
  },
  text: {
    marginTop: 10,
    fontSize: "18px",
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "Arial, sans-serif",
  },
};

export default GlobalLoader;
