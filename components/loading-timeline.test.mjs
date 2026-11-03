import assert from "node:assert/strict";
import { test } from "node:test";
import { ASSEMBLY_SECONDS, MORPH_SECONDS, meltProgress, meltTravel, poolTravel, catchUpTravel, MENU_ARRIVAL_PROGRESS, LETTER_START_INTERVAL, VERTICAL_MELT_ORDER, MELT_ORDER, letterMeltWindow, letterMeltProgress, TRANSITION_FADE_SECONDS, transitionLight, LOADING_CYCLE_SECONDS, LOADING_MOTION_SECONDS, shouldFinishLoading } from "./loading-timeline.ts";
import { stripePosition } from "./stripe-motion.ts";

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

test("panel illumination fades while the glass continues morphing", () => {
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


test("glass morph starts after assembly and finishes after panel dimming", () => {
  assert.equal(meltProgress(0), 0);
  assert.equal(meltProgress(ASSEMBLY_SECONDS), 0);
  assert.ok(Math.abs(meltProgress(ASSEMBLY_SECONDS + MORPH_SECONDS / 2) - 0.5) < 1e-12);
  assert.equal(meltProgress(ASSEMBLY_SECONDS + MORPH_SECONDS), 1);
  assert.equal(meltProgress(ASSEMBLY_SECONDS + MORPH_SECONDS + 10), 1);
  assert.ok(meltProgress(ASSEMBLY_SECONDS + TRANSITION_FADE_SECONDS) < 1);
  assert.equal(transitionLight(ASSEMBLY_SECONDS + MORPH_SECONDS), 0);
});


test("liquid starts gently, accelerates quadratically and brakes continuously at the menu", () => {
  assert.equal(meltTravel(0), 0);
  assert.equal(meltTravel(1), 1);
  const velocity = (t) => (meltTravel(t + 1e-5) - meltTravel(t - 1e-5)) / 2e-5;
  assert.ok(velocity(0.01) < 0.002);
  assert.ok(Math.abs(velocity(0.4) / velocity(0.2) - 4) < 0.001);
  assert.ok(Math.abs(velocity(0.8 - 1e-4) - velocity(0.8 + 1e-4)) < 0.005);
  assert.ok(velocity(0.999) < 0.001);
  let previous = 0;
  for (let i = 0; i <= 100; i++) {
    const travel = meltTravel(i / 100);
    assert.ok(travel >= previous && travel <= 1);
    previous = travel;
  }
});


test("letters start b, y, first a, second l, first l, final a", () => {
  assert.deepEqual(MELT_ORDER, [2, 3, 1, 4, 0, 5]);
  const starts = MELT_ORDER.map((index) => letterMeltWindow(index).start);
  assert.equal(starts[0], 0);
  for (let rank = 1; rank < starts.length; rank++) assert.ok(starts[rank] > starts[rank - 1]);
  for (const index of MELT_ORDER) {
    const { start, end } = letterMeltWindow(index);
    assert.equal(letterMeltProgress(start, index), 0);
    assert.equal(letterMeltProgress(end, index), 1);
    assert.equal(letterMeltProgress(1, index), 1);
  }
});

test("later followers catch up faster; final three merge into the menu", () => {
  let previousDuration = Infinity;
  let previousEnd = 0;
  for (const index of MELT_ORDER.slice(1)) {
    const { start, end } = letterMeltWindow(index);
    const duration = end - start;
    assert.ok(duration < previousDuration);
    assert.ok(end > previousEnd && end < 1);
    previousDuration = duration;
    previousEnd = end;
  }
  assert.ok(letterMeltWindow(2).end < letterMeltWindow(3).end);
});


test("vertical letters melt strictly from top to bottom, starting with the top l", () => {
  assert.deepEqual(VERTICAL_MELT_ORDER, [0, 1, 2, 3, 4, 5]);
  for (let i = 0; i < 6; i++) {
    const { start, end } = letterMeltWindow(i, true);
    assert.equal(start, i * LETTER_START_INTERVAL);
    assert.equal(letterMeltProgress(start, i, true), 0);
    assert.equal(letterMeltProgress(end, i, true), 1);
  }
});

test("menu arrives before the last three letters in both layouts", () => {
  for (const vertical of [false, true]) {
    const order = vertical ? VERTICAL_MELT_ORDER : MELT_ORDER;
    assert.equal(poolTravel(MENU_ARRIVAL_PROGRESS), 1);
    const late = order.filter((index) => letterMeltWindow(index, vertical).end > MENU_ARRIVAL_PROGRESS + 1e-10);
    assert.deepEqual(late, order.slice(3));
    for (const index of late) {
      assert.ok(letterMeltProgress(MENU_ARRIVAL_PROGRESS, index, vertical) < 1);
      assert.equal(poolTravel(letterMeltWindow(index, vertical).end), 1);
    }
  }
});

test("followers never brake before absorption; pool has no intermediate speed dips", () => {
  const velocity = (fn, t) => (fn(t + 1e-5) - fn(t - 1e-5)) / 2e-5;
  let previous = 0;
  for (let i = 1; i < 100; i++) {
    const speed = velocity(catchUpTravel, i / 100);
    assert.ok(speed > previous);
    previous = speed;
  }
  previous = 0;
  for (let i = 1; i < 80; i++) {
    const speed = velocity(meltTravel, i / 100);
    assert.ok(speed > previous);
    previous = speed;
  }
  assert.equal(catchUpTravel(0), 0);
  assert.equal(catchUpTravel(1), 1);
});


test("closer letter starts retain overlap and the existing orders", () => {
  assert.ok(Math.abs(LETTER_START_INTERVAL * MORPH_SECONDS - 0.1) < 1e-12);
  for (const vertical of [false, true]) {
    const order = vertical ? VERTICAL_MELT_ORDER : MELT_ORDER;
    for (let rank = 1; rank < order.length; rank++) {
      assert.ok(letterMeltWindow(order[rank], vertical).start < letterMeltWindow(order[rank - 1], vertical).end);
    }
  }
});
