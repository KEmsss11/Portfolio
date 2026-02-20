"use client"

import React, { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Text, PerspectiveCamera, OrbitControls, ContactShadows } from "@react-three/drei"
import * as THREE from "three"
import { motion } from "framer-motion"

const techStack = [
  { name: "PHP", color: "#777BB4", position: [-2, 1, 0] as [number, number, number], scale: 0.5 },
  { name: "MySQL", color: "#4479A1", position: [2, 1.5, -1] as [number, number, number], scale: 0.6 },
  { name: "Figma", color: "#F24E1E", position: [0, -1, 1] as [number, number, number], scale: 0.5 },
  { name: "Tailwind", color: "#38B2AC", position: [-2.5, -1.5, -0.5] as [number, number, number], scale: 0.4 },
  { name: "CSS", color: "#1572B6", position: [2.5, -1, 0.5] as [number, number, number], scale: 0.35 },
  { name: "HTML", color: "#E34F26", position: [-0.5, 2, -1.5] as [number, number, number], scale: 0.4 },
  { name: "JavaScript", color: "#F7DF1E", position: [1, -2, -0.5] as [number, number, number], scale: 0.45 },
]

function TechNode({ name, color, position, scale }: typeof techStack[0]) {
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.y = Math.sin(t / 2) / 4
    meshRef.current.position.y += Math.sin(t * 1.5 + position[0]) / 200
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={meshRef} position={position}>
        <mesh>
          <sphereGeometry args={[scale, 32, 32]} />
          <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} transparent opacity={0.2} />
        </mesh>
        <Text
          fontSize={scale * 0.5}
          color={color}
          anchorX="center"
          anchorY="middle"
          position={[0, 0, scale + 0.1]}
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff"
        >
          {name}
        </Text>
      </group>
    </Float>
  )
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      
      <group>
        {techStack.map((tech) => (
          <TechNode key={tech.name} {...tech} />
        ))}
      </group>

      <ContactShadows
        opacity={0.4}
        scale={15}
        blur={2.4}
        far={4.5}
        resolution={256}
        color="#000000"
      />
      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  )
}

export function Hero3D() {
  return (
    <section id="home" className="relative h-screen w-full overflow-hidden bg-background">
      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20 pointer-events-none">
         <div className="h-full w-full bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(#fff_1px,transparent_1px)]" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-full w-full">
           <Canvas className="cursor-grab active:cursor-grabbing">
             <Scene />
           </Canvas>
        </div>
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center pointer-events-none">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-secondary"
        >
          Modern Tech Stack Expertise
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="max-w-4xl text-5xl font-bold tracking-tight md:text-8xl"
        >
          Crafting the <br />
          <span className="text-secondary/50">Next Web</span>
        </motion.h1>

        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 1, delay: 1 }}
           className="mt-12 pointer-events-auto"
        >
          <a
            href="#projects"
            className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-background transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
          >
            See Innovations
          </a>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="h-10 w-[2px] bg-gradient-to-b from-primary to-transparent" />
      </motion.div>
    </section>
  )
}
