export const STRIPE_COUNT = 6;

// Each stripe crosses the composition with its own delayed stop near the centre.
export function stripePosition(phase: number, index: number, travel: number, loop = true) {
  const local = phase - index * 0.035;
  const time = loop ? ((local % 1) + 1) % 1 : Math.max(0, local);
  const restingPosition = ((STRIPE_COUNT - 1) / 2 - index) * 0.95;

  const excursion = travel * 1.8;

  if (time < 0.34) {
    return restingPosition - excursion * (1 - time / 0.34) ** 3;
  }
  if (time <= 0.5) return restingPosition;
  if (time < 0.84) {
    return restingPosition + excursion * ((time - 0.5) / 0.34) ** 3;
  }
  // The jump back to the entrance happens beyond the visible area.
  return restingPosition + excursion;
}
