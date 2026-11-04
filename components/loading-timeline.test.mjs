import assert from "node:assert/strict";
import { test } from "node:test";
import { sectionLayout, sectionReveal, letterFlightArrival, letterFlightProgress, SECTION_FLIGHT_SECONDS, SECTION_UNFOLD_SECONDS, TRANSITION_SECONDS, ASSEMBLY_SECONDS, MORPH_SECONDS, BALL_BOUNCE_SECONDS, entryVaporProgress, ENTER_VAPOR_SECONDS, stepEnterHover, ENTER_REVEAL_SECONDS, ballTravel, ballBounce, letterShape, entryRevealProgress, ballLayout, letterBallPosition, LETTER_START_INTERVAL, MELT_ORDER, letterMeltWindow, letterMeltProgress, TRANSITION_FADE_SECONDS, transitionLight, LOADING_CYCLE_SECONDS, LOADING_MOTION_SECONDS, shouldFinishLoading } from "./loading-timeline.ts";
import { acceleratingTravel, stripePosition } from "./stripe-motion.ts";

test("fast readiness still waits for a full loading cycle", () => {
  assert.equal(shouldFinishLoading(0, 0.1, true), false);
  assert.equal(shouldFinishLoading(LOADING_CYCLE_SECONDS - 0.02, LOADING_CYCLE_SECONDS - 0.01, true), false);
  assert.equal(shouldFinishLoading(LOADING_CYCLE_SECONDS - 0.01, LOADING_CYCLE_SECONDS + 0.01, true), true);
});

test("unfinished resources repeat cycles; late readiness waits for the next complete cycle", () => {
  const cycle = LOADING_CYCLE_SECONDS;
  assert.equal(shouldFinishLoading(cycle - 0.01, cycle + 0.01, false), false);
  assert.equal(shouldFinishLoading(cycle + 0.1, cycle + 0.2, true), false);
  assert.equal(shouldFinishLoading(2 * cycle - 0.01, 2 * cycle + 0.01, true), true);
  assert.equal(shouldFinishLoading(2 * cycle, 2 * cycle, true), false);
});

test("the last delayed line has left and no line respawns during the exit tail", () => {
  const phase = LOADING_CYCLE_SECONDS / LOADING_MOTION_SECONDS;
  assert.ok(phase >= 0.84 + 5 * 0.035);
  for (let i = 0; i < 6; i++) {
    assert.ok(stripePosition(phase, i, 18, false) > 11);
    assert.ok(stripePosition(phase + 0.1, i, 18, false) > 11);
  }
  assert.ok(stripePosition(1.005, 0, 18, false) > 11);
  assert.ok(stripePosition(0, 5, 18, false) < -11);
});

test("assembly duration includes the final block's stagger and full arrival", () => {
  assert.equal(ASSEMBLY_SECONDS, 1.15 + 11 * 0.075);
});


test("all panel light stays full until the last panel has arrived", () => {
  for (const time of [0, ASSEMBLY_SECONDS / 2, ASSEMBLY_SECONDS - 0.001, ASSEMBLY_SECONDS]) {
    assert.equal(transitionLight(time), 1);
  }
});

test("panel dimming curve is monotonic and settles exactly", () => {
  const end = ASSEMBLY_SECONDS + TRANSITION_FADE_SECONDS;
  assert.ok(Math.abs(transitionLight(ASSEMBLY_SECONDS + TRANSITION_FADE_SECONDS / 2) - 0.5) < 1e-12);
  assert.equal(transitionLight(end), 0);
  assert.equal(transitionLight(end + 10), 0);
  let previous = 1;
  for (let i = 0; i <= 100; i++) {
    const light = transitionLight(ASSEMBLY_SECONDS + TRANSITION_FADE_SECONDS * i / 100);
    assert.ok(light <= previous && light >= 0);
    previous = light;
  }
});


test("rear ENTER waits for full panel dimming before revealing", () => {
  const revealStart = ASSEMBLY_SECONDS + TRANSITION_FADE_SECONDS;
  for (const time of [0, ASSEMBLY_SECONDS, revealStart - 0.001, revealStart]) {
    assert.equal(entryRevealProgress(time), 0);
  }
  assert.equal(transitionLight(revealStart), 0);
  assert.ok(Math.abs(entryRevealProgress(revealStart + ENTER_REVEAL_SECONDS / 2) - 0.5) < 1e-12);
  assert.ok(Math.abs(entryRevealProgress(revealStart + ENTER_REVEAL_SECONDS) - 1) < 1e-12);
  assert.equal(entryRevealProgress(100), 1);
  assert.equal(entryVaporProgress(), 0);
});

