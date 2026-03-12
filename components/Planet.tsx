'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { PlanetData } from '@/data/portfolio';

export default function Planet({ data, onSelect, isSelected }: { data: PlanetData, onSelect: (id: string) => void, isSelected: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  const elapsed = useRef(0);

  useFrame((state, delta) => {
    elapsed.current += delta;
    meshRef.current.rotation.y += 0.005;
    if (isSelected) {
      const t = elapsed.current;
      meshRef.current.position.y = data.position[1] + Math.sin(t) * 0.2;
    }
  });

  return (
    <group position={data.position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => onSelect(data.id)}
        >
          {data.type === 'wormhole' ? (
            <torusGeometry args={[3, 0.5, 16, 100]} />
          ) : data.type === 'station' ? (
            <octahedronGeometry args={[2.5]} />
          ) : (
            <sphereGeometry args={[2, 32, 32]} />
          )}
          
          <MeshDistortMaterial
            color={data.color}
            speed={hovered || isSelected ? 4 : 1}
            distort={0.3}
            radius={1}
            emissive={data.color}
            emissiveIntensity={hovered || isSelected ? 2 : 0.5}
          />
        </mesh>
      </Float>

      <Text
        position={[0, 4, 0]}
        fontSize={0.8}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {data.name}
      </Text>

      {/* Glow effect */}
      <Sphere args={[2.2, 32, 32]}>
        <meshBasicMaterial color={data.color} transparent opacity={0.1} />
      </Sphere>
    </group>
  );
}
