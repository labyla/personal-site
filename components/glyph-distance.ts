// Pack signed distance in logical pixels into G/B; retain R as glyph coverage.
export function encodeGlyphDistance(pixels: Uint8ClampedArray, width: number, height: number, pixelRatio: number) {
  const distance = new Float32Array(width * height).fill(1e6);
  const inside = (index: number) => pixels[index * 4] >= 128;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const filled = inside(i);
      if ((x > 0 && inside(i - 1) !== filled)
        || (x + 1 < width && inside(i + 1) !== filled)
        || (y > 0 && inside(i - width) !== filled)
        || (y + 1 < height && inside(i + width) !== filled)) distance[i] = 0;
    }
  }
  // Separable squared Euclidean transform avoids faceted chamfer normals.
  const length = Math.max(width, height);
  const source = new Float64Array(length);
  const result = new Float64Array(length);
  const sites = new Int32Array(length);
  const boundaries = new Float64Array(length + 1);
  const transform = (count: number) => {
    let k = 0;
    sites[0] = 0;
    boundaries[0] = -Infinity;
    boundaries[1] = Infinity;
    for (let q = 1; q < count; q++) {
      let crossing;
      do {
        const v = sites[k];
        crossing = ((source[q] + q * q) - (source[v] + v * v)) / (2 * (q - v));
        if (crossing > boundaries[k]) break;
        k--;
      } while (k >= 0);
      k++;
      sites[k] = q;
      boundaries[k] = crossing;
      boundaries[k + 1] = Infinity;
    }
    k = 0;
    for (let q = 0; q < count; q++) {
      while (boundaries[k + 1] < q) k++;
      result[q] = (q - sites[k]) ** 2 + source[sites[k]];
    }
  };
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) source[y] = distance[y * width + x];
    transform(height);
    for (let y = 0; y < height; y++) distance[y * width + x] = result[y];
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) source[x] = distance[y * width + x];
    transform(width);
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      distance[i] = Math.sqrt(result[x]) + 0.5;
      const signed = Math.min(distance[i] / pixelRatio, 127) * (inside(i) ? -1 : 1);
      const packed = Math.round((signed + 128) * 256);
      pixels[i * 4 + 1] = packed >> 8;
      pixels[i * 4 + 2] = packed & 255;
    }
  }
}
