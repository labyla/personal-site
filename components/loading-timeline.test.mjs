import assert from "node:assert/strict";
import { test } from "node:test";
import { sectionLayout, sectionReveal, letterFlightArrival, letterFlightProgress, SECTION_FLIGHT_SECONDS, SECTION_UNFOLD_SECONDS, TRANSITION_SECONDS, ASSEMBLY_SECONDS, MORPH_SECONDS, BALL_BOUNCE_SECONDS, entryVaporProgress, ENTER_VAPOR_SECONDS, stepEnterHover, ENTER_REVEAL_SECONDS, ballTravel, ballBounce, letterShape, entryRevealProgress, letterBallPosition, TRANSITION_FADE_SECONDS, transitionLight, LOADING_CYCLE_SECONDS, LOADING_MOTION_SECONDS, shouldFinishLoading } from "./loading-timeline.ts";
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

test("black-background mode reveals ENTER after loading without a hidden assembly wait", () => {
  assert.equal(entryRevealProgress(0, false), 0);
  assert.equal(entryRevealProgress(ENTER_REVEAL_SECONDS / 2, false), 0.5);
  assert.equal(entryRevealProgress(ENTER_REVEAL_SECONDS, false), 1);
  assert.equal(entryRevealProgress(ENTER_REVEAL_SECONDS, true), 0);
});

test("six panels retain page insets in source order at desktop and mobile sizes", () => {
  for (const [width, height, paddingX, paddingY] of [[1280,720,40,52.56], [960,720,32,52.56], [959,720,20,20], [1672,941,52.25,68.693], [390,844,20,20], [320,568,20,20], [844,390,20,20]]) {
    const panels = sectionLayout(width, height);
    assert.equal(panels.length, 6);
    assert.ok(Math.abs(Math.min(...panels.map(p => p.x - p.width / 2)) - paddingX) < 1e-9);
    assert.ok(Math.abs(Math.max(...panels.map(p => p.x + p.width / 2)) - (width - paddingX)) < 1e-9);
    assert.ok(Math.abs(Math.min(...panels.map(p => p.y - p.height / 2)) - paddingY) < 1e-9);
    assert.ok(Math.abs(Math.max(...panels.map(p => p.y + p.height / 2)) - (height - paddingY)) < 1e-9);
    for (const [index, panel] of panels.entries()) {
      assert.ok(panel.x - panel.width / 2 >= -1e-9);
      assert.ok(panel.x + panel.width / 2 <= width + 1e-9);
      assert.ok(panel.y - panel.height / 2 >= -1e-9);
      assert.ok(panel.y + panel.height / 2 <= height + 1e-9);
      if (width >= 960) {
        assert.equal(panel.y, height / 2);
        if (index) assert.ok(panel.x > panels[index - 1].x);
      } else {
        assert.equal(panel.x, width / 2);
        if (index) assert.ok(panel.y < panels[index - 1].y);
      }
    }
  }
});


test("short direct displacement retains cubic acceleration and mirrored braking", () => {
  for(const t of [0,0.1,0.25,0.49]) {
    assert.ok(Math.abs(ballTravel(t)-(t*2)**3*0.5)<1e-12);
    assert.ok(Math.abs(ballTravel(1-t)-(1-ballTravel(t)))<1e-12);
  }
  assert.equal(SECTION_FLIGHT_SECONDS,0.65);
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

test("letters gather before opening and settle without icons", () => {
  assert.deepEqual(letterShape(0, -2.1), { gather: 0, open: 0, size: 1 });
  for (const progress of [0.26, 0.4, 0.66]) {
    const shape = letterShape(progress, -1);
    assert.equal(shape.gather, 1);
    assert.equal(shape.open, 0);
  }
  assert.ok(letterShape(0.94, -0.1).open > 0.9);
  for (let n = 0; n <= 100; n++) {
    const shape = letterShape(1, n / 100 * BALL_BOUNCE_SECONDS);
    assert.ok(shape.size >= 0.98 && shape.size <= 1.12);
  }
  assert.deepEqual(letterShape(1, BALL_BOUNCE_SECONDS), { gather: 1, open: 1, size: 1 });
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


test("each drop reaches its own panel before that panel spreads", () => {
  assert.equal(letterFlightArrival(5), SECTION_FLIGHT_SECONDS);
  assert.ok(Math.abs(letterFlightArrival(0) - letterFlightArrival(5) - 0.2) < 1e-12);
  for (let index = 0; index < 6; index++) {
    const arrival = letterFlightArrival(index);
    assert.equal(sectionReveal(arrival - 0.001, index), 0);
    assert.equal(sectionReveal(arrival, index), 0);
    assert.ok(Math.abs(sectionReveal(arrival + SECTION_UNFOLD_SECONDS / 2, index) - 0.5) < 1e-12);
    assert.equal(sectionReveal(arrival + SECTION_UNFOLD_SECONDS + 0.001, index), 1);
    assert.ok(TRANSITION_SECONDS >= arrival + SECTION_UNFOLD_SECONDS + BALL_BOUNCE_SECONDS - 1e-12);
    assert.equal(letterFlightProgress((5 - index) * 0.04, index), 0);
    assert.ok(letterFlightProgress((5 - index) * 0.04 + 0.1, index) > 0);
  }
});


test("opening a panel preserves the overall extent and gaps while neighbours give way", () => {
  for (const [width, height, expectedGap] of [[1280,720,15.36], [960,720,12], [959,720,10], [1672,941,20], [390,844,10], [320,568,10], [844,390,10]]) {
    const vertical = width >= 960;
    const neutral = sectionLayout(width, height);
    for (let index = 0; index < 6; index++) {
      const weights = Array(6).fill(1);
      weights[index] = 2.6;
      const open = sectionLayout(width, height, weights);
      const axis = vertical ? "width" : "height";
      assert.ok(open[index][axis] > neutral[index][axis]);
      assert.ok(Math.abs(open.reduce((sum, p) => sum + p[axis], 0) - neutral.reduce((sum, p) => sum + p[axis], 0)) < 1e-9);
      for (let i = 1; i < 6; i++) {
        const gap = vertical ? open[i].x - open[i].width / 2 - open[i - 1].x - open[i - 1].width / 2
          : open[i - 1].y - open[i - 1].height / 2 - open[i].y - open[i].height / 2;
        assert.ok(Math.abs(gap - expectedGap) < 1e-9);
      }
    }
  }
});


test("letters move only along the direct segment to their own panel centre", () => {
  for (const [width, height] of [[1280,720], [390,844], [844,390]]) {
    const panels = sectionLayout(width, height);
    for (let index = 0; index < 6; index++) {
      const start = { x: width / 2 + (index - 2.5) * 30, y: height / 2 };
      const target = panels[index];
      let previous = 0;
      for (let n = 0; n <= 100; n++) {
        const point = letterBallPosition(n / 100, index, start.x, start.y, width, height);
        const dx = target.x - start.x, dy = target.y - start.y;
        const distance = Math.hypot(point.x - start.x, point.y - start.y);
        assert.ok(distance >= previous - 1e-9 && distance <= Math.hypot(dx, dy) + 1e-9);
        assert.ok(Math.abs((point.x - start.x) * dy - (point.y - start.y) * dx) < 1e-8);
        previous = distance;
      }
      assert.deepEqual(letterBallPosition(0, index, start.x, start.y, width, height), start);
      const end = letterBallPosition(1, index, start.x, start.y, width, height);
      assert.ok(Math.hypot(end.x - target.x, end.y - target.y) < 1e-9);
    }
  }
});
