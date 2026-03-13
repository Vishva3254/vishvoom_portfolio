'use client';

import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, PointerLockControls } from '@react-three/drei';
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import Stars from './Stars';
import Planet from './Planet';
import RobotAvatar from './RobotAvatar';
import NeuralSignals from './NeuralSignals';
import { planets } from '@/data/portfolio';

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
        
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#00f2ff" />
        <directionalLight position={[0, 10, 5]} intensity={2} />
        
        <Stars count={8000} />
        <NeuralSignals />
        
        {planets.map((p) => (
          <Planet 
            key={p.id} 
            data={p} 
            onSelect={onSelectPlanet} 
            isSelected={selectedPlanet === p.id} 
          />
        ))}
        
        <RobotAvatar isIntro={isIntro} onIntroComplete={onIntroComplete} isChatMode={!!isChatOpen} />
        
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
      // Fixed 3rd Person Camera Logic (No mouse rotation)
      const offset = new THREE.Vector3(0, 15, 30);
      const idealPosition = robot.position.clone().add(offset);
      
      camera.position.lerp(idealPosition, 0.05);
      camera.lookAt(robot.position);
    }
  });

  return null;
}
