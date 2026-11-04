// ChromaFlow's 128-cell advection/decay model, adapted from shaders 4.0.6.
// Shader Effects Inc., MIT; see docs/SHADERS_LICENSE.txt.
// Keep simulation state separate from the texture upload so motion can be checked.
export const FLOW_SIZE = 128;
export type FlowSource = { x: number; y: number; active: boolean };

export class PointerFlow {
  readonly pixels = new Uint8Array(FLOW_SIZE * FLOW_SIZE * 4);
  private field = new Float32Array(FLOW_SIZE * FLOW_SIZE * 3);
  private next = new Float32Array(this.field.length);
  private sources: { x: number; y: number; vx: number; vy: number }[] = [];
  private maximum = 0;

  update(dt: number, x: number, y: number, active: boolean, aspect: number) {
    return this.updateMany(dt, [{ x, y, active }], aspect);
  }

  // Source indices stay stable: one cursor and six independently moving buttons.
  updateMany(dt: number, sources: readonly FlowSource[], aspect: number) {
    dt = Math.min(dt, 0.016);
    if (dt <= 0) return false;
    const smoothing = 1 - Math.pow(0.85, dt / 0.016);
    const brushes = [];
    for (let i = 0; i < sources.length; i++) {
      const { x, y, active } = sources[i];
      const previous = this.sources[i] ?? { x, y, vx: 0, vy: 0 };
      const vx = active ? (x - previous.x) / dt : 0;
      const vy = active ? (y - previous.y) / dt : 0;
      previous.vx += (vx - previous.vx) * smoothing;
      previous.vy += (vy - previous.vy) * smoothing;
      previous.x = x;
      previous.y = y;
      this.sources[i] = previous;
      const speed = Math.hypot(previous.vx, previous.vy);
      const radius = 3.5 * 0.05 * Math.min(speed * speed * 20, 1);
      if (Math.abs(vx) + Math.abs(vy) > 0.01 && radius > 0) {
        brushes.push({ x, y, vx: previous.vx, vy: previous.vy, speed, radiusSquared: radius * radius });
      }
    }
    if (brushes.length === 0 && this.maximum < 0.0001) return false;

    const fade = 1 - dt;
    const flowSpeed = 13 * 50 * dt;
    let maximum = 0;
    for (let row = 0; row < FLOW_SIZE; row++) {
      for (let col = 0; col < FLOW_SIZE; col++) {
        const index = (row * FLOW_SIZE + col) * 3;
        const fx = this.field[index], fy = this.field[index + 1];
        let liquid = this.field[index + 2];
        const sampleX = col - fx * flowSpeed, sampleY = row - fy * flowSpeed;
        const x0 = Math.floor(sampleX), y0 = Math.floor(sampleY);
        if ((Math.abs(fx) > 0.001 || Math.abs(fy) > 0.001)
          && x0 >= 0 && y0 >= 0 && x0 + 1 < FLOW_SIZE && y0 + 1 < FLOW_SIZE) {
          const tx = sampleX - x0, ty = sampleY - y0;
          const sample = (dx: number, dy: number) => this.field[((y0 + dy) * FLOW_SIZE + x0 + dx) * 3 + 2];
          liquid = (sample(0, 0) * (1 - tx) + sample(1, 0) * tx) * (1 - ty)
            + (sample(0, 1) * (1 - tx) + sample(1, 1) * tx) * ty;
        }
        let nextX = fx * fade, nextY = fy * fade;
        liquid *= fade;
        for (const brush of brushes) {
          const dx = ((col + 0.5) / FLOW_SIZE - brush.x) * Math.max(1, aspect);
          const dy = ((row + 0.5) / FLOW_SIZE - brush.y) / Math.min(1, aspect);
          const distanceSquared = dx * dx + dy * dy;
          if (distanceSquared < 4 * brush.radiusSquared) {
            const influence = Math.exp(-distanceSquared / brush.radiusSquared) * dt;
            nextX += brush.vx * influence;
            nextY += brush.vy * influence;
            liquid += influence * Math.min(brush.speed * 10, 1);
          }
        }
        this.next[index] = Math.max(-1, Math.min(1, nextX));
        this.next[index + 1] = Math.max(-1, Math.min(1, nextY));
        this.next[index + 2] = Math.min(1, liquid);
        maximum = Math.max(maximum, Math.abs(nextX), Math.abs(nextY), liquid);
        const pixel = index / 3 * 4;
        // Encode low concentrations with extra precision; shader reverses the scale.
        this.pixels[pixel] = Math.round(Math.min(1, liquid * 8) * 255);
        this.pixels[pixel + 3] = 255;
      }
    }
    [this.field, this.next] = [this.next, this.field];
    this.maximum = maximum;
    return true;
  }
}
