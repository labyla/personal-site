export const LOADING_MOTION_SECONDS = 2.933333;
// The last stripe starts 5 * 0.035 cycles later and finishes at local 0.84.
export const LOADING_CYCLE_SECONDS = LOADING_MOTION_SECONDS * (0.84 + 5 * 0.035);
export const ASSEMBLY_SECONDS = 1.15 + 11 * 0.075;
export const TRANSITION_FADE_SECONDS = 2.4;
export const MORPH_SECONDS = 2.6;

export function meltProgress(elapsed: number) {
  return Math.max(0, Math.min(1, (elapsed - ASSEMBLY_SECONDS) / MORPH_SECONDS));
}

// Positions in labyla: b, y, first a, second l, first l, final a.
export const MELT_ORDER = [2, 3, 1, 4, 0, 5] as const;

export const VERTICAL_MELT_ORDER = [0, 1, 2, 3, 4, 5] as const;
export const MENU_ARRIVAL_PROGRESS = 0.7;
export const LETTER_START_INTERVAL = 0.1 / MORPH_SECONDS;

export function letterMeltWindow(index: number, vertical = false) {
  const order: readonly number[] = vertical ? VERTICAL_MELT_ORDER : MELT_ORDER;
  const rank = order.indexOf(index);
  const start = rank * LETTER_START_INTERVAL;
  const end = rank === 0 ? 0.14 : 0.62 + rank * 0.03;
  return { start, end };
}

export function letterMeltProgress(progress: number, index: number, vertical = false) {
  const { start, end } = letterMeltWindow(index, vertical);
  return Math.max(0, Math.min(1, (progress - start) / (end - start)));
}

// Cubic displacement gives quadratic speed growth, followed by smooth braking.
export function meltTravel(progress: number) {
  const t = Math.max(0, Math.min(1, progress));
  return t < 0.8 ? (t / 0.8) ** 3 * 0.8 : 1 - ((1 - t) / 0.2) ** 3 * 0.2;
}

export function poolTravel(progress: number) {
  return meltTravel(progress / MENU_ARRIVAL_PROGRESS);
}

// Followers keep accelerating until their silhouettes merge into glass.
export function catchUpTravel(progress: number) {
  const t = Math.max(0, Math.min(1, progress));
  return t * t;
}

export function transitionLight(elapsed: number) {
  const progress = Math.max(0, Math.min(1, (elapsed - ASSEMBLY_SECONDS) / TRANSITION_FADE_SECONDS));
  return 1 - progress * progress * (3 - 2 * progress);
}

export function shouldFinishLoading(previous: number, current: number, ready: boolean) {
  return ready && current >= LOADING_CYCLE_SECONDS
    && Math.floor(current / LOADING_CYCLE_SECONDS) > Math.floor(previous / LOADING_CYCLE_SECONDS);
}
