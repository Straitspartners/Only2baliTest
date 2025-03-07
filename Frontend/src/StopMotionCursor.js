// StopMotionCursor.jsx
import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const StopMotionCursor = () => {
  const containerRef = useRef();

  useEffect(() => {
    const sketch = (p) => {
      let history = [];
      // Define a palette of colors – using your theme colors plus two extra for a multi-color effect
      const colorPalette = [
        p.color('#1E9C5B'), // green (theme)
        p.color('#F8F1E5'), // cream (theme)
        p.color('#4B352D'), // brown (theme)
        p.color('#FF6B6B'), // extra: vibrant red/pink
        p.color('#FFD93D')  // extra: sunny yellow
      ];

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight).parent(containerRef.current);
        // Clear background to allow transparency
        p.clear();
      };

      p.draw = () => {
        // Clear the canvas to keep the cursor effect fresh
        p.clear();

        // Get current mouse position
        const mx = p.mouseX;
        const my = p.mouseY;

        // Add current position to the history
        history.push({ x: mx, y: my });
        // Limit the history length for a shorter, dynamic trail
        if (history.length > 10) {
          history.shift();
        }

        // Draw the trail: draw line segments between consecutive history points
        for (let i = 0; i < history.length - 1; i++) {
          // Cycle through the color palette based on the index for multi-color effect
          const col = colorPalette[i % colorPalette.length];
          p.stroke(col);
          p.strokeWeight(8);
          // Add a small random jitter to simulate a hand-drawn crayon stroke
          const jitterX = p.random(-2, 2);
          const jitterY = p.random(-2, 2);
          p.line(
            history[i].x + jitterX, history[i].y + jitterY,
            history[i + 1].x + jitterX, history[i + 1].y + jitterY
          );
        }

        // Draw the current cursor tip with a glowing effect
        p.noStroke();
        // Pick a random color from the palette for the tip for extra fun variation
        const tipColor = colorPalette[p.floor(p.random(colorPalette.length))];
        p.fill(tipColor);
        p.ellipse(mx, my, 14, 14);

        // Draw an outer glow for the tip
        p.stroke(tipColor);
        p.strokeWeight(4);
        p.noFill();
        p.ellipse(mx, my, 22, 22);
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };

    // Create and mount the p5 instance
    const myP5 = new p5(sketch);

    // Cleanup on unmount
    return () => {
      myP5.remove();
    };
  }, []);

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
