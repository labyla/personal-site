export const LOADING_MOTION_SECONDS = 2.933333;
// The last stripe starts 5 * 0.035 cycles later and finishes at local 0.84.
export const LOADING_CYCLE_SECONDS = LOADING_MOTION_SECONDS * (0.84 + 5 * 0.035);
export const ASSEMBLY_SECONDS = 1.15 + 11 * 0.075;
export const TRANSITION_FADE_SECONDS = 1.2;

export function transitionLight(elapsed: number) {
  const progress = Math.max(0, Math.min(1, (elapsed - ASSEMBLY_SECONDS) / TRANSITION_FADE_SECONDS));
  return 1 - progress * progress * (3 - 2 * progress);
}

export function shouldFinishLoading(previous: number, current: number, ready: boolean) {
  return ready && current >= LOADING_CYCLE_SECONDS
    && Math.floor(current / LOADING_CYCLE_SECONDS) > Math.floor(previous / LOADING_CYCLE_SECONDS);
}
