"use client";

import dynamic from "next/dynamic";

const PrismaBackground = dynamic(() => import("./prisma-background"), {
  ssr: false,
});

export function Background() {
  return (
    <div className="background" aria-hidden="true">
      <PrismaBackground />
    </div>
  );
}
