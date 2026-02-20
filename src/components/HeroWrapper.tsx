"use client"

import dynamic from "next/dynamic"

const Hero3D = dynamic(() => import("./Hero3D").then((mod) => mod.Hero3D), {
  ssr: false,
  loading: () => <div className="h-screen w-full bg-background" />,
})

export function HeroWrapper() {
  return <Hero3D />
}
