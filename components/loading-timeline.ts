export const LOADING_MOTION_SECONDS = 2.933333;
// The last stripe starts 5 * 0.035 cycles later and finishes at local 0.84.
export const LOADING_CYCLE_SECONDS = LOADING_MOTION_SECONDS * (0.84 + 5 * 0.035);
export const ASSEMBLY_SECONDS = 1.15 + 11 * 0.075;
export const TRANSITION_FADE_SECONDS = 1.2;
export const MORPH_SECONDS = 2.6;
export const BALL_BOUNCE_SECONDS = 0.4;
export const ENTER_REVEAL_SECONDS = 1.1;
export const ENTER_VAPOR_SECONDS = 0.55;
export const SECTION_FLIGHT_SECONDS = 0.65;
export const SECTION_UNFOLD_SECONDS = 0.85;
export const TRANSITION_SECONDS = SECTION_FLIGHT_SECONDS + 0.2 + SECTION_UNFOLD_SECONDS + BALL_BOUNCE_SECONDS;

// Coordinates use the shader's bottom-left origin; source order is l-a-b-y-l-a.
export function sectionLayout(width: number, height: number, weights: readonly number[] = [1, 1, 1, 1, 1, 1]) {
  const verticalPanels = width >= 960;
  const gap = verticalPanels ? Math.min(20, Math.max(12, width * 0.012)) : 10;
  const paddingX = verticalPanels ? Math.max(32, width * 0.03125) : 20;
  const paddingY = verticalPanels ? Math.max(40, height * 0.073) : 20;
  const areaWidth = width - paddingX * 2;
  const areaHeight = height - paddingY * 2;
  const length = (verticalPanels ? areaWidth : areaHeight) - gap * 5;
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let offset = 0;
  return Array.from({ length: 6 }, (_, index) => {
    const size = length * weights[index] / total;
    const panel = {
      x: verticalPanels ? (width - areaWidth) / 2 + offset + size / 2 : width / 2,
      y: verticalPanels ? height / 2 : (height + areaHeight) / 2 - offset - size / 2,
      width: verticalPanels ? size : areaWidth,
      height: verticalPanels ? areaHeight : size,
    };
    offset += size + gap;
    return panel;
  });
}

// Near-simultaneous short departures, preserving the last-to-first order.
export function letterFlightArrival(index: number) {
  return SECTION_FLIGHT_SECONDS + (5 - index) * 0.04;
}

export function letterFlightProgress(seconds: number, index: number) {
  return Math.max(0, Math.min(1, (seconds - (5 - index) * 0.04) / SECTION_FLIGHT_SECONDS));
}

export function sectionReveal(seconds: number, index: number) {
  const t = Math.max(0, Math.min(1, (seconds - letterFlightArrival(index)) / SECTION_UNFOLD_SECONDS));
  return t * t * (3 - 2 * t);
}

export function entryRevealProgress(elapsed: number, withFlutedBackground = true) {
  const delay = withFlutedBackground ? ASSEMBLY_SECONDS + TRANSITION_FADE_SECONDS : 0;
  return Math.max(0, Math.min(1, (elapsed - delay) / ENTER_REVEAL_SECONDS));
}

export function ballLayout(width: number) {
  const gap = Math.min(16, width * 0.025);
  const radius = Math.min(42, (width - 32 - gap * 5) / 12);
  return { radius, pitch: radius * 2 + gap };
}

// Cubic acceleration and mirrored braking over a short direct displacement.
export function ballTravel(progress: number) {
  const t = Math.max(0, Math.min(1, progress));
  return t < 0.5 ? (t * 2) ** 3 * 0.5 : 1 - ((1 - t) * 2) ** 3 * 0.5;
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
  };
}

// Direct source-to-panel motion without a detour or an arc.
export function letterBallPosition(progress: number, index: number, x: number, y: number, width: number, height: number) {
  const target = sectionLayout(width, height)[index];
  const travel = ballTravel(progress);
  return { x: x + (target.x - x) * travel, y: y + (target.y - y) * travel };
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
