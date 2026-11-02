"use client";

import { useEffect, useRef } from "react";
import {
  CanvasTexture,
  DataTexture,
  LinearFilter,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";
import { FLOW_SIZE, PointerFlow } from "./pointer-flow";
import { createPanelMaterial } from "./panel-material";
import { encodeGlyphDistance } from "./glyph-distance";
import { STRIPE_COUNT, stripePosition } from "./stripe-motion";

import { ASSEMBLY_SECONDS, TRANSITION_FADE_SECONDS, transitionLight, LOADING_CYCLE_SECONDS, LOADING_MOTION_SECONDS, shouldFinishLoading } from "./loading-timeline";

export type ExperienceStage = "loading" | "assembling" | "fading" | "ready";

export function GlassIntro({ readyToExit, onStageChange }: {
  readyToExit: boolean; onStageChange: (stage: ExperienceStage) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(readyToExit);
  const stageRef = useRef(onStageChange);
  useEffect(() => { readyRef.current = readyToExit; stageRef.current = onStageChange; }, [readyToExit, onStageChange]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const renderer = new WebGLRenderer({ antialias: true });
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    host.appendChild(renderer.domElement);
    const scene = new Scene();
    const panelScene = new Scene();
    const flow = new PointerFlow();
    const flowTexture = new DataTexture(flow.pixels, FLOW_SIZE, FLOW_SIZE);
    flowTexture.minFilter = flowTexture.magFilter = LinearFilter;
    flowTexture.needsUpdate = true;
    const panelMaterial = createPanelMaterial(flowTexture);
    const panelTarget = new WebGLRenderTarget(1, 1, { depthBuffer: false, stencilBuffer: false });
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    const texture = new CanvasTexture(canvas);
    const maskRatio = 2;
    const surfaceCanvas = document.createElement("canvas");
    const surfaceContext = surfaceCanvas.getContext("2d")!;
    const surfaceTexture = new CanvasTexture(surfaceCanvas);
    for (const dataTexture of [texture, surfaceTexture]) {
      dataTexture.generateMipmaps = false;
      dataTexture.minFilter = dataTexture.magFilter = LinearFilter;
    }
    let glyphsReady = false;

    const drawWordmark = () => {
      const width = host.clientWidth, height = host.clientHeight;
      texture.dispose();
      canvas.width = Math.round(width * maskRatio);
      canvas.height = Math.round(height * maskRatio);
      context.setTransform(maskRatio, 0, 0, maskRatio, 0, 0);
      context.fillStyle = "#000000";
      context.fillRect(0, 0, width, height);
      const vertical = width < 640;
      context.font = '500 100px Arial';
      const metrics = context.measureText("labyla");
      const fontSize = vertical
        ? Math.min(width * 0.55, height * 0.6 / (6 * 1.15))
        : Math.min(
          width * 0.58 / metrics.width * 100,
          height * 0.26 / (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) * 100,
        );
      context.font = `500 ${fontSize}px Arial`;
      context.fillStyle = "#ffffff";
      context.strokeStyle = "#ffffff";
      context.lineJoin = "round";
      context.lineCap = "round";
      context.lineWidth = fontSize * 0.055;
      const draw = (text: string, centreY: number) => {
        const bounds = context.measureText(text);
        const x = width / 2 - (bounds.actualBoundingBoxRight - bounds.actualBoundingBoxLeft) / 2;
        const y = centreY + (bounds.actualBoundingBoxAscent - bounds.actualBoundingBoxDescent) / 2;
        context.strokeText(text, x, y);
        context.fillText(text, x, y);
      };
      if (vertical) {
        Array.from("labyla").forEach((letter, index) => {
          draw(letter, height / 2 + (index - 2.5) * fontSize * 1.15);
        });
      } else draw("labyla", height / 2);
      // Smooth both outer corners and inner joins before rebuilding the glass contour.
      const roundedMask = document.createElement("canvas");
      roundedMask.width = canvas.width;
      roundedMask.height = canvas.height;
      const roundedContext = roundedMask.getContext("2d")!;
      roundedContext.filter = "blur(" + fontSize * 0.012 * maskRatio + "px)";
      roundedContext.drawImage(canvas, 0, 0);
      const glyphs = roundedContext.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < glyphs.data.length; i += 4) {
        const t = Math.max(0, Math.min(1, (glyphs.data[i] / 255 - 0.45) / 0.1));
        glyphs.data[i] = Math.round(255 * t * t * (3 - 2 * t));
      }
      // A smooth height field has no normal-direction jump at a stroke's centre.
      roundedContext.putImageData(glyphs, 0, 0);
      surfaceTexture.dispose();
      surfaceCanvas.width = canvas.width;
      surfaceCanvas.height = canvas.height;
      surfaceContext.filter = "blur(" + fontSize * 0.045 * maskRatio + "px)";
      surfaceContext.drawImage(roundedMask, 0, 0);
      surfaceTexture.needsUpdate = true;
      encodeGlyphDistance(glyphs.data, canvas.width, canvas.height, maskRatio);
      context.putImageData(glyphs, 0, 0);
      texture.needsUpdate = true;
      glyphsReady = true;
    };

    const uniforms = {
      wordmark: { value: texture },
      surface: { value: surfaceTexture },
      resolution: { value: new Vector2(1, 1) },
      viewSize: { value: new Vector2(10, 7.3) },
      stripePositions: { value: new Float32Array(STRIPE_COUNT) },
      panelMode: { value: 0 },
      panels: { value: panelTarget.texture },
      wordmarkOpacity: { value: 1 },
    };
    const material = new ShaderMaterial({
      uniforms,
      vertexShader: `varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
      fragmentShader: `
        uniform sampler2D wordmark, surface, panels;
        uniform float panelMode, wordmarkOpacity;
        uniform vec2 resolution, viewSize;
        uniform float stripePositions[${STRIPE_COUNT}];
        varying vec2 vUv;

        float stripes(vec2 uv) {
          vec2 point = (uv - 0.5) * viewSize;
          float diagonal = point.x + point.y;
          float distanceToStripe = 1000.0;
          for (int i = 0; i < ${STRIPE_COUNT}; i++) {
            distanceToStripe = min(distanceToStripe, abs(diagonal - stripePositions[i]));
          }
          float softness = mix(0.0125, 0.1375, smoothstep(1.2, 7.0, abs(point.x - point.y)));
          float antialias = max(softness, fwidth(diagonal) * 0.75);
          return 1.0 - smoothstep(0.2375 - antialias, 0.2375 + antialias, distanceToStripe);
        }

        vec3 background(vec2 uv) {
          if (panelMode > 0.5) return texture2D(panels, uv).rgb;
          float along = dot((uv - 0.5) * viewSize, vec2(0.7071, -0.7071));
          float fade = smoothstep(-5.0, 5.0, along);
          vec3 tint = mix(vec3(0.0, 0.92, 0.95), vec3(0.005, 0.055, 0.10), fade);
          return mix(vec3(0.00243), tint, stripes(uv));
        }

        float glyphDistance(vec2 uv) {
          vec2 packed = texture2D(wordmark, uv).gb;
          return dot(packed, vec2(255.0, 255.0 / 256.0)) - 128.0;
        }

        void main() {
          vec2 p = vUv * resolution;
          vec2 contourStep = 0.75 / resolution;
          vec3 color = background(vUv);
          float distance = glyphDistance(vUv);
          // Keep shadow sampling continuous: an early return creates a visible
          // contour on Chrome's derivative-based shader execution.
          float d = distance;
          if (distance < 2.0) d = distance * 0.4
            + (glyphDistance(vUv + vec2(contourStep.x, 0.0))
            + glyphDistance(vUv - vec2(contourStep.x, 0.0))
            + glyphDistance(vUv + vec2(0.0, contourStep.y))
            + glyphDistance(vUv - vec2(0.0, contourStep.y))) * 0.15;

          // Bencho dark preset: Size 230, Bend 100, Fringe 40.
          float shadowDistance = glyphDistance(vUv + vec2(0.0, 9.0) / resolution);
          float shadow = (1.0 - smoothstep(-8.0, 26.0, shadowDistance)) * 0.3;
          if (d > 0.0) color *= 1.0 - shadow * wordmarkOpacity;
          if (d < 1.0) {
            vec2 e = 1.5 / resolution;
            vec2 slope = vec2(
              texture2D(surface, vUv + vec2(e.x, e.y)).r + 2.0 * texture2D(surface, vUv + vec2(e.x, 0.0)).r + texture2D(surface, vUv + vec2(e.x, -e.y)).r
                - texture2D(surface, vUv + vec2(-e.x, e.y)).r - 2.0 * texture2D(surface, vUv - vec2(e.x, 0.0)).r - texture2D(surface, vUv - e).r,
              texture2D(surface, vUv + vec2(e.x, e.y)).r + 2.0 * texture2D(surface, vUv + vec2(0.0, e.y)).r + texture2D(surface, vUv + vec2(-e.x, e.y)).r
                - texture2D(surface, vUv + vec2(e.x, -e.y)).r - 2.0 * texture2D(surface, vUv - vec2(0.0, e.y)).r - texture2D(surface, vUv - e).r
            ) / 4.0;
            vec2 normal = normalize(vec3(-slope * 8.0, 1.0)).xy;
            float radius = 230.0 / 2.0;
            float bevel = min(radius, max(22.0, radius * 0.36));
            float t = clamp(-d / bevel, 0.0, 1.0);
            float edge = pow(1.0 - t, 2.4);
            vec2 centre = resolution * 0.5;
            vec2 magnified = centre + (p - centre) / 1.1;
            vec2 offset = normal * edge * bevel * 1.1;
            vec2 q = (magnified + offset) / resolution;
            vec2 fringe = offset * 0.4 / resolution;
            vec3 glass = vec3(background(q + fringe).r, background(q).g, background(q - fringe).b);
            vec2 lightDirection = normalize(vec2(-0.55, 0.85));
            float rim = smoothstep(0.0, 1.6, -d) * (1.0 - smoothstep(1.6, 4.5, -d));
            float lit = max(dot(normal, lightDirection), 0.0);
            float far = max(dot(normal, -lightDirection), 0.0);
            float light = rim * (0.18 + 0.75 * lit) + rim * far * 0.22 + edge * 0.08;
            glass = clamp(glass * 1.08 + light, 0.0, 1.0);
            float coverage = texture2D(wordmark, vUv).r;
            color = mix(color, glass, coverage * wordmarkOpacity);
          }
          gl_FragColor = vec4(color, 1.0);
          // Match Bencho: its optical arithmetic outputs display RGB directly.
        }`,
      depthTest: false,
      depthWrite: false,
    });
    const geometry = new PlaneGeometry(2, 2);
    scene.add(new Mesh(geometry, material));
    panelScene.add(new Mesh(geometry, panelMaterial));
    let stripeTravel = 20;
    let width = 0, height = 0;
    let start: number | undefined;
    let previousElapsed = 0;
    let buildStart: number | undefined;
    let stage: ExperienceStage = "loading";
    let prepared = false;
    let pointerInside = false;
    let previousFrame: number | undefined;
    const changeStage = (next: ExperienceStage) => {
      stage = next;
      stageRef.current(next);
    };
    const resize = new ResizeObserver(() => {
      const nextWidth = host.clientWidth, nextHeight = host.clientHeight;
      if (nextWidth === width && nextHeight === height) return;
      width = nextWidth; height = nextHeight;
      const aspect = width / height;
      const viewHeight = Math.max(7.3, 5.8 / aspect);
      stripeTravel = viewHeight * (aspect + 1) / 2 + 7;
      uniforms.viewSize.value.set(viewHeight * aspect, viewHeight);
      uniforms.resolution.value.set(width, height);
      panelMaterial.uniforms.resolution.value.set(width, height);
      renderer.setSize(width, height);
      panelTarget.setSize(Math.round(width * pixelRatio), Math.round(height * pixelRatio));
      host.dataset.layout = width < 640 ? "vertical" : "horizontal";
      if (stage !== "ready") drawWordmark();
      prepared = false;
    });
    resize.observe(host);
    const move = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      panelMaterial.uniforms.pointer.value.set((event.clientX - rect.left) / rect.width, 1 - (event.clientY - rect.top) / rect.height);
      pointerInside = true;
    };
    const leave = () => { pointerInside = false; };
    host.addEventListener("pointerenter", move);
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    renderer.setAnimationLoop((now) => {
      if (!glyphsReady) return;
      if (!prepared) {
        // Upload textures and compile both paths before starting the visible clock.
        renderer.setRenderTarget(panelTarget);
        renderer.render(panelScene, camera);
        renderer.setRenderTarget(null);
        renderer.render(scene, camera);
        renderer.getContext().finish();
        prepared = true;
        return;
      }
      const dt = previousFrame === undefined ? 0 : (now - previousFrame) / 1000;
      previousFrame = now;
      if (start === undefined) start = now;
      const elapsed = (now - start) / 1000;
      if (stage === "loading" && shouldFinishLoading(previousElapsed, elapsed, readyRef.current)) {
        buildStart = now;
        changeStage("assembling");
      }
      if (buildStart !== undefined) {
        const buildTime = (now - buildStart) / 1000;
        const light = transitionLight(buildTime);
        panelMaterial.uniforms.buildTime.value = buildTime;
        panelMaterial.uniforms.assemblyLight.value = light;
        uniforms.panelMode.value = 1;
        uniforms.wordmarkOpacity.value = light;
        if (stage === "assembling" && buildTime >= ASSEMBLY_SECONDS) changeStage("fading");
        if (stage === "fading" && buildTime >= ASSEMBLY_SECONDS + TRANSITION_FADE_SECONDS) changeStage("ready");
      } else {
        const phase = (elapsed % LOADING_CYCLE_SECONDS) / LOADING_MOTION_SECONDS;
        for (let i = 0; i < STRIPE_COUNT; i++) {
          uniforms.stripePositions.value[i] = stripePosition(phase, i, stripeTravel, false);
        }
      }
      const pointer = panelMaterial.uniforms.pointer.value;
      if (flow.update(dt, pointer.x, pointer.y, stage === "ready" && pointerInside, width / height)) {
        flowTexture.needsUpdate = true;
      }
      panelMaterial.uniforms.time.value = elapsed;
      panelMaterial.uniforms.driftTime.value = buildStart === undefined ? 0
        : Math.max(0, (now - buildStart) / 1000 - ASSEMBLY_SECONDS - TRANSITION_FADE_SECONDS);
      if (stage === "ready") {
        renderer.render(panelScene, camera);
      } else {
        if (buildStart !== undefined) {
          renderer.setRenderTarget(panelTarget);
          renderer.render(panelScene, camera);
          renderer.setRenderTarget(null);
        }
        renderer.render(scene, camera);
      }
      previousElapsed = elapsed;
    });

    return () => {
      resize.disconnect();
      host.removeEventListener("pointerenter", move);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      renderer.setAnimationLoop(null);
      geometry.dispose();
      material.dispose();
      panelMaterial.dispose();
      panelTarget.dispose();
      flowTexture.dispose();
      texture.dispose();
      surfaceTexture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className="glass-intro" aria-hidden="true" />;
}
