'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera, Float } from '@react-three/drei'
import * as THREE from 'three'

interface LuxuryCarModelProps {
  carModel: string
}

export default function LuxuryCarModel({ carModel }: LuxuryCarModelProps) {
  const carRef = useRef<THREE.Group>(null)
  const { camera } = useThree()

  // Rotate car slowly
  useFrame((state, delta) => {
    if (carRef.current) {
      carRef.current.rotation.y += delta * 0.1
    }
  })

  // For demo purposes, we'll use a placeholder geometry
  // In production, you would load actual 3D models using useGLTF
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        castShadow
      />

      {/* Environment for reflections */}
      <Environment preset="city" />

      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2}
        autoRotate
        autoRotateSpeed={0.5}
      />

      {/* Car model placeholder */}
      <Float
        speed={2}
        rotationIntensity={0.1}
        floatIntensity={0.2}
      >
        <group ref={carRef} position={[0, -1, 0]}>
          {/* Main body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[4, 1, 2]} />
            <meshStandardMaterial
              color="#1a1a1a"
              metalness={0.9}
              roughness={0.1}
              envMapIntensity={2}
            />
          </mesh>
          
          {/* Roof */}
          <mesh position={[0, 0.7, 0]} castShadow>
            <boxGeometry args={[2.5, 0.4, 1.5]} />
            <meshStandardMaterial
              color="#0a0a0a"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          
          {/* Wheels */}
          {[
            [-1.5, -0.5, 1],
            [1.5, -0.5, 1],
            [-1.5, -0.5, -1],
            [1.5, -0.5, -1],
          ].map((position, i) => (
            <mesh key={i} position={position as [number, number, number]} castShadow>
              <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
              <meshStandardMaterial
                color="#0a0a0a"
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>
          ))}
          
          {/* Headlights */}
          {[[-1.5, 0, 1], [1.5, 0, 1]].map((position, i) => (
            <mesh key={i} position={position as [number, number, number]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={2}
              />
            </mesh>
          ))}
          
          {/* Ground shadow */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial
              color="#000000"
              transparent
              opacity={0.3}
            />
          </mesh>
        </group>
      </Float>

      {/* Fog for atmosphere */}
      <fog attach="fog" args={['#000000', 10, 30]} />
    </>
  )
}
