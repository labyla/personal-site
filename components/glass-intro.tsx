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
  Vector4,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";
import { FLOW_SIZE, PointerFlow } from "./pointer-flow";
import { createPanelMaterial } from "./panel-material";
import { encodeGlyphDistance } from "./glyph-distance";
import { STRIPE_COUNT, stripePosition } from "./stripe-motion";

import { ASSEMBLY_SECONDS, MORPH_SECONDS, ballBounce, letterShape, entryVaporProgress, transitionLight, stepEnterHover, entryRevealProgress, ballLayout, letterBallPosition, SECTION_FLIGHT_SECONDS, SECTION_UNFOLD_SECONDS, TRANSITION_SECONDS, sectionLayout, sectionReveal, letterFlightProgress, letterFlightArrival, LOADING_CYCLE_SECONDS, LOADING_MOTION_SECONDS, shouldFinishLoading } from "./loading-timeline";

// Temporarily disabled; retain the original fluted background and assembly path.
const FLUTED_BACKGROUND_ENABLED = false;
const PANEL_TITLES = ["ABOUT ME", "PROJECTS", "EXPERIENCE", "BLOG", "CONTACT", "MORE"];

export type ExperienceStage = "loading" | "assembling" | "entering" | "waiting" | "melting" | "ready";

export function GlassIntro({ readyToExit, onStageChange }: {
  readyToExit: boolean; onStageChange: (stage: ExperienceStage) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const enterRef = useRef<HTMLButtonElement>(null);
  const accordionRef = useRef<HTMLElement>(null);
  const readyRef = useRef(readyToExit);
  const stageRef = useRef(onStageChange);
  useEffect(() => { readyRef.current = readyToExit; stageRef.current = onStageChange; }, [readyToExit, onStageChange]);

  useEffect(() => {
    const host = hostRef.current;
    const enterButton = enterRef.current;
    const accordion = accordionRef.current;
    if (!host || !enterButton || !accordion) return;
    const panelButtons = Array.from(accordion.querySelectorAll("button"));
    const panelMotion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const titleMeasure = document.createElement("canvas").getContext("2d")!;
    const titleWidths = new Float32Array(6);

    const renderer = new WebGLRenderer({ antialias: true });
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.prepend(renderer.domElement);
    const scene = new Scene();
    const panelScene = new Scene();
    const flow = new PointerFlow();
    const flowSources = Array.from({ length: 7 }, () => ({ x: 0, y: 0, active: false }));
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
    const enterCanvas = document.createElement("canvas");
    const enterContext = enterCanvas.getContext("2d")!;
    const enterTexture = new CanvasTexture(enterCanvas);
    // Five 320x480 reference photos, with bird repeated in the sixth atlas tile.
    const photoCanvas = document.createElement("canvas");
    photoCanvas.width = photoCanvas.height = 960;
    const photoContext = photoCanvas.getContext("2d")!;
    const photoTexture = new CanvasTexture(photoCanvas);
    photoTexture.generateMipmaps = false;
    photoTexture.minFilter = photoTexture.magFilter = LinearFilter;
    const panelHover = new Float32Array(6);
    for (const dataTexture of [texture, surfaceTexture, enterTexture]) {
      dataTexture.generateMipmaps = false;
      dataTexture.minFilter = dataTexture.magFilter = LinearFilter;
    }
    let glyphsReady = false;
    const glyphBounds = Array.from({ length: 6 }, () => new Vector4());
    const letterMotion = Array.from({ length: 6 }, () => new Vector4());
    const ballSquash = new Float32Array(6);
    const letterShapes = Array.from({ length: 6 }, () => new Vector4());
    const panelRects = Array.from({ length: 6 }, () => new Vector4());
    let activePanel: number | null = null;
    const sectionProgress = new Float32Array(6);
    const entryBounds = new Vector4();
    const enterBounds = new Vector4();
    const entryBox = new Vector4();
    const roundCoverage = (mask: ImageData) => {
      for (let i = 0; i < mask.data.length; i += 4) {
        const t = Math.max(0, Math.min(1, (mask.data[i] / 255 - 0.45) / 0.1));
        mask.data[i] = Math.round(255 * t * t * (3 - 2 * t));
      }
    };

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
      const wordBounds = context.measureText("labyla");
      const wordX = width / 2 - (wordBounds.actualBoundingBoxRight - wordBounds.actualBoundingBoxLeft) / 2;
      const baseline = height / 2 + (wordBounds.actualBoundingBoxAscent - wordBounds.actualBoundingBoxDescent) / 2;
      Array.from("labyla").forEach((letter, index) => {
        const bounds = context.measureText(letter);
        const x = vertical ? width / 2 - (bounds.actualBoundingBoxRight - bounds.actualBoundingBoxLeft) / 2
          : wordX + context.measureText("labyla".slice(0, index)).width;
        const y = vertical ? height / 2 + (index - 2.5) * fontSize * 1.15
          + (bounds.actualBoundingBoxAscent - bounds.actualBoundingBoxDescent) / 2 : baseline;
        const left = x - bounds.actualBoundingBoxLeft, right = x + bounds.actualBoundingBoxRight;
        const top = y - bounds.actualBoundingBoxAscent, bottom = y + bounds.actualBoundingBoxDescent;
        glyphBounds[index].set((left + right) / 2, height - (top + bottom) / 2,
          (right - left) / 2 + fontSize * 0.035, (bottom - top) / 2 + fontSize * 0.035);
      });
      const left = Math.min(...glyphBounds.map(b => b.x - b.z));
      const right = Math.max(...glyphBounds.map(b => b.x + b.z));
      const bottom = Math.min(...glyphBounds.map(b => b.y - b.w));
      const top = Math.max(...glyphBounds.map(b => b.y + b.w));
      const entry = { x: (left + right) / 2, y: (bottom + top) / 2, width: right - left, height: top - bottom };
      entryBounds.set(entry.x, entry.y, entry.width / 2, entry.height / 2);
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
      roundCoverage(glyphs);
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

      // A separate packed field draws ENTER behind the unchanged glass wordmark.
      enterTexture.dispose();
      enterCanvas.width = canvas.width;
      enterCanvas.height = canvas.height;
      enterContext.setTransform(maskRatio, 0, 0, maskRatio, 0, 0);
      enterContext.fillStyle = "#000000";
      enterContext.fillRect(0, 0, width, height);
      enterContext.font = '400 100px Roph';
      const enterMetrics = enterContext.measureText("ENTER");
      const enterFont = vertical ? fontSize : Math.min(
        entry.width / enterMetrics.width * 100,
        entry.height / (enterMetrics.actualBoundingBoxAscent + enterMetrics.actualBoundingBoxDescent) * 100,
      );
      enterContext.font = `400 ${enterFont}px Roph`;
      enterContext.fillStyle = enterContext.strokeStyle = "#ffffff";
      enterContext.lineJoin = "round";
      enterContext.lineWidth = enterFont * 0.055;
      let enterLeft = width, enterRight = 0, enterBottom = height, enterTop = 0;
      const drawEnter = (text: string, centreY: number) => {
        const m = enterContext.measureText(text);
        const x = width / 2 - (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2;
        const y = centreY + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
        enterContext.strokeText(text, x, y);
        enterContext.fillText(text, x, y);
        enterLeft = Math.min(enterLeft, x - m.actualBoundingBoxLeft - enterFont * 0.035);
        enterRight = Math.max(enterRight, x + m.actualBoundingBoxRight + enterFont * 0.035);
        enterBottom = Math.min(enterBottom, height - y - m.actualBoundingBoxDescent - enterFont * 0.035);
        enterTop = Math.max(enterTop, height - y + m.actualBoundingBoxAscent + enterFont * 0.035);
      };
      if (vertical) Array.from("ENTER").forEach((letter, i) => drawEnter(letter, height / 2 + (i - 2) * enterFont * 1.15));
      else drawEnter("ENTER", height / 2);
      // Rasterize vectors at their final display size instead of stretching the SDF.
      const sourceX = (enterLeft + enterRight) / 2;
      const sourceY = height - (enterBottom + enterTop) / 2;
      const scaleX = entry.width * 1.2 / (enterRight - enterLeft);
      const scaleY = entry.height * 1.12 / (enterTop - enterBottom);
      enterContext.fillStyle = "#000000";
      enterContext.fillRect(0, 0, width, height);
      enterContext.setTransform(maskRatio * scaleX, 0, 0, maskRatio * scaleY,
        (entry.x - sourceX * scaleX) * maskRatio,
        (height - entry.y - sourceY * scaleY) * maskRatio);
      enterContext.fillStyle = "#ffffff";
      if (vertical) Array.from("ENTER").forEach((letter, i) => drawEnter(letter, height / 2 + (i - 2) * enterFont * 1.15));
      else drawEnter("ENTER", height / 2);
      enterBounds.set(entry.x, entry.y, entry.width * 0.6, entry.height * 0.56);
      roundedContext.clearRect(0, 0, canvas.width, canvas.height);
      roundedContext.filter = `blur(${0.6 * maskRatio}px)`;
      roundedContext.drawImage(enterCanvas, 0, 0);
      const enterMask = roundedContext.getImageData(0, 0, canvas.width, canvas.height);
      encodeGlyphDistance(enterMask.data, canvas.width, canvas.height, maskRatio);
      enterContext.putImageData(enterMask, 0, 0);
      enterTexture.needsUpdate = true;
      glyphsReady = true;
    };

    const uniforms = {
      wordmark: { value: texture },
      enterWordmark: { value: enterTexture },
      surface: { value: surfaceTexture },
      resolution: { value: new Vector2(1, 1) },
      viewSize: { value: new Vector2(10, 7.3) },
      stripePositions: { value: new Float32Array(STRIPE_COUNT) },
      panelMode: { value: 0 },
      flutedBackgroundEnabled: { value: Number(FLUTED_BACKGROUND_ENABLED) },
      panels: { value: panelTarget.texture },
      morph: { value: 0 },
      entryProgress: { value: 0 },
      entryVapor: { value: 0 },
      enterSourceRect: { value: enterBounds },
      surfaceTime: { value: 0 },
      entryHover: { value: 0 },
      entryRect: { value: new Vector4() },
      entryScale: { value: new Vector2(1, 1) },
      glyphBounds: { value: glyphBounds },
      ballRadius: { value: 42 },
      letterMotion: { value: letterMotion },
      ballSquash: { value: ballSquash },
      letterShapes: { value: letterShapes },
      panelRects: { value: panelRects },
      sectionProgress: { value: sectionProgress },
      panelImages: { value: photoTexture },
      panelHover: { value: panelHover },
      panelMotion: { value: Number(panelMotion) },
      panelRadius: { value: 22 },
    };
    const material = new ShaderMaterial({
      uniforms,
      vertexShader: `varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
      fragmentShader: `
        uniform sampler2D wordmark, enterWordmark, surface, panels, panelImages;
        uniform float panelMode, morph, ballRadius, entryProgress, entryVapor, surfaceTime, entryHover;
        uniform float flutedBackgroundEnabled;
        uniform vec4 entryRect, enterSourceRect;
        uniform vec2 entryScale;
        uniform vec4 glyphBounds[6];
        uniform vec4 letterMotion[6];
        uniform float ballSquash[6];
        uniform vec4 letterShapes[6];
        uniform vec4 panelRects[6];
        uniform float sectionProgress[6];
        uniform float panelHover[6];
        uniform float panelMotion, panelRadius;
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

        vec3 rearEnter(vec2 uv, vec3 base) {
          if (entryProgress <= 0.0 || entryVapor >= 1.0) return base;
          vec2 p = uv * resolution;
          float vapor = entryVapor * entryVapor * (3.0 - 2.0 * entryVapor);
          vec2 local = p - entryRect.xy - vec2(sin(p.y * 0.03 + surfaceTime) * vapor * 5.0, vapor * 28.0);
          vec2 target = entryRect.zw * vec2(1.2, 1.12) * entryScale;
          vec2 source = enterSourceRect.xy + local / target * enterSourceRect.zw;
          vec2 sampleUv = source / resolution;
          vec2 stepUv = vec2(0.75) / resolution;
          vec4 mask = texture2D(enterWordmark, sampleUv);
          vec2 packed = mask.gb * 0.4
            + (texture2D(enterWordmark, sampleUv + vec2(stepUv.x, 0.0)).gb
            + texture2D(enterWordmark, sampleUv - vec2(stepUv.x, 0.0)).gb
            + texture2D(enterWordmark, sampleUv + vec2(0.0, stepUv.y)).gb
            + texture2D(enterWordmark, sampleUv - vec2(0.0, stepUv.y)).gb) * 0.15;
          float d = (dot(packed, vec2(255.0, 255.0 / 256.0)) - 128.0)
            * min(target.x / enterSourceRect.z, target.y / enterSourceRect.w);
          float softness = mix(1.0, 10.0, vapor);
          float coverage = mix(mask.r, 1.0 - smoothstep(-softness, softness, d), smoothstep(0.0, 0.2, vapor));
          float reveal = smoothstep(0.05, 1.0, entryProgress) * pow(1.0 - vapor, 2.0);
          float shimmer = 0.5 + 0.5 * sin(local.x / max(target.x, 1.0) * 2.5
            + local.y / max(target.y, 1.0) - surfaceTime * 0.75);
          vec3 tint = mix(vec3(0.005, 0.055, 0.10), vec3(0.0, 0.92, 0.95), shimmer);
          vec3 color = mix(base, tint * (0.55 + entryHover * 0.45), coverage * reveal);
          float glow = exp(-max(d, 0.0) / mix(8.0, 22.0, entryHover));
          float litContour = exp(-pow(d / 1.8, 2.0)) * smoothstep(0.25, 0.8, shimmer);
          vec3 contourLight = vec3(0.025, 0.28, 0.30) * litContour * (0.65 + entryHover * 0.35);
          return color + (vec3(0.015, 0.15, 0.17) * glow * (0.18 + entryHover * 1.8) + contourLight) * reveal;
        }

        vec3 background(vec2 uv) {
          if (panelMode > 0.5) {
            vec3 base = vec3(0.0);
            if (flutedBackgroundEnabled > 0.5) base = texture2D(panels, uv).rgb;
            return rearEnter(uv, base);
          }
          float along = dot((uv - 0.5) * viewSize, vec2(0.7071, -0.7071));
          float fade = smoothstep(-5.0, 5.0, along);
          vec3 tint = mix(vec3(0.0, 0.92, 0.95), vec3(0.005, 0.055, 0.10), fade);
          return mix(vec3(0.0), tint, stripes(uv));
        }

        float sourceDistance(vec2 uv) {
          vec2 packed = texture2D(wordmark, uv).gb;
          return dot(packed, vec2(255.0, 255.0 / 256.0)) - 128.0;
        }

        float roundBox(vec2 p, vec2 halfSize, float radius) {
          vec2 q = abs(p) - halfSize + radius;
          return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
        }

        vec3 panelPhoto(vec2 p, int index) {
          vec4 panel = panelRects[index];
          vec2 uv = (p - panel.xy) / (panel.zw * 2.0) + 0.5;
          float aspect = panel.z / panel.w;
          // Cover-fit the original 2:3 photographs without stretching them.
          if (aspect > 0.666667) uv.y = (uv.y - 0.5) * 0.666667 / aspect + 0.5;
          else uv.x = (uv.x - 0.5) * aspect / 0.666667 + 0.5;
          uv = (uv - 0.5) / (1.0 + panelHover[index] * 0.045 * panelMotion) + 0.5;
          uv = clamp(uv, vec2(0.5 / 320.0, 0.5 / 480.0), vec2(1.0 - 0.5 / 320.0, 1.0 - 0.5 / 480.0));
          vec2 tile = vec2(mod(float(index), 3.0), 1.0 - floor(float(index) / 3.0));
          return texture2D(panelImages, (tile + uv) / vec2(3.0, 2.0)).rgb;
        }

        vec2 ballLocal(vec2 p, int index) {
          vec2 centre = letterMotion[index].yz;
          vec2 local = p - centre;
          float squash = 1.0 - ballSquash[index] * 0.14;
          local *= vec2(1.0 / squash, squash);
          vec2 direction = vec2(cos(letterMotion[index].w), sin(letterMotion[index].w));
          float stretch = 1.0 + letterShapes[index].w;
          vec2 along = direction * dot(local, direction);
          return along / stretch + (local - along) * sqrt(stretch);
        }

        float glyphDistance(vec2 uv) {
          vec2 p = uv * resolution;
          if (morph <= 0.0) {
            return sourceDistance(uv);
          }
          float result = 10000.0;
          for (int i = 0; i < 6; i++) {
            vec4 bounds = glyphBounds[i];
            vec4 shape = letterShapes[i];
            float spread = sectionProgress[i];
            if (spread >= 1.0) {
              vec4 panel = panelRects[i];
              result = min(result, roundBox(p - panel.xy, panel.zw, min(panelRadius, min(panel.z, panel.w))));
              continue;
            }
            vec2 local = ballLocal(p, i) / shape.z;
            float sourceScale = mix(1.0, 0.55, shape.x);
            vec2 source = local / sourceScale;
            vec2 samplePoint = clamp(source, -bounds.zw, bounds.zw);
            float glyph = (sourceDistance((samplePoint + bounds.xy) / resolution) + length(source - samplePoint))
              * sourceScale;
            float radius = mix(ballRadius * 0.58, ballRadius * 0.7, shape.y);
            float drop = length(local) - radius;
            float sourceShape = mix(glyph, drop, shape.x) * shape.z;
            if (spread <= 0.0) {
              result = min(result, sourceShape);
            } else {
              vec4 panel = panelRects[i];
              vec2 panelLocal = p - panel.xy;
              // A rapid splash from the drop, then a slower liquid front and settling waves.
              float expansion = 1.0 - pow(1.0 - spread, 3.0);
              vec2 halfSize = mix(vec2(radius), panel.zw, expansion);
              float wave = sin(spread * 18.0 - length(panelLocal) * 0.035)
                * sin(atan(panelLocal.y, panelLocal.x) * 5.0 + spread * 9.0)
                * 7.0 * sin(spread * 3.141593) * (1.0 - spread);
              float liquidPanel = roundBox(panelLocal, halfSize, min(panelRadius, min(halfSize.x, halfSize.y))) + wave;
              result = min(result, liquidPanel);
            }
          }
          return result;
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

          float liquid = smoothstep(0.0, 0.7, entryProgress);
          float flying = smoothstep(0.0, 0.22, morph);
          float entrySurface = liquid * (1.0 - flying);
          color += vec3(0.009, 0.014, 0.015) * exp(-pow(max(d, 0.0) / 28.0, 2.0)) * liquid;
          // Bencho dark preset: Size 230, Bend 100, Fringe 40.
          float shadowDistance = glyphDistance(vUv + vec2(0.0, 9.0) / resolution);
          float shadow = (1.0 - smoothstep(-8.0, 26.0, shadowDistance)) * 0.3;
          if (d > 0.0) color *= 1.0 - shadow;
          if (d < 1.0) {
            vec2 e = 1.5 / resolution;
            vec2 slope = vec2(
              texture2D(surface, vUv + vec2(e.x, e.y)).r + 2.0 * texture2D(surface, vUv + vec2(e.x, 0.0)).r + texture2D(surface, vUv + vec2(e.x, -e.y)).r
                - texture2D(surface, vUv + vec2(-e.x, e.y)).r - 2.0 * texture2D(surface, vUv - vec2(e.x, 0.0)).r - texture2D(surface, vUv - e).r,
              texture2D(surface, vUv + vec2(e.x, e.y)).r + 2.0 * texture2D(surface, vUv + vec2(0.0, e.y)).r + texture2D(surface, vUv + vec2(-e.x, e.y)).r
                - texture2D(surface, vUv + vec2(e.x, -e.y)).r - 2.0 * texture2D(surface, vUv - vec2(0.0, e.y)).r - texture2D(surface, vUv - e).r
            ) / 4.0;
            if (entryProgress > 0.0) {
              vec2 gradient = vec2(glyphDistance(vUv + vec2(e.x, 0.0)) - glyphDistance(vUv - vec2(e.x, 0.0)),
                glyphDistance(vUv + vec2(0.0, e.y)) - glyphDistance(vUv - vec2(0.0, e.y))) / 3.0;
              slope = mix(slope, -gradient * 0.18 * exp(min(d, 0.0) / 16.0), liquid);
            }
            // Broad travelling ripples bend light through the clickable wordmark.
            vec2 wavePoint = (p - entryRect.xy) / max(entryRect.w, 1.0);
            float phase = wavePoint.x * 2.8 + wavePoint.y * 2.0 - surfaceTime * 0.75;
            float crossPhase = wavePoint.x * -1.7 + wavePoint.y * 2.8 - surfaceTime * 0.48;
            vec2 waveSlope = vec2(2.8, 2.0) * cos(phase) * 0.018
              + vec2(-1.7, 2.8) * cos(crossPhase) * 0.012;
            slope += waveSlope * entrySurface;
            vec2 normal = normalize(vec3(-slope * 8.0, 1.0)).xy;
            float radius = 230.0 / 2.0;
            float bevel = min(radius, max(22.0, radius * 0.36));
            float t = clamp(-d / bevel, 0.0, 1.0);
            float edge = pow(1.0 - t, 2.4);
            vec2 centre = mix(resolution * 0.5, p, liquid);
            vec2 magnified = centre + (p - centre) / 1.1;
            vec2 offset = normal * edge * bevel * 1.1;
            vec2 q = (magnified + offset) / resolution;
            vec2 fringe = offset * 0.4 / resolution;
            vec3 glass = vec3(background(q + fringe).r, background(q).g, background(q - fringe).b);
            vec2 frost = vec2(mix(2.2, 6.0, flying)) / resolution;
            vec3 blurred = (background(q + vec2(frost.x, 0.0)) + background(q - vec2(frost.x, 0.0))
              + background(q + vec2(0.0, frost.y)) + background(q - vec2(0.0, frost.y)) + glass * 2.0) / 6.0;
            glass = mix(glass, blurred, flying * 0.9);
            float waveLight = pow(0.5 + 0.5 * sin(phase), 3.0) * 0.65
              + pow(0.5 + 0.5 * sin(crossPhase), 3.0) * 0.35;
            glass += vec3(0.012, 0.038, 0.042) * waveLight * entrySurface;
            vec2 lightDirection = normalize(vec2(-0.55, 0.85));
            float rim = smoothstep(0.0, 1.6, -d) * (1.0 - smoothstep(1.6, 4.5, -d));
            float lit = max(dot(normal, lightDirection), 0.0);
            float far = max(dot(normal, -lightDirection), 0.0);
            float light = rim * (0.18 + 0.75 * lit) + rim * far * 0.22 + edge * 0.08;
            glass = clamp(glass * mix(1.08, 1.0, flying) + light * mix(vec3(1.0), vec3(0.035, 0.085, 0.09), flying)
              + vec3(0.020, 0.024, 0.026) * flying, 0.0, 1.0);
            for (int i = 0; i < 6; i++) {
              vec4 panel = panelRects[i];
              vec2 local = p - panel.xy;
              if (sectionProgress[i] > 0.0 && abs(local.x) <= panel.z && abs(local.y) <= panel.w) {
                float hover = clamp(panelHover[i], 0.0, 1.0);
                // The same two travelling surface waves used by the rear ENTER.
                vec2 photoPoint = local / max(min(panel.z, panel.w), 100.0);
                float photoPhase = photoPoint.x * 2.8 + photoPoint.y * 2.0 - surfaceTime * 0.75;
                float photoCrossPhase = photoPoint.x * -1.7 + photoPoint.y * 2.8 - surfaceTime * 0.48;
                vec2 photoSlope = vec2(2.8, 2.0) * cos(photoPhase) * 0.018
                  + vec2(-1.7, 2.8) * cos(photoCrossPhase) * 0.012;
                float bezel = min(17.0, min(panel.z, panel.w) * 0.20);
                float border = 1.0 - smoothstep(0.0, bezel, -d);
                vec3 photo = panelPhoto(p + photoSlope * hover * 65.0 * panelMotion + normal * border * 8.0, i);
                float luminance = dot(photo, vec3(0.2126, 0.7152, 0.0722));
                photo = mix(vec3(luminance), photo, mix(0.65, 0.98, hover)) * mix(0.46, 0.94, hover);
                float photoWaveLight = pow(0.5 + 0.5 * sin(photoPhase), 3.0) * 0.65
                  + pow(0.5 + 0.5 * sin(photoCrossPhase), 3.0) * 0.35;
                photo += vec3(0.012, 0.038, 0.042) * photoWaveLight * hover * panelMotion;
                float vertical = local.y / panel.w;
                float topShade = smoothstep(0.15, 1.0, vertical) * 0.38;
                float bottomShade = (1.0 - smoothstep(-1.0, -0.25, vertical)) * mix(0.88, 0.84, hover);
                photo *= 1.0 - max(topShade, bottomShade);
                // A broad refracting glass shoulder dissolves continuously into the photo.
                vec3 shoulder = mix(glass, photo, 0.2) + vec3(0.045, 0.075, 0.08)
                  * border * (0.4 + lit * 0.6);
                vec3 imagePanel = mix(shoulder, photo, smoothstep(1.5, bezel, -d));
                glass = mix(glass, imagePanel, smoothstep(0.02, 0.6, sectionProgress[i]));
              }
            }
            float aa = max(0.75, fwidth(distance) * 0.75);
            float coverage = entryProgress <= 0.0 ? texture2D(wordmark, vUv).r : 1.0 - smoothstep(-aa, aa, d);
            color = mix(color, glass, coverage);
          }
          float contourGlow = exp(-pow(d / 1.6, 2.0)) * 0.75
            + exp(-pow(d / 7.0, 2.0)) * 0.22;
          color += vec3(0.035, 0.085, 0.09) * contourGlow * entrySurface;
          for (int i = 0; i < 6; i++) {
            float reveal = smoothstep(0.85, 1.0, sectionProgress[i]);
            if (reveal > 0.0) {
              vec4 panel = panelRects[i];
              vec2 local = (p - panel.xy) / panel.zw;
              float panelDistance = roundBox(p - panel.xy, panel.zw, min(panelRadius, min(panel.z, panel.w)));
              float hover = clamp(panelHover[i], 0.0, 1.0);
              float shimmer = 0.5 + 0.5 * sin(local.x * 2.5 + local.y - surfaceTime * 0.75 * panelMotion + float(i) * 0.85);
              vec3 tint = mix(vec3(0.005, 0.055, 0.10), vec3(0.0, 0.92, 0.95), shimmer);
              float halo = exp(-abs(panelDistance) / mix(7.0, 24.0, hover));
              float contour = 1.0 - smoothstep(0.45, 1.3, abs(panelDistance));
              vec3 rimTint = mix(vec3(0.0, 0.35, 0.40), vec3(0.42, 1.0, 1.0), shimmer);
              color += (tint * halo * (0.018 + hover * 0.24)
                + rimTint * contour * (0.12 + hover * 0.80)) * reveal;
            }
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
    let splitStart: number | undefined;
    let enterRequested = false;
    let enterHovered = false;
    let hover = { value: 0, velocity: 0 };
    let stage: ExperienceStage = "loading";
    let prepared = false;
    let pointerInside = false;
    let previousFrame: number | undefined;
    const changeStage = (next: ExperienceStage) => {
      stage = next;
      host.dataset.stage = next;
      enterButton.disabled = next !== "waiting";
      enterButton.setAttribute("aria-hidden", String(next !== "waiting"));
      panelButtons.forEach((button) => {
        button.disabled = next !== "ready";
        button.setAttribute("aria-hidden", String(next !== "ready"));
      });
      accordion.setAttribute("aria-hidden", String(next !== "ready"));
      stageRef.current(next);
    };
    const requestEnter = () => {
      if (stage === "waiting" && !enterRequested) enterRequested = true;
    };
    const hoverEnter = () => { enterHovered = true; };
    const leaveEnter = () => { enterHovered = enterButton.matches(":focus-visible"); };
    const blurEnter = () => { enterHovered = enterButton.matches(":hover"); };
    enterButton.addEventListener("click", requestEnter);
    enterButton.addEventListener("pointerenter", hoverEnter);
    enterButton.addEventListener("pointerleave", leaveEnter);
    enterButton.addEventListener("focus", hoverEnter);
    enterButton.addEventListener("blur", blurEnter);
    const panelListeners = panelButtons.map((button, index) => {
      const select = () => { if (stage === "ready") activePanel = index; };
      const over = (event: PointerEvent) => { if (event.pointerType === "mouse") select(); };
      const blur = (event: FocusEvent) => {
        if (!accordion.contains(event.relatedTarget as Node | null)) activePanel = null;
      };
      const key = (event: KeyboardEvent) => {
        const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
        const backward = event.key === "ArrowLeft" || event.key === "ArrowUp";
        if (forward || backward) {
          event.preventDefault();
          panelButtons[(index + (forward ? 1 : 5)) % 6].focus();
        } else if (event.key === "Escape") {
          button.blur();
          activePanel = null;
        }
      };
      button.addEventListener("pointerenter", over);
      button.addEventListener("focus", select);
      button.addEventListener("click", select);
      button.addEventListener("blur", blur);
      button.addEventListener("keydown", key);
      return () => {
        button.removeEventListener("pointerenter", over);
        button.removeEventListener("focus", select);
        button.removeEventListener("click", select);
        button.removeEventListener("blur", blur);
        button.removeEventListener("keydown", key);
      };
    });
    const leaveAccordion = () => {
      if (!accordion.matches(":focus-within")) activePanel = null;
    };
    accordion.addEventListener("pointerleave", leaveAccordion);
    host.dataset.stage = "loading";
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
      uniforms.ballRadius.value = ballLayout(width).radius;
      const panelRadius = width >= 960 ? Math.min(28, Math.max(22, width * 0.017)) : 22;
      uniforms.panelRadius.value = panelRadius;
      accordion.style.setProperty("--panel-radius", `${panelRadius}px`);
      drawWordmark();
      prepared = false;
    });
    let disposed = false;
    const photos = ["bird", "cow", "house", "man", "queue"].map((name) => {
      const image = new Image();
      image.src = `/images/accordion/${name}.jpg`;
      return image.decode().then(() => image);
    });
    void Promise.all([document.fonts.load('400 100px Roph', "ENTER"), Promise.all(photos)]).then(([, images]) => {
      if (disposed) return;
      titleMeasure.font = "600 100px Arial";
      PANEL_TITLES.forEach((title, index) => {
        titleWidths[index] = Math.max(...title.split(" ").map((word) => titleMeasure.measureText(word).width));
      });
      [...images, images[0]].forEach((image, index) => {
        photoContext.drawImage(image, index % 3 * 320, Math.floor(index / 3) * 480, 320, 480);
      });
      photoTexture.needsUpdate = true;
      resize.observe(host);
    });
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
        // Upload textures and compile active paths before starting the visible clock.
        if (FLUTED_BACKGROUND_ENABLED) {
          renderer.setRenderTarget(panelTarget);
          renderer.render(panelScene, camera);
          renderer.setRenderTarget(null);
        }
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
        changeStage(FLUTED_BACKGROUND_ENABLED ? "assembling" : "entering");
      }
      if (buildStart !== undefined) {
        const buildTime = (now - buildStart) / 1000;
        if (stage === "assembling" && buildTime >= ASSEMBLY_SECONDS) changeStage("entering");
        uniforms.entryProgress.value = entryRevealProgress(buildTime, FLUTED_BACKGROUND_ENABLED);
        if (stage === "entering" && uniforms.entryProgress.value >= 1) changeStage("waiting");
        if (enterRequested && splitStart === undefined) {
          splitStart = now;
          changeStage("melting");
        }
        const sinceActivation = splitStart === undefined ? undefined : (now - splitStart) / 1000;
        uniforms.entryVapor.value = entryVaporProgress(sinceActivation);
        if (splitStart === undefined) {
          hover = stepEnterHover(hover.value, hover.velocity, stage === "waiting" && enterHovered, dt);
        }
        uniforms.entryHover.value = Math.max(0, Math.min(1, hover.value));
        const sx = 1 + hover.value * 0.045 + hover.velocity * 0.001;
        const sy = 1 + hover.value * 0.045 - hover.velocity * 0.001;
        uniforms.entryScale.value.set(sx, sy);
        entryBox.copy(entryBounds);
        uniforms.entryRect.value.copy(entryBox);
        enterButton.style.left = `${entryBox.x}px`;
        enterButton.style.top = `${height - entryBox.y}px`;
        enterButton.style.width = `${entryBox.z * 2 * 1.2}px`;
        enterButton.style.height = `${entryBox.w * 2 * 1.12}px`;
        enterButton.style.transform = `translate(-50%, -50%) scale(${sx}, ${sy})`;
        const sinceFlight = sinceActivation ?? 0;
        panelMaterial.uniforms.buildTime.value = buildTime;
        panelMaterial.uniforms.assemblyLight.value = transitionLight(buildTime);
        uniforms.panelMode.value = 1;
        uniforms.morph.value = Math.min(1, sinceFlight / MORPH_SECONDS);
        const easing = panelMotion ? 1 - Math.exp(-Math.min(dt, 0.1) * 7) : 1;
        const weights = Array.from(panelHover, (value, index) => {
          const target = Number(stage === "ready" && activePanel === index);
          panelHover[index] = value + (target - value) * easing;
          return 1 + panelHover[index] * 1.6;
        });
        const sections = sectionLayout(width, height, weights);
        for (let i = 0; i < 6; i++) {
          const rect = sections[i];
          panelRects[i].set(rect.x, rect.y, rect.width / 2, rect.height / 2);
          const button = panelButtons[i];
          button.style.left = `${rect.x - rect.width / 2}px`;
          button.style.top = `${height - rect.y - rect.height / 2}px`;
          button.style.width = `${rect.width}px`;
          button.style.height = `${rect.height}px`;
          button.setAttribute("aria-expanded", String(activePanel === i));
          const open = panelHover[i];
          const padding = width >= 960 ? Math.min(36, Math.max(18, width * 0.0215)) : 18;
          const idleTitleSize = width >= 960 ? Math.min(32, width * 0.019) : 17;
          const activeTitleSize = width >= 960 ? Math.min(64, rect.width * 0.125) : 32;
          const bodyInset = padding;
          const availableTitleWidth = rect.width - (width >= 960 ? bodyInset * 2 : 64);
          const titleSize = Math.min(idleTitleSize + (activeTitleSize - idleTitleSize) * open,
            availableTitleWidth / titleWidths[i] * 100);
          button.style.setProperty("--panel-open", String(open));
          button.style.setProperty("--panel-padding", `${padding}px`);
          button.style.setProperty("--body-inset", `${bodyInset}px`);
          button.style.setProperty("--title-size", `${titleSize}px`);
          sectionProgress[i] = splitStart === undefined ? 0 : sectionReveal(sinceFlight, i);
        }
        for (let i = 0; i < 6; i++) {
          const progress = letterFlightProgress(sinceFlight, i);
          const arrival = letterFlightArrival(i);
          const sinceArrival = sinceFlight - arrival - SECTION_UNFOLD_SECONDS;
          ballSquash[i] = ballBounce(sinceArrival);
          const shape = letterShape(progress, sinceArrival);
          const bounds = glyphBounds[i];
          const x = bounds.x;
          const y = bounds.y;
          const position = letterBallPosition(progress, i, x, y, width, height);
          const before = letterBallPosition(Math.max(0, progress - 0.001), i, x, y, width, height);
          const after = letterBallPosition(Math.min(1, progress + 0.001), i, x, y, width, height);
          const speed = Math.hypot(after.x - before.x, after.y - before.y)
            / (0.002 * SECTION_FLIGHT_SECONDS * Math.max(width, height));
          letterShapes[i].set(shape.gather, shape.open, shape.size, Math.min(0.24, speed * 0.16));
          letterMotion[i].set(progress, position.x, position.y, Math.atan2(after.y - before.y, after.x - before.x));
          flowSources[i + 1].x = position.x / width;
          flowSources[i + 1].y = position.y / height;
          flowSources[i + 1].active = splitStart !== undefined && progress > 0 && progress < 1;
        }
        if (stage === "melting" && sinceFlight >= TRANSITION_SECONDS) changeStage("ready");
      } else {
        const phase = (elapsed % LOADING_CYCLE_SECONDS) / LOADING_MOTION_SECONDS;
        for (let i = 0; i < STRIPE_COUNT; i++) {
          uniforms.stripePositions.value[i] = stripePosition(phase, i, stripeTravel, false);
        }
      }
      const pointer = panelMaterial.uniforms.pointer.value;
      flowSources[0].x = pointer.x;
      flowSources[0].y = pointer.y;
      flowSources[0].active = stage === "ready" && pointerInside;
      if (FLUTED_BACKGROUND_ENABLED && flow.updateMany(dt, flowSources, width / height)) {
        flowTexture.needsUpdate = true;
      }
      uniforms.surfaceTime.value = elapsed;
      panelMaterial.uniforms.time.value = elapsed;
      panelMaterial.uniforms.driftTime.value = splitStart === undefined ? 0
        : Math.max(0, (now - splitStart) / 1000 - TRANSITION_SECONDS);
      if (FLUTED_BACKGROUND_ENABLED && buildStart !== undefined) {
        renderer.setRenderTarget(panelTarget);
        renderer.render(panelScene, camera);
        renderer.setRenderTarget(null);
      }
      renderer.render(scene, camera);
      previousElapsed = elapsed;
    });

    return () => {
      disposed = true;
      resize.disconnect();
      panelListeners.forEach((remove) => remove());
      accordion.removeEventListener("pointerleave", leaveAccordion);
      enterButton.removeEventListener("click", requestEnter);
      enterButton.removeEventListener("pointerenter", hoverEnter);
      enterButton.removeEventListener("pointerleave", leaveEnter);
      enterButton.removeEventListener("focus", hoverEnter);
      enterButton.removeEventListener("blur", blurEnter);
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
      enterTexture.dispose();
      surfaceTexture.dispose();
      photoTexture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className="glass-intro">
    <main ref={accordionRef} className="accordion-controls" aria-label="Основной контент" aria-hidden="true">
      {PANEL_TITLES.map((title, index) => (
        <button key={index} className="accordion-panel" type="button" disabled aria-hidden="true"
          aria-label={`${String(index + 1).padStart(2, "0")} — ${title}`} aria-expanded="false">
          <span className="panel-chrome" aria-hidden="true">
            <span className="panel-number">{String(index + 1).padStart(2, "0")}</span>
            <svg className="panel-arrow" viewBox="0 0 28 28" fill="none">
              <path d="M6 22 22 6M7 6h15v15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
            </svg>
            <span className="panel-body">
              <span className="panel-title">{title}</span>
              <span className="panel-rule" />
            </span>
          </span>
        </button>
      ))}
    </main>
    <button ref={enterRef} className="enter-button" type="button" disabled aria-hidden="true" aria-label="Enter site" />
  </div>;
}
