import { acceleratingTravel } from "./stripe-motion.ts";

export const LOADING_MOTION_SECONDS = 2.933333;
// The last stripe starts 5 * 0.035 cycles later and finishes at local 0.84.
export const LOADING_CYCLE_SECONDS = LOADING_MOTION_SECONDS * (0.84 + 5 * 0.035);
export const ASSEMBLY_SECONDS = 1.15 + 11 * 0.075;
export const TRANSITION_FADE_SECONDS = 1.2;
export const MORPH_SECONDS = 2.6;
export const BALL_BOUNCE_SECONDS = 0.4;
export const ENTER_REVEAL_SECONDS = 1.1;
export const ENTER_VAPOR_SECONDS = 0.55;
export const SECTION_FLIGHT_SECONDS = 3.2;
export const SECTION_UNFOLD_SECONDS = 0.85;
export const TRANSITION_SECONDS = SECTION_FLIGHT_SECONDS + 0.1 + SECTION_UNFOLD_SECONDS + BALL_BOUNCE_SECONDS;

export function sectionLayout(width: number, height: number) {
  const { radius } = ballLayout(width);
  const menu = { x: width / 2, y: height - 48, width: Math.min(720, width - 32), height: 56 };
  const blockWidth = Math.min(960, width - 32);
  const blockHeight = Math.min(420, height - 104 - (radius * 2 + 24 + 32));
  const block = { x: width / 2, y: height - 104 - blockHeight / 2, width: blockWidth, height: blockHeight };
  return { menu, block, icon: { x: (width - blockWidth) / 2 + radius, y: height - 104 - radius } };
}

export function letterFlightArrival(index: number) {
  return (5 - index) * 0.1 + (index >= 4 ? SECTION_FLIGHT_SECONDS : MORPH_SECONDS - 0.5);
}

export function letterFlightProgress(seconds: number, index: number) {
  const start = (5 - index) * 0.1;
  return Math.max(0, Math.min(1, (seconds - start) / (letterFlightArrival(index) - start)));
}

export function sectionReveal(seconds: number, index: number) {
  const t = Math.max(0, Math.min(1, (seconds - letterFlightArrival(index)) / SECTION_UNFOLD_SECONDS));
  return t * t * (3 - 2 * t);
}

export function entryRevealProgress(elapsed: number) {
  return Math.max(0, Math.min(1, (elapsed - (ASSEMBLY_SECONDS + TRANSITION_FADE_SECONDS)) / ENTER_REVEAL_SECONDS));
}

// Letters depart last-to-first; destinations fill left-to-right.
export const MELT_ORDER = [5, 4, 3, 2, 1, 0] as const;
export const LETTER_START_INTERVAL = 0.1 / MORPH_SECONDS;

export function letterMeltWindow(index: number) {
  const start = (5 - index) * LETTER_START_INTERVAL;
  return { start, end: start + (MORPH_SECONDS - 0.5) / MORPH_SECONDS };
}

export function letterMeltProgress(progress: number, index: number) {
  const { start, end } = letterMeltWindow(index);
  return Math.max(0, Math.min(1, (progress - start) / (end - start)));
}

export function ballLayout(width: number) {
  const gap = Math.min(16, width * 0.025);
  const radius = Math.min(42, (width - 32 - gap * 5) / 12);
  return { radius, pitch: radius * 2 + gap };
}

// Mirror the loading stripes' cubic departure and approach without their hold.
export function ballTravel(progress: number) {
  const t = Math.max(0, Math.min(1, progress));
  return t < 0.5 ? acceleratingTravel(t * 2) * 0.5
    : 1 - acceleratingTravel((1 - t) * 2) * 0.5;
}

// A short size overshoot and smaller rebound after the lens opens.
export function ballBounce(secondsAfterArrival: number) {
  const t = Math.max(0, Math.min(1, secondsAfterArrival / BALL_BOUNCE_SECONDS));
  if (t === 0 || t === 1) return 0;
  return Math.sin(t * Math.PI * 2) * Math.exp(-2 * t) * (1 - t) ** 2;
}

