import assert from "node:assert/strict";
import { test } from "node:test";
import { STRIPE_COUNT, stripePosition } from "./stripe-motion.ts";

const position = (phase, index = 0) => stripePosition(phase, index, 18);
const speed = (phase, index = 0) =>
  Math.abs(position(phase + 0.0001, index) - position(phase, index)) / 0.0001;

test("stripes brake on approach and accelerate symmetrically after the stop", () => {
  assert.equal(STRIPE_COUNT, 6);
  assert.ok(position(0.1) < position(0.2));
  assert.ok(speed(0.1) > speed(0.2));
  assert.ok(speed(0.2) > speed(0.3));
  assert.ok(speed(0.339) < 0.01);
  assert.equal(position(0.36), position(0.48));
  assert.ok(speed(0.501) < 0.01);
  assert.ok(speed(0.6) < speed(0.7));
  assert.ok(speed(0.7) < speed(0.8));
  for (const distance of [0.03, 0.1, 0.2, 0.3]) {
    const rest = position(0.4);
    assert.ok(Math.abs(position(0.34 - distance) - rest - (rest - position(0.5 + distance))) < 1e-10);
  }
});

test("neighbouring stripes reach and leave their stops at different times", () => {
  assert.equal(speed(0.35, 0), 0);
  assert.ok(speed(0.35, 1) > 0);
  assert.ok(speed(0.51, 0) > 0);
  assert.equal(speed(0.51, 1), 0);
});

test("the loop wraps only outside the viewport", () => {
  for (let i = 0; i < STRIPE_COUNT; i++) {
    const wrap = i * 0.035;
    assert.ok(position(wrap - 1e-8, i) > 11);
    assert.ok(position(wrap + 1e-8, i) < -11);
    assert.ok(Math.abs(position(wrap + 0.2, i) - position(wrap + 1.2, i)) < 1e-10);
  }
});

test("stripes rest closer together and retain a gentle start before stronger acceleration", () => {
  assert.ok(Math.abs(position(0.4, 0) - position(0.435, 1) - 0.95) < 1e-10);
  const rest = position(0.4);
  assert.ok(speed(0.5) < 0.0001);
  assert.ok(position(0.51) - rest < 0.001);
  const previousLateSpeed = 3 * 18 * 0.25 ** 2 / 0.34 ** 3;
  assert.ok(speed(0.75) > previousLateSpeed * 1.7);
});
