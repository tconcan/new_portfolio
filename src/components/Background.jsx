import { useEffect, useRef } from "react";

function BackgroundSim() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let maxRadius = 100;

    const metaballsCount = 10;
    const metaballs = Array.from({ length: metaballsCount }, () => {
      const radius = maxRadius / 2 + Math.random() * maxRadius / 2;
      return {
        x: (Math.random() * (canvas.width + maxRadius * 4)) - maxRadius * 2,
        y: (Math.random() * (canvas.height + maxRadius * 4)) - maxRadius * 2,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: radius,
        effectiveRadius: radius,
      };
    });

    // const G = 0.5; // gravitational constant
    // const maxVelocity = 3; // max velocity magnitude to keep stability
    const minRadiusFactor = 0.1; // minimum fraction of radius when offscreen
    const radiusAdjustSpeed = 0.05; // speed of radius adjustment per frame

    function update() {
      // Update effectiveRadius based on whether ball is inside visible canvas
      for (let ball of metaballs) {
        const insideX = ball.x >= 0 && ball.x <= canvas.width;
        const insideY = ball.y >= 0 && ball.y <= canvas.height;
        const inside = insideX && insideY;

        if (inside) {
          // Grow effectiveRadius toward full radius
          ball.effectiveRadius += radiusAdjustSpeed * (ball.radius - ball.effectiveRadius);
        } else {
          // Shrink effectiveRadius toward minimum fraction
          ball.effectiveRadius += radiusAdjustSpeed * (ball.radius * minRadiusFactor - ball.effectiveRadius);
        }
      }

      // Compute gravitational attraction between metaballs using effectiveRadius
      // for (let i = 0; i < metaballs.length; i++) {
      //   const ballA = metaballs[i];
      //   let ax = 0;
      //   let ay = 0;
      //   for (let j = 0; j < metaballs.length; j++) {
      //     if (i === j) continue;
      //     const ballB = metaballs[j];
      //     const dx = ballB.x - ballA.x;
      //     const dy = ballB.y - ballA.y;
      //     const distSq = dx * dx + dy * dy;
      //     if (distSq === 0) continue;
      //     const dist = Math.sqrt(distSq);
      //     // Use effectiveRadius as proxy for mass
      //     const force = (G * ballA.effectiveRadius * ballB.effectiveRadius) / distSq;
      //     // Normalize direction vector and scale by force
      //     ax += force * (dx / dist);
      //     ay += force * (dy / dist);
      //   }
      //   // Update velocities with acceleration
      //   ballA.vx += ax;
      //   ballA.vy += ay;
      //   // Clamp velocity to maxVelocity
      //   const speed = Math.sqrt(ballA.vx * ballA.vx + ballA.vy * ballA.vy);
      //   if (speed > maxVelocity) {
      //     ballA.vx = (ballA.vx / speed) * maxVelocity;
      //     ballA.vy = (ballA.vy / speed) * maxVelocity;
      //   }
      // }

      for (let ball of metaballs) {
        ball.x += ball.vx;
        ball.y += ball.vy;
        
        // ctm: clip threshold multiplier
        let ctm = 3;
        if (ball.x < -ball.radius * ctm) ball.x = canvas.width + ball.radius * ctm;
        else if (ball.x > canvas.width + ball.radius * ctm) ball.x = -ball.radius * ctm;

        if (ball.y < -ball.radius * ctm) ball.y = canvas.height + ball.radius * ctm;
        else if (ball.y > canvas.height + ball.radius * ctm) ball.y = -ball.radius * ctm;
      }
    }

    // Calculate the scalar field value at a point for metaballs
    function metaballField(x, y) {
      let sum = 0;
      for (let ball of metaballs) {
        const dx = x - ball.x;
        const dy = y - ball.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 !== 0) {
          sum += (ball.effectiveRadius * ball.effectiveRadius) / dist2;
        }
      }
      return sum;
    }

    function interpolateColor(t) {
      // Deep purple: #6a0dad (106, 13, 173)
      // Deep cyan: #00ffff (0, 255, 255)
      const r = Math.round(106 + t * (0 - 106));
      const g = Math.round(13 + t * (255 - 13));
      const b = Math.round(173 + t * (255 - 173));
      return [r, g, b];
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      // Threshold for metaball merging effect
      const threshold = 0.7;
      const softness = 0.5;

      // To optimize, sample every 3 pixels horizontally and vertically
      const step = 3;

      const maxDiagonal = canvas.width + canvas.height;

      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          const value = metaballField(x, y);
          if (value >= threshold - softness) {
            // Calculate gradient t based on diagonal position
            const t = (x + y) / maxDiagonal;
            const [r, g, b] = interpolateColor(t);

            let alpha = 1;
            if (value < threshold) {
              alpha = (value - (threshold - softness)) / softness;
              // Keep alpha light to maintain crisp visuals
              alpha = Math.min(Math.max(alpha, 0), 1);
            }

            // Fill a small rectangle of step x step pixels for performance
            for (let py = 0; py < step; py++) {
              for (let px = 0; px < step; px++) {
                const pxIndex = 4 * ((y + py) * canvas.width + (x + px));
                if (pxIndex < data.length) {
                  data[pxIndex] = r;     // R
                  data[pxIndex + 1] = g; // G
                  data[pxIndex + 2] = b; // B
                  data[pxIndex + 3] = Math.round(255 * alpha); // A with softness
                }
              }
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);

      update();
      requestAnimationFrame(animate);
    }

    animate();

    // Resize handler
    function handleResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
}

export default BackgroundSim;