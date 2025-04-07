import React from 'react';

const GlobalLoader = ({ loading }) => {
  if (!loading) return null;

  return (
    <>
      <style>
        {`
          .global-loader-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(5px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease-in-out;
          }
          .global-loader-container {
            text-align: center;
            animation: scaleUp 0.3s ease-in-out;
          }
          .loader {
            width: fit-content;
            font-weight: bold;
            font-family: monospace;
            font-size: 30px;
            /* Updated theme color (#DC8568) applied in the radial gradient */
            background: radial-gradient(circle closest-side, #DC8568 94%, transparent) right/calc(200% - 1em) 100%;
            animation: l24 1s infinite alternate linear;
          }
          .loader::before {
            content: "Loading...";
            line-height: 1em;
            /* Keeping the text transparent as background-clip is used */
            color: transparent;
            background: inherit;
            /* Updated the background-image gradient to include the theme color */
            background-image: radial-gradient(circle closest-side, #fff 94%, #DC8568);
            -webkit-background-clip: text;
                    background-clip: text;
          }
          @keyframes l24 {
            100% {
              background-position: left;
            }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleUp {
            from { transform: scale(0.9); }
            to { transform: scale(1); }
          }
        `}
      </style>
      <div className="global-loader-overlay">
        <div className="global-loader-container">
          <div className="loader"></div>
        </div>
      </div>
    </>
  );
};

export default GlobalLoader;
