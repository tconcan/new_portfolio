import { useEffect, useRef } from "react";

// Animated metaball background: soft blobs drifting across the screen,
// shaded with a purple→cyan diagonal gradient.

const BALL_COUNT = 20;
const MAX_RADIUS = 100;
const MIN_RADIUS_FACTOR = 0.1; // fraction of the radius a ball shrinks to off screen
const RADIUS_ADJUST_SPEED = 0.05; // per frame, towards the target radius
const WRAP_MARGIN = 3; // radii beyond the edge before a ball wraps around
const THRESHOLD = 0.7; // field value where a blob is fully opaque
const SOFTNESS = 0.5; // field range over which blob edges fade out
const STEP = 3; // sample every STEP px and fill STEP×STEP blocks (performance)

// Gradient endpoints: deep purple #6a0dad → cyan #00ffff
const FROM = [106, 13, 173] as const;
const TO = [0, 255, 255] as const;

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  effectiveRadius: number;
}

function createBalls(width: number, height: number): Ball[] {
  return Array.from({ length: BALL_COUNT }, () => {
    const radius = MAX_RADIUS / 2 + (Math.random() * MAX_RADIUS) / 2;
    return {
      x: Math.random() * (width + MAX_RADIUS * 4) - MAX_RADIUS * 2,
      y: Math.random() * (height + MAX_RADIUS * 4) - MAX_RADIUS * 2,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      radius,
      effectiveRadius: radius,
    };
  });
}

function step(balls: Ball[], width: number, height: number) {
  for (const ball of balls) {
    // Balls shrink while off screen and grow back when they return.
    const inside = ball.x >= 0 && ball.x <= width && ball.y >= 0 && ball.y <= height;
    const target = inside ? ball.radius : ball.radius * MIN_RADIUS_FACTOR;
    ball.effectiveRadius += RADIUS_ADJUST_SPEED * (target - ball.effectiveRadius);
  }

  for (const ball of balls) {
    ball.x += ball.vx;
    ball.y += ball.vy;

    const margin = ball.radius * WRAP_MARGIN;
    if (ball.x < -margin) ball.x = width + margin;
    else if (ball.x > width + margin) ball.x = -margin;
    if (ball.y < -margin) ball.y = height + margin;
    else if (ball.y > height + margin) ball.y = -margin;
  }
}

/** Metaball scalar field: sum of r²/d² over all balls. */
function fieldAt(balls: Ball[], x: number, y: number): number {
  let sum = 0;
  for (const ball of balls) {
    const dx = x - ball.x;
    const dy = y - ball.y;
    const dist2 = dx * dx + dy * dy;
    if (dist2 !== 0) sum += (ball.effectiveRadius * ball.effectiveRadius) / dist2;
  }
  return sum;
}

function render(balls: Ball[], image: ImageData) {
  const { width, height, data } = image;
  data.fill(0);
  const maxDiagonal = width + height;

  for (let y = 0; y < height; y += STEP) {
    for (let x = 0; x < width; x += STEP) {
      const value = fieldAt(balls, x, y);
      if (value < THRESHOLD - SOFTNESS) continue;

      const t = (x + y) / maxDiagonal;
      const r = Math.round(FROM[0] + t * (TO[0] - FROM[0]));
      const g = Math.round(FROM[1] + t * (TO[1] - FROM[1]));
      const b = Math.round(FROM[2] + t * (TO[2] - FROM[2]));
      const alpha = value < THRESHOLD ? Math.min(Math.max((value - (THRESHOLD - SOFTNESS)) / SOFTNESS, 0), 1) : 1;
      const a = Math.round(255 * alpha);

      for (let py = 0; py < STEP; py++) {
        for (let px = 0; px < STEP; px++) {
          const i = 4 * ((y + py) * width + (x + px));
          if (i < data.length) {
            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = b;
            data[i + 3] = a;
          }
        }
      }
    }
  }
}

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let image: ImageData | null = null;

    // Size the drawing buffer to the canvas's CSS box (which overshoots the
    // screen; see .background-canvas in index.css).
    const fitToBox = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w || canvas.height !== h || !image) {
        canvas.width = w;
        canvas.height = h;
        image = ctx.createImageData(Math.max(w, 1), Math.max(h, 1));
      }
    };
    fitToBox();

    const balls = createBalls(canvas.width, canvas.height);
    let frame = 0;
    const animate = () => {
      if (image) {
        render(balls, image);
        ctx.putImageData(image, 0, 0);
      }
      step(balls, canvas.width, canvas.height);
      frame = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener("resize", fitToBox);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", fitToBox);
    };
  }, []);

  return <canvas ref={canvasRef} className="background-canvas -z-10" aria-hidden="true" />;
}
