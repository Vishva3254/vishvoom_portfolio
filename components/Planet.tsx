'use client';

import { useRef, useState, useMemo, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Sparkles, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { PlanetData } from '@/data/portfolio';

// Helper to generate random positions
const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

function PlanetModel({ url, isSelected, hovered, color }: { url: string, isSelected: boolean, hovered: boolean, color: string }) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(), [scene]);
  
  // Ensure the planet casts and receives shadows for a realistic look
  useMemo(() => {
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [cloned]);

  return (
    <group>
      {/* Lights strategically placed around the planet to highlight its geography/crystals */}
      <pointLight position={[10, 15, 10]} color={color} intensity={250} distance={4000} decay={1.2} />
      <pointLight position={[-10, -15, -10]} color={color} intensity={150} distance={4000} decay={1.2} />
      
      <primitive object={cloned} position={[0, 0, 0]} scale={35} />
    </group>
  );
}

export default function Planet({ data, onSelect, isSelected }: { data: PlanetData, onSelect: (id: string) => void, isSelected: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);

  const elapsed = useRef(0);
  
  // Async rotation speed and initial offset
  const rotationSpeed = useMemo(() => 0.05 + Math.random() * 0.15, []);
  const initialRotation = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state, delta) => {
    elapsed.current += delta;
    if (groupRef.current) {
      groupRef.current.rotation.y = initialRotation + (elapsed.current * rotationSpeed);
      if (isSelected) {
        const t = elapsed.current;
        groupRef.current.position.y = data.position[1] + Math.sin(t) * 0.2;
      } else {
        groupRef.current.position.y = data.position[1];
      }
    }
  });

  // Generate random crystals
  const crystals = useMemo(() => {
    // Seeded random based on planet name length to keep it consistent but varied
    const seed = data.name.length;
    const seededRandom = (min: number, max: number, i: number) => {
      const x = Math.sin(seed + i) * 10000;
      return (x - Math.floor(x)) * (max - min) + min;
    };

    return Array.from({ length: 6 }).map((_, i) => ({
      position: [seededRandom(-1.2, 1.2, i*1), seededRandom(0.5, 2.5, i*2), seededRandom(-1.2, 1.2, i*3)] as [number, number, number],
      rotation: [seededRandom(-0.2, 0.2, i*4), seededRandom(0, Math.PI, i*5), seededRandom(-0.2, 0.2, i*6)] as [number, number, number],
      scale: [seededRandom(0.2, 0.6, i*7), seededRandom(1, 3.5, i*8), seededRandom(0.2, 0.6, i*9)] as [number, number, number],
    }));
  }, [data.name]);

  // Generate random trees
  const trees = useMemo(() => {
    const seed = data.name.length * 2;
    const seededRandom = (min: number, max: number, i: number) => {
      const x = Math.sin(seed + i) * 10000;
      return (x - Math.floor(x)) * (max - min) + min;
    };

    return Array.from({ length: 12 }).map((_, i) => ({
      position: [seededRandom(-1.8, 1.8, i*1), seededRandom(0.5, 1.2, i*2), seededRandom(-1.8, 1.8, i*3)] as [number, number, number],
      scale: seededRandom(0.3, 0.9, i*4),
    }));
  }, [data.name]);

  // Generate bottom stalactites
  const stalactites = useMemo(() => {
    const seed = data.name.length * 3;
    const seededRandom = (min: number, max: number, i: number) => {
      const x = Math.sin(seed + i) * 10000;
      return (x - Math.floor(x)) * (max - min) + min;
    };

    return Array.from({ length: 8 }).map((_, i) => ({
      position: [seededRandom(-1.5, 1.5, i*1), seededRandom(-1, -3, i*2), seededRandom(-1.5, 1.5, i*3)] as [number, number, number],
      rotation: [Math.PI, 0, 0] as [number, number, number],
      scale: [seededRandom(0.1, 0.4, i*4), seededRandom(0.5, 2.5, i*5), seededRandom(0.1, 0.4, i*6)] as [number, number, number],
    }));
  }, [data.name]);

  const baseColor = new THREE.Color(data.color);
  const crystalColor = baseColor.clone().offsetHSL(0, 0.3, 0.2);
  const grassColor = new THREE.Color('#4ade80').lerp(baseColor, 0.15);
  const rockColor = new THREE.Color('#4b5563').lerp(baseColor, 0.1);

  return (
    <group position={data.position} ref={groupRef}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
        <group
          onPointerOver={() => {
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = 'auto';
          }}
          onClick={() => onSelect(data.id)}
        >
          {/* Floating Particles around the completely replaced planet */}
          <Sparkles 
            count={60} 
            scale={7} 
            size={4} 
            speed={0.4} 
            opacity={hovered || isSelected ? 1 : 0.6} 
            color={crystalColor} 
          />

          {/* Planet 3D Model overlaid */}
          {data.modelPath && (
            <Suspense fallback={null}>
              <PlanetModel url={data.modelPath} isSelected={isSelected} hovered={hovered} color={data.color} />
            </Suspense>
          )}
        </group>
      </Float>

      <Text
        position={[0, 5, 0]}
        fontSize={0.8}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        {data.name}
      </Text>
    </group>
  );
}
