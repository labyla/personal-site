// Flute profile adapted from shaders 4.0.6 (MIT; docs/SHADERS_LICENSE.txt).
import { ShaderMaterial, type Texture, Vector2 } from "three";

export function createPanelMaterial(flowTexture: Texture) {
    const uniforms = {
      resolution: { value: new Vector2(1, 1) },
      buildTime: { value: -1 },
      pointer: { value: new Vector2(-10, -10) },
      flowField: { value: flowTexture },
      time: { value: 0 },
      driftTime: { value: 0 },
      assemblyLight: { value: 0 },
    };
    return new ShaderMaterial({
      uniforms,
      vertexShader: `varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec2 resolution;
        uniform float buildTime, assemblyLight, time, driftTime;
        uniform sampler2D flowField;
        float liquid(vec2 uv) {
          vec2 e = vec2(1.0 / 128.0);
          float density = texture2D(flowField, uv).r
            + texture2D(flowField, uv + vec2(e.x, 0.0)).r
            + texture2D(flowField, uv - vec2(e.x, 0.0)).r
            + texture2D(flowField, uv + vec2(0.0, e.y)).r
            + texture2D(flowField, uv - vec2(0.0, e.y)).r;
          return smoothstep(0.0, 0.035, density * 0.2 / 8.0);
        }
        void main() {
          vec2 size = vec2(resolution.x / resolution.y, 1.0) * 8.0;
          vec2 point = (vUv - 0.5) * size;
          vec2 normal = vec2(0.857167, -0.515038);
          vec2 tangent = vec2(0.515038, 0.857167);
          float extent = dot(size * 0.5, abs(normal));
          float pitch = extent * 2.0 / 12.0;
          float travel = length(size) * 1.5;
          vec3 color = vec3(0.00243);
          for (int i = -1; i < 13; i++) {
            float progress = clamp((buildTime - clamp(float(i), 0.0, 11.0) * 0.075) / 1.15, 0.0, 1.0);
            float excursion = pow(1.0 - progress, 3.0) * travel;
            vec2 local = point - vec2(-excursion, excursion);
            // Prisma FlutedGlass speed 0.15: one flute every 6.67s.
            float drift = 0.15 * (driftTime - 0.6 * (1.0 - exp(-driftTime / 0.6)));
            float centre = -extent - pitch + mod((float(i) + 1.5 + drift) * pitch, pitch * 14.0);
            float across = dot(local, normal) - centre;
            float aa = fwidth(across);
            float mask = 1.0 - smoothstep(pitch * 0.5 - aa, pitch * 0.5 + aa, abs(across));
            if (mask <= 0.0) continue;
            float profile = clamp(across / (pitch * 0.5), -1.0, 1.0);
            float rim = exp(-pow((abs(profile) - 0.97) / 0.035, 2.0));
            float bevel = pow(abs(profile), 5.0);
            // Rounded Prisma profile: softness 1 => exponent 3; refraction 4.
            float slope = profile * abs(profile) * abs(profile);
            vec2 offset = -normal * slope * pitch * 0.5 * 4.0;
            vec2 refracted = local + offset;
            vec2 uv = refracted / size + 0.5;
            vec2 fringe = offset / size * 0.61 * 0.5;
            vec3 flow = max(vec3(assemblyLight), vec3(liquid(uv + fringe), liquid(uv), liquid(uv - fringe)));
            float fade = smoothstep(-5.0, 5.0, dot(refracted, tangent));
            vec3 cyan = mix(vec3(0.0, 0.92, 0.95), vec3(0.005, 0.055, 0.10), fade);
            float moving = 1.0 - smoothstep(0.75, 1.0, progress);
            float swirl = 0.5 + 0.5 * sin(dot(refracted, tangent) * 1.7 + time * 0.18
              + sin(dot(refracted, normal) * 1.7 - time * 0.12));
            vec3 glass = vec3(0.004 + swirl * 0.004 + 0.008 * bevel + rim * 0.025);
            glass += vec3(0.03, 0.038, 0.045) * moving * (0.2 + bevel);
            glass += cyan * flow * (0.4 + bevel * 0.45 + rim * 0.35);
            color = mix(color, glass, mask);
          }
          gl_FragColor = vec4(color, 1.0);
        }`,
    });
}
