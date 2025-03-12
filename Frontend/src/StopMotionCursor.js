import React, { useEffect, useRef, useState } from 'react';
import p5 from 'p5';

const StopMotionCursor = () => {
  const containerRef = useRef();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect if the device is mobile/tablet
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mediaQuery.matches);

    // Update state if the window is resized
    const handleResize = () => {
      setIsMobile(mediaQuery.matches);
    };

    mediaQuery.addEventListener('change', handleResize);

    return () => {
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      return; // Skip setting up the custom cursor on mobile/tablet
    }

    const sketch = (p) => {
      let history = [];
      const circleColor = p.color('#1E9C5B'); // Cursor color

      const colorPalette = [
        p.color('#1E9C5B'), // Green (theme)
        p.color('#FF6B6B'), // Red (theme)
        p.color('#d7c4b7'), // Cream (theme)
        p.color('#4B352D'), // Brown (theme)
        p.color('#FF6B6B'), // Vibrant red/pink
        p.color('#FFD93D')  // Yellow (theme)
      ];

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight).parent(containerRef.current);
        p.clear();
      };

      p.draw = () => {
        p.clear(); // Clear the canvas to keep the cursor effect fresh

        const mx = p.mouseX;
        const my = p.mouseY;

        history.push({ x: mx, y: my });
        if (history.length > 10) {
          history.shift(); // Keep a history of the last 10 points for a smooth trail
        }

        for (let i = 0; i < history.length - 1; i++) {
          const col = colorPalette[i % colorPalette.length];
          p.stroke(col);
          p.strokeWeight(8);

          const jitterX = p.random(-2, 2);
          const jitterY = p.random(-2, 2);
          p.line(
            history[i].x + jitterX, history[i].y + jitterY,
            history[i + 1].x + jitterX, history[i + 1].y + jitterY
          );
        }

        // Draw the inner circle for the cursor tip
        p.noStroke();
        p.fill(circleColor);
        p.ellipse(mx, my, 14, 14);

        // Draw an outer glow for the tip with the fixed color
        p.stroke(circleColor);
        p.strokeWeight(4);
        p.noFill();
        p.ellipse(mx, my, 22, 22);
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };

    const myP5 = new p5(sketch);

    // Cleanup on unmount
    return () => {
      myP5.remove();
    };
  }, [isMobile]);

  if (isMobile) {
    return null; // Don't render the cursor effect on mobile/tablet
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 10000, // Ensure the cursor is on top of other elements
      }}
    />
  );
};

export default StopMotionCursor;