export function letterShape(progress: number, secondsAfterArrival: number) {
  const smooth = (a: number, b: number) => {
    const t = Math.max(0, Math.min(1, (progress - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };
  return {
    gather: smooth(0.02, 0.26),
    open: smooth(0.66, 1),
    size: 1 + ballBounce(secondsAfterArrival) * 0.26,
    icon: smooth(0.86, 1),
  };
}

// Two joined arcs for bottom controls; the first two continue around the left to their sections.
export function letterBallPosition(progress: number, index: number, x: number, y: number, width: number, height: number) {
  const { radius, pitch } = ballLayout(width);
  const targetX = width / 2 + (1.5 - index) * pitch;
  const bottom = radius + 24;
  const right = Math.max(x, width - radius * 2 - 20);
  const turnY = Math.min(y, Math.max(bottom + radius * 2, height * 0.28));
  const t = Math.max(0, Math.min(1, progress));
  const travel = ballTravel(t);
  const cubic = (a: number, b: number, c: number, d: number, u: number) =>
    (1 - u) ** 3 * a + 3 * (1 - u) ** 2 * u * b + 3 * (1 - u) * u * u * c + u ** 3 * d;
  if (index >= 4) {
    const layout = sectionLayout(width, height);
    const target = index === 5 ? layout.menu : layout.icon;
    const left = radius + 16;
    if (travel < 0.35) {
      const u = travel / 0.35;
      return { x: cubic(x, right, right, right, u), y: cubic(y, y, turnY + radius, turnY, u) };
    }
    if (travel < 0.65) {
      const u = (travel - 0.35) / 0.3;
      return { x: cubic(right, right, left + radius * 2, left + radius, u),
        y: cubic(turnY, bottom, bottom, bottom + radius, u) };
    }
    const u = (travel - 0.65) / 0.35;
    return { x: cubic(left + radius, left, target.x, target.x, u),
      y: cubic(bottom + radius, bottom + radius * 2, target.y - Math.min(100, height * 0.15), target.y, u) };
  }
  if (travel < 0.5) {
    const u = travel * 2;
    return { x: cubic(x, right, right, right, u), y: cubic(y, y + Math.min(24, height * 0.025), turnY + (turnY - bottom) * 0.5, turnY, u) };
  }
  const u = (travel - 0.5) * 2;
  return { x: cubic(right, right, targetX + (right - targetX) * 0.45, targetX, u), y: cubic(turnY, bottom + (turnY - bottom) * 0.5, bottom, bottom, u) };
}

export function transitionLight(elapsed: number) {
  const progress = Math.max(0, Math.min(1, (elapsed - ASSEMBLY_SECONDS) / TRANSITION_FADE_SECONDS));
  return 1 - progress * progress * (3 - 2 * progress);
}

export function shouldFinishLoading(previous: number, current: number, ready: boolean) {
  return ready && current >= LOADING_CYCLE_SECONDS
    && Math.floor(current / LOADING_CYCLE_SECONDS) > Math.floor(previous / LOADING_CYCLE_SECONDS);
}

export function entryVaporProgress(secondsSinceClick?: number) {
  return secondsSinceClick === undefined ? 0
    : Math.max(0, Math.min(1, secondsSinceClick / ENTER_VAPOR_SECONDS));
}

export function stepEnterHover(value: number, velocity: number, hovered: boolean, seconds: number) {
  // Substeps keep the spring stable after a slow frame or tab switch.
  const steps = Math.max(1, Math.ceil(Math.min(seconds, 0.1) / 0.008));
  const dt = Math.min(seconds, 0.1) / steps;
  for (let i = 0; i < steps; i++) {
    velocity += ((Number(hovered) - value) * 190 - velocity * 16) * dt;
    value += velocity * dt;
  }
  return { value, velocity };
}