test("letters start last-to-first, 100ms apart, and finish in arrival order", () => {
  assert.deepEqual(MELT_ORDER, [5, 4, 3, 2, 1, 0]);
  for (const [rank, index] of MELT_ORDER.entries()) {
    const { start, end } = letterMeltWindow(index);
    assert.ok(Math.abs(start * MORPH_SECONDS - rank * 0.1) < 1e-12);
    assert.equal(letterMeltProgress(start, index), 0);
    assert.equal(letterMeltProgress(end, index), 1);
    assert.equal(letterMeltProgress(1, index), 1);
  }
  assert.ok(Math.abs(LETTER_START_INTERVAL * MORPH_SECONDS - 0.1) < 1e-12);
  assert.equal(letterMeltWindow(0).end, 1);
});

test("four bottom controls fit desktop and mobile, in arrival order", () => {
  for (const [width, height] of [[1280, 720], [390, 844], [320, 568], [844, 390]]) {
    const { radius } = ballLayout(width);
    let previousRight = 0;
    for (const index of MELT_ORDER.slice(2)) {
      const start = { x: width * 0.5, y: height * 0.5 };
      assert.deepEqual(letterBallPosition(0, index, start.x, start.y, width, height), start);
      const end = letterBallPosition(1, index, start.x, start.y, width, height);
      assert.ok(end.x - radius >= 16 - 1e-9 && end.x + radius <= width - 16 + 1e-9);
      assert.ok(end.x - radius > previousRight);
      assert.ok(Math.abs(end.y - radius - 24) < 1e-10);
      previousRight = end.x + radius;
      const turn = letterBallPosition(0.5, index, start.x, start.y, width, height);
      assert.ok(turn.x > start.x && turn.y < start.y);
      for (let n = 0; n <= 100; n++) {
        const point = letterBallPosition(n / 100, index, start.x, start.y, width, height);
        assert.ok(point.x >= radius && point.x <= width - radius);
        assert.ok(point.y >= radius && point.y <= height - radius);
      }
    }
  }
});


test("ball travel uses the stripes' cubic acceleration and mirrored braking without a hold", () => {
  for (const t of [0, 0.1, 0.25, 0.49]) {
    assert.ok(Math.abs(ballTravel(t) - acceleratingTravel(t * 2) * 0.5) < 1e-12);
    assert.ok(Math.abs(ballTravel(1 - t) - (1 - ballTravel(t))) < 1e-12);
  }
  assert.equal(ballTravel(0), 0);
  assert.equal(ballTravel(1), 1);
  const speed = t => (ballTravel(t + 1e-5) - ballTravel(t - 1e-5)) / 2e-5;
  assert.ok(Math.abs(speed(0.2) / speed(0.1) - 4) < 1e-5);
  assert.ok(speed(0.8) > speed(0.9));
  for (let i = 1; i < 100; i++) assert.ok(ballTravel(i / 100) > ballTravel((i - 1) / 100));
});

test("lens opens with one short overshoot and a smaller rebound", () => {
  assert.equal(ballBounce(-0.1), 0);
  assert.equal(ballBounce(0), 0);
  const overshoot = ballBounce(BALL_BOUNCE_SECONDS * 0.25);
  const rebound = ballBounce(BALL_BOUNCE_SECONDS * 0.75);
  assert.ok(overshoot > 0 && rebound < 0);
  assert.ok(Math.abs(rebound) < overshoot);
  assert.equal(ballBounce(BALL_BOUNCE_SECONDS), 0);
  assert.equal(ballBounce(BALL_BOUNCE_SECONDS + 1), 0);
});

test("letters gather before opening; content resolves only near the final shape", () => {
  assert.deepEqual(letterShape(0, -2.1), { gather: 0, open: 0, size: 1, icon: 0 });
  for (const progress of [0.26, 0.4, 0.66]) {
    const shape = letterShape(progress, -1);
    assert.equal(shape.gather, 1);
    assert.equal(shape.open, 0);
    assert.equal(shape.icon, 0);
  }
  assert.equal(letterShape(0.86, -0.1).icon, 0);
  assert.ok(letterShape(0.94, -0.1).open > 0.9);
  assert.ok(letterShape(0.94, -0.1).icon > 0);
  for (let n = 0; n <= 100; n++) {
    const shape = letterShape(1, n / 100 * BALL_BOUNCE_SECONDS);
    assert.ok(shape.size >= 0.98 && shape.size <= 1.12);
  }
  assert.deepEqual(letterShape(1, BALL_BOUNCE_SECONDS), { gather: 1, open: 1, size: 1, icon: 1 });
});

