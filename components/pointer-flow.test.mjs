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


test("independent moving buttons light both paths while an inactive moving cursor stays dark", () => {
  const flow = new PointerFlow();
  const sources = [
    { x: 0.1, y: 0.95, active: false },
    { x: 0.15, y: 0.2, active: false },
    { x: 0.85, y: 0.55, active: false },
  ];
  flow.updateMany(0.016, sources, 1);
  for (let i = 1; i <= 24; i++) {
    sources[0].x = 0.1 + i * 0.025;
    sources[1] = { x: 0.15 + i * 0.018, y: 0.2, active: true };
    sources[2] = { x: 0.85 - i * 0.018, y: 0.55, active: true };
    flow.updateMany(0.016, sources, 1);
  }
  const at = (x, y) => flow.pixels[(Math.floor(y * FLOW_SIZE) * FLOW_SIZE + Math.floor(x * FLOW_SIZE)) * 4];
  assert.ok(at(0.35, 0.2) > 0, "first button leaves a trail");
  assert.ok(at(0.65, 0.55) > 0, "opposite-moving second button leaves its own trail");
  assert.equal(at(0.4, 0.95), 0, "inactive cursor cannot inject during flight");
  const before = energy(flow);
  sources.forEach(source => { source.active = false; });
  for (let i = 0; i < 100; i++) flow.updateMany(0.016, sources, 1);
  assert.ok(energy(flow) > 0 && energy(flow) < before, "button trails survive and fade after landing");
});

test("enabling the cursor after flight does not inject its inactive travel", () => {
  const flow = new PointerFlow();
  for (let i = 0; i < 30; i++) {
    flow.updateMany(0.016, [{ x: 0.1 + i * 0.02, y: 0.5, active: false }], 1);
  }
  flow.updateMany(0.016, [{ x: 0.68, y: 0.5, active: true }], 1);
  assert.equal(energy(flow), 0, "activation alone leaves the background untouched");
  flow.updateMany(0.016, [{ x: 0.72, y: 0.5, active: true }], 1);
  assert.ok(energy(flow) > 0, "subsequent cursor motion lights the background");
});
