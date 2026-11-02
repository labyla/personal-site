import assert from "node:assert/strict";
import { test } from "node:test";
import { encodeGlyphDistance } from "./glyph-distance.ts";

function mask(width, height, filled, pixelRatio = 1) {
  const pixels = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      pixels[(y * width + x) * 4] = filled(x, y) ? 255 : 0;
      pixels[(y * width + x) * 4 + 3] = 255;
    }
  }
  encodeGlyphDistance(pixels, width, height, pixelRatio);
  return (x, y) => {
    const i = (y * width + x) * 4;
    return { coverage: pixels[i], distance: pixels[i + 1] + pixels[i + 2] / 256 - 128 };
  };
}

test("glyph distance keeps coverage and measures both sides of a straight contour", () => {
  const sample = mask(12, 12, (x) => x >= 4 && x <= 8);
  assert.deepEqual(sample(4, 6), { coverage: 255, distance: -0.5 });
  assert.equal(sample(6, 6).distance, -2.5);
  assert.deepEqual(sample(3, 6), { coverage: 0, distance: 0.5 });
  assert.equal(sample(1, 6).distance, 2.5);
});

test("glyph counters remain outside glass and distances use logical pixels", () => {
  const ring = (x, y) => x >= 2 && x <= 12 && y >= 2 && y <= 12
    && !(x >= 6 && x <= 8 && y >= 6 && y <= 8);
  const sample = mask(15, 15, ring);
  const scaled = mask(15, 15, ring, 2);
  assert.ok(sample(7, 7).distance > 0);
  assert.ok(sample(4, 7).distance < 0);
  assert.equal(scaled(7, 7).distance, sample(7, 7).distance / 2);
  assert.equal(sample(4, 7).distance, sample(7, 4).distance);
});