test("rear ENTER evaporates smoothly after activation and stays absent", () => {
  assert.equal(entryVaporProgress(), 0);
  assert.equal(entryVaporProgress(-1), 0);
  assert.equal(entryVaporProgress(0), 0);
  assert.equal(entryVaporProgress(ENTER_VAPOR_SECONDS / 2), 0.5);
  assert.equal(entryVaporProgress(ENTER_VAPOR_SECONDS), 1);
  assert.equal(entryVaporProgress(100), 1);
  let previous = 0;
  for (let i = 0; i <= 100; i++) {
    const vapor = entryVaporProgress(i / 100);
    assert.ok(vapor >= previous && vapor <= 1);
    previous = vapor;
  }
});

test("ENTER hover has a bounded jelly overshoot and settles on both enter and leave", () => {
  let hover = { value: 0, velocity: 0 };
  let peak = 0;
  for (let i = 0; i < 240; i++) {
    hover = stepEnterHover(hover.value, hover.velocity, true, 1 / 60);
    peak = Math.max(peak, hover.value);
    assert.ok(hover.value >= 0 && hover.value < 1.2);
  }
  assert.ok(peak > 1.01);
  assert.ok(Math.abs(hover.value - 1) < 1e-8);
  for (let i = 0; i < 240; i++) hover = stepEnterHover(hover.value, hover.velocity, false, 1 / 60);
  assert.ok(Math.abs(hover.value) < 1e-8);
  assert.ok(Math.abs(hover.velocity) < 1e-8);
  hover = stepEnterHover(0, 0, true, 30);
  assert.ok(hover.value >= 0 && hover.value < 1.2);
});


test("the first two controls continue to the menu and the block corner without leaving the viewport", () => {
  for (const [width, height] of [[1280, 720], [390, 844], [320, 568], [844, 390]]) {
    const { radius } = ballLayout(width);
    const layout = sectionLayout(width, height);
    assert.equal(layout.menu.width, Math.min(720, width - 32));
    assert.equal(layout.menu.height, 56);
    assert.equal(height - layout.menu.y - layout.menu.height / 2, 20);
    assert.ok(layout.block.y + layout.block.height / 2 < layout.menu.y - layout.menu.height / 2);
    assert.ok(Math.abs(layout.icon.x - radius - (layout.block.x - layout.block.width / 2)) < 1e-9);
    assert.ok(Math.abs(layout.icon.y + radius - (layout.block.y + layout.block.height / 2)) < 1e-9);
    for (const index of [5, 4]) {
      const target = index === 5 ? layout.menu : layout.icon;
      const end = letterBallPosition(1, index, width / 2, height / 2, width, height);
      assert.ok(Math.hypot(end.x - target.x, end.y - target.y) < 1e-9);
      for (let i = 0; i <= 200; i++) {
        const point = letterBallPosition(i / 200, index, width / 2, height / 2, width, height);
        assert.ok(point.x >= radius && point.x <= width - radius);
        assert.ok(point.y >= radius && point.y <= height - radius);
      }
    }
  }
});

test("sections unfold only after their flights and complete before background interaction", () => {
  assert.equal(letterFlightArrival(5), SECTION_FLIGHT_SECONDS);
  assert.ok(letterFlightArrival(4) > letterFlightArrival(5));
  for (const index of [5, 4]) {
    const arrival = letterFlightArrival(index);
    assert.equal(letterFlightProgress(-1, index), 0);
    assert.equal(letterFlightProgress(arrival, index), 1);
    assert.equal(sectionReveal(arrival - 0.01, index), 0);
    assert.equal(sectionReveal(arrival, index), 0);
    assert.ok(Math.abs(sectionReveal(arrival + SECTION_UNFOLD_SECONDS / 2, index) - 0.5) < 1e-12);
    assert.equal(sectionReveal(arrival + SECTION_UNFOLD_SECONDS + 0.001, index), 1);
    assert.ok(TRANSITION_SECONDS >= arrival + SECTION_UNFOLD_SECONDS + BALL_BOUNCE_SECONDS - 1e-12);
  }
  for (const index of [3, 2, 1, 0]) {
    assert.ok(Math.abs(letterFlightArrival(index) - letterMeltWindow(index).end * MORPH_SECONDS) < 1e-12);
    assert.equal(letterFlightProgress(TRANSITION_SECONDS, index), 1);
  }
});
