'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const generateStars = (count: number) => {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 400;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
    
    const color = new THREE.Color();
    color.setHSL(Math.random() * 0.2 + 0.5, 0.8, 0.8);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  
  return { positions, colors };
};

const STAR_DATA = generateStars(5000);

export default function Stars({ count = 5000 }) {
  const points = useRef<THREE.Points>(null!);
  
  // Using pre-generated data to avoid purity issues and cascading renders
  const { positions, colors } = STAR_DATA;

  const elapsed = useRef(0);

  useFrame((state, delta) => {
    elapsed.current += delta;
    if (points.current) {
      points.current.rotation.y = elapsed.current * 0.02;
      points.current.rotation.x = elapsed.current * 0.01;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
