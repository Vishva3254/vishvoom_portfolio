/* eslint-disable react-hooks/purity */
'use client';

import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, PointerLockControls } from '@react-three/drei';
import { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import Stars from './Stars';
import Planet from './Planet';
import RobotAvatar from './RobotAvatar';
import NeuralSignals from './NeuralSignals';
import { planets } from '@/data/portfolio';

function AsteroidField() {
  const count = 150;
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const asteroids = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      position: [
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 200
      ],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ],
      scale: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.005 + 0.001
    }));
  }, []);

  useFrame(() => {
    if (!mesh.current) return;
    
    asteroids.forEach((asteroid, i) => {
      asteroid.rotation[0] += asteroid.speed;
      asteroid.rotation[1] += asteroid.speed;
      
      dummy.position.set(asteroid.position[0], asteroid.position[1], asteroid.position[2]);
      dummy.rotation.set(asteroid.rotation[0], asteroid.rotation[1], asteroid.rotation[2]);
      dummy.scale.setScalar(asteroid.scale);
      dummy.updateMatrix();
      
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} castShadow receiveShadow>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#4b5563" roughness={0.8} metalness={0.2} flatShading />
    </instancedMesh>
  );
}

export default function UniverseCanvas({ 
  selectedPlanet, 
  onSelectPlanet,
  isStarted,
  isIntro,
  onIntroComplete,
  isChatOpen
}: { 
  selectedPlanet: string | null, 
  onSelectPlanet: (id: string | null) => void,
  isStarted: boolean,
  isIntro: boolean,
  onIntroComplete: () => void,
  isChatOpen?: boolean
}) {
  return (
    <div className="fixed inset-0 z-0 bg-black">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 20, 40]} fov={75} />
        
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 30, 150]} />
        
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#00f2ff" />
        <directionalLight position={[0, 10, 5]} intensity={2} />
        
        <Stars count={8000} />
        <AsteroidField />
        <NeuralSignals />
        
        {planets.map((p) => (
          <Planet 
            key={p.id} 
            data={p} 
            onSelect={onSelectPlanet} 
            isSelected={selectedPlanet === p.id} 
          />
        ))}
        
        <RobotAvatar 
          isIntro={isIntro} 
          onIntroComplete={onIntroComplete} 
          isChatMode={!!isChatOpen} 
          onSelectPlanet={onSelectPlanet}
        />
        
        <CameraHandler selectedPlanet={selectedPlanet} isIntro={isIntro} isChatOpen={isChatOpen} />
      </Canvas>
    </div>
  );
}

function CameraHandler({ selectedPlanet, isIntro, isChatOpen }: { selectedPlanet: string | null, isIntro: boolean, isChatOpen?: boolean }) {
  const { camera, scene } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 5, 10));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    const robot = scene.getObjectByName('robot');
    
    if (isIntro || isChatOpen) {
      // Fixed intro camera
      camera.position.lerp(new THREE.Vector3(0, 5, 40), 0.05);
      camera.lookAt(0, 5, 0);
      return;
    }

    if (selectedPlanet) {
      const planet = planets.find(p => p.id === selectedPlanet);
      if (planet) {
        targetPos.current.set(planet.position[0], planet.position[1] + 2, planet.position[2] + 10);
        targetLookAt.current.set(planet.position[0], planet.position[1], planet.position[2]);
        camera.position.lerp(targetPos.current, 0.05);
        camera.lookAt(targetLookAt.current);
      }
    } else if (robot) {
      // 3rd Person Camera Logic (Follows ship rotation)
      const offset = new THREE.Vector3(0, 4, 12); // Camera behind and slightly above
      offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), robot.rotation.y);
      const idealPosition = robot.position.clone().add(offset);
      
      camera.position.lerp(idealPosition, 0.08);
      
      // Look slightly ahead of the ship
      const lookAtOffset = new THREE.Vector3(0, 0, -10);
      lookAtOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), robot.rotation.y);
      const idealLookAt = robot.position.clone().add(lookAtOffset);
      
      targetLookAt.current.lerp(idealLookAt, 0.08);
      camera.lookAt(targetLookAt.current);
    }
  });

  return null;
}
