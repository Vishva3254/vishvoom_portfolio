'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { planets } from '@/data/portfolio';

export default function NeuralSignals() {
  const lines = useMemo(() => {
    const connections: THREE.Vector3[][] = [];
    // Connect home to others
    const home = new THREE.Vector3(...planets[0].position);
    for (let i = 1; i < planets.length; i++) {
      const target = new THREE.Vector3(...planets[i].position);
      
      // Create a curved path
      const mid = new THREE.Vector3().addVectors(home, target).multiplyScalar(0.5);
      mid.y += 5; // Add some curve
      
      const curve = new THREE.QuadraticBezierCurve3(home, mid, target);
      connections.push(curve.getPoints(50));
    }
    return connections;
  }, []);

  return (
    <group>
      {lines.map((points, i) => (
        <Line key={i} points={points} color={planets[i+1]?.color || '#ffffff'} />
      ))}
    </group>
  );
}

function Line({ points, color }: { points: THREE.Vector3[], color: string }) {
  const lineRef = useRef<any>(null!);
  
  const elapsed = useRef(0);
  
  useFrame((state, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;
    if (lineRef.current.material instanceof THREE.LineBasicMaterial) {
      lineRef.current.material.opacity = 0.2 + Math.sin(t * 2) * 0.1;
    }
  });

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  const line = useMemo(() => new THREE.Line(geometry), [geometry]);

  return (
    <primitive object={line} ref={lineRef}>
      <lineBasicMaterial color={color} transparent opacity={0.3} linewidth={1} />
    </primitive>
  );
}
