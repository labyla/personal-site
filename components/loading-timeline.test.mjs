import assert from "node:assert/strict";
import { test } from "node:test";
import { ASSEMBLY_SECONDS, TRANSITION_FADE_SECONDS, transitionLight, LOADING_CYCLE_SECONDS, LOADING_MOTION_SECONDS, shouldFinishLoading } from "./loading-timeline.ts";
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


test("all panel light and text opacity stay full until the last panel has arrived", () => {
  for (const time of [0, ASSEMBLY_SECONDS / 2, ASSEMBLY_SECONDS - 0.001, ASSEMBLY_SECONDS]) {
    assert.equal(transitionLight(time), 1);
  }
});

test("one shared fade reaches zero exactly when text and assembly light disappear", () => {
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
