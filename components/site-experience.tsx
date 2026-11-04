"use client";

import { useEffect, useState } from "react";
import { GlassIntro, type ExperienceStage } from "./glass-intro";

export function SiteExperience() {
  const [pageReady, setPageReady] = useState(false);
  const [stage, setStage] = useState<ExperienceStage>("loading");

  useEffect(() => {
    let cancelled = false;
    const onLoad = () => {
      void document.fonts.ready.then(() => {
        if (!cancelled) setPageReady(true);
      });
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <div className="site-experience" data-stage={stage} aria-busy={stage !== "ready" && stage !== "waiting"}>
      <GlassIntro readyToExit={pageReady} onStageChange={setStage} />
    </div>
  );
}
