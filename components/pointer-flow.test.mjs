import test from "node:test";
import assert from "node:assert/strict";
import { PointerFlow, FLOW_SIZE } from "./pointer-flow.ts";

const energy = flow => flow.pixels.reduce((sum, value, index) => sum + (index % 4 === 0 ? value : 0), 0);
const brush = flow => {
  flow.update(0.016, 0.2, 0.5, true, 1);
  for (let i = 1; i <= 35; i++) flow.update(0.016, 0.2 + i * 0.015, 0.5, true, 1);
};

test("pointer motion leaves light behind the current cursor and decays after leaving", () => {
  const flow = new PointerFlow();
  brush(flow);
  const at = (x, y) => flow.pixels[(Math.floor(y * FLOW_SIZE) * FLOW_SIZE + Math.floor(x * FLOW_SIZE)) * 4];
  assert.ok(at(0.4, 0.5) > 0, "the earlier path remains lit");
  const before = energy(flow);
  for (let i = 0; i < 40; i++) flow.update(0.016, 0.725, 0.5, false, 1);
  assert.ok(energy(flow) > 0, "trail survives pointer departure");
  assert.ok(energy(flow) < before, "trail fades instead of remaining painted");
  for (let i = 0; i < 650; i++) flow.update(0.016, 0.725, 0.5, false, 1);
  assert.equal(energy(flow), 0);
});

test("a stationary cursor does not inject an endless glow", () => {
  const flow = new PointerFlow();
  for (let i = 0; i < 100; i++) flow.update(0.016, 0.5, 0.5, true, 1);
  assert.equal(energy(flow), 0);
  brush(flow);
  const before = energy(flow);
  for (let i = 0; i < 100; i++) flow.update(0.016, 0.725, 0.5, true, 1);
  assert.ok(energy(flow) < before);
});
