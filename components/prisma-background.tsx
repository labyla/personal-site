"use client";

import { ChromaFlow, FilmGrain, FlutedGlass, Shader, Swirl } from "shaders/react";

export default function PrismaBackground() {
  return (
    <Shader disableTelemetry style={{ width: "100%", height: "100%" }}>
      <Swirl colorA="#e8b0ff" colorB="#dba0f5" detail={1.7} />
      <ChromaFlow
        baseColor="#e8b0ff"
        downColor="#8950ff"
        leftColor="#8950ff"
        rightColor="#8950ff"
        upColor="#8950ff"
        momentum={13}
        radius={3.5}
      />
      <FlutedGlass
        aberration={0.61}
        angle={31}
        frequency={8}
        highlight={0.12}
        highlightSoftness={0}
        lightAngle={-90}
        refraction={4}
        shape="rounded"
        softness={1}
        speed={0.15}
      />
      <FilmGrain strength={0.05} />
    </Shader>
  );
}
