'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { PlanetData } from '@/data/portfolio';

// Helper to generate random positions
const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

export default function Planet({ data, onSelect, isSelected }: { data: PlanetData, onSelect: (id: string) => void, isSelected: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);

  const elapsed = useRef(0);

  useFrame((state, delta) => {
    elapsed.current += delta;
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
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
          {/* Main Island Base (Rock) */}
          <mesh position={[0, -0.8, 0]} scale={[2.5, 2, 2.5]} castShadow receiveShadow>
            <dodecahedronGeometry args={[1, 1]} />
            <meshStandardMaterial color={rockColor} roughness={0.9} flatShading />
          </mesh>
          
          {/* Secondary Rock for asymmetry */}
          <mesh position={[0.8, -0.4, 0.5]} scale={[1.8, 1.5, 1.8]} castShadow receiveShadow>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={rockColor} roughness={0.9} flatShading />
          </mesh>

          <mesh position={[-0.8, -0.6, -0.5]} scale={[2, 1.2, 2]} castShadow receiveShadow>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={rockColor} roughness={0.9} flatShading />
          </mesh>

          {/* Grass Top */}
          <mesh position={[0, 0.6, 0]} scale={[2.4, 0.4, 2.4]} castShadow receiveShadow>
            <cylinderGeometry args={[1, 1.1, 1, 8, 1]} />
            <meshStandardMaterial color={grassColor} roughness={1} flatShading />
          </mesh>

          {/* Crystals */}
          {crystals.map((c, i) => (
            <mesh key={`crystal-${i}`} position={c.position} rotation={c.rotation} scale={c.scale}>
              <cylinderGeometry args={[0.5, 0.5, 1, 6]} />
              <meshStandardMaterial 
                color={crystalColor} 
                emissive={crystalColor}
                emissiveIntensity={hovered || isSelected ? 1.5 : 0.8}
                transparent 
                opacity={0.85} 
                roughness={0.1}
                metalness={0.8}
                flatShading
              />
            </mesh>
          ))}

          {/* Trees */}
          {trees.map((t, i) => (
            <group key={`tree-${i}`} position={t.position} scale={t.scale}>
              {/* Trunk */}
              <mesh position={[0, 0.25, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 0.5, 5]} />
                <meshStandardMaterial color="#78350f" roughness={0.9} flatShading />
              </mesh>
              {/* Leaves */}
              <mesh position={[0, 0.8, 0]}>
                <coneGeometry args={[0.4, 1, 5]} />
                <meshStandardMaterial color="#166534" roughness={0.8} flatShading />
              </mesh>
            </group>
          ))}

          {/* Bottom Stalactites (Glowing) */}
          {stalactites.map((s, i) => (
            <mesh key={`stalactite-${i}`} position={s.position} rotation={s.rotation} scale={s.scale}>
              <cylinderGeometry args={[0, 0.5, 1, 5]} />
              <meshStandardMaterial 
                color={crystalColor} 
                emissive={crystalColor}
                emissiveIntensity={hovered || isSelected ? 1.2 : 0.6}
                transparent 
                opacity={0.8}
                flatShading
              />
            </mesh>
          ))}

          {/* Floating Particles/Bubbles */}
          <Sparkles 
            count={60} 
            scale={7} 
            size={4} 
            speed={0.4} 
            opacity={hovered || isSelected ? 1 : 0.6} 
            color={crystalColor} 
          />
          
          {/* Core Glow */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[2.5, 16, 16]} />
            <meshBasicMaterial color={crystalColor} transparent opacity={hovered || isSelected ? 0.15 : 0.05} />
          </mesh>
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
