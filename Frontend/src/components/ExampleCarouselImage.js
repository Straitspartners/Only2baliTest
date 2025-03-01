// src/components/ExampleCarouselImage.js

import React from 'react';

function ExampleCarouselImage({ text }) {
  return (
    <div className="d-block w-100" style={{ height: '400px', backgroundColor: '#ccc' }}>
      <div className="text-center text-white" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <h4>{text}</h4>
      </div>
    </div>
  );
}

export default ExampleCarouselImage;
