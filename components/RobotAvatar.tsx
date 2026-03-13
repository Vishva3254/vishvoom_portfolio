'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Trail } from '@react-three/drei';
import * as THREE from 'three';

export default function RobotAvatar({ 
  isIntro, 
  onIntroComplete,
  isChatMode
}: { 
  isIntro: boolean;
  onIntroComplete: () => void;
  isChatMode: boolean;
}) {
  const group = useRef<THREE.Group>(null!);
  const { camera } = useThree();
  
  const [keys, setKeys] = useState<Record<string, boolean>>({});
  const velocity = useRef(new THREE.Vector3());
  const isJumping = useRef(false);
  const jumpVelocity = useRef(0);
  const gravity = -0.015;
  
  const elapsed = useRef(0);
  const introProgress = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => setKeys(prev => ({ ...prev, [e.code]: true }));
    const handleKeyUp = (e: KeyboardEvent) => setKeys(prev => ({ ...prev, [e.code]: false }));
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  useFrame((state, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;
    
    if (isIntro) {
      // Intro Animation: Rise from bottom and stay large
      introProgress.current = Math.min(introProgress.current + delta * 0.5, 1);
      
      // Position: Rise from y: -10 to y: 0
      const targetY = -10 + introProgress.current * 10;
      group.current.position.set(0, targetY, 20); // Close to camera
      group.current.scale.setScalar(5); // Large scale
      group.current.rotation.y = Math.sin(t) * 0.2; // Gentle sway
      
      return;
    }

    if (isChatMode) {
      // Move to center screen (like intro)
      group.current.position.lerp(new THREE.Vector3(0, 0, 20), 0.05);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, Math.sin(t) * 0.2, 0.05);
      group.current.scale.lerp(new THREE.Vector3(5, 5, 5), 0.05);
      return;
    }

    // Gameplay Transition: Shrink and move to world space
    group.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05);
    
    // Movement Logic
    const speed = 0.2;
    const direction = new THREE.Vector3();
    
    // Fixed camera direction for movement (no mouse look)
    const moveDir = new THREE.Vector3(0, 0, -1);
    const moveRight = new THREE.Vector3(1, 0, 0);

    if (keys['KeyW'] || keys['ArrowUp']) direction.add(moveDir);
    if (keys['KeyS'] || keys['ArrowDown']) direction.sub(moveDir);
    if (keys['KeyA'] || keys['ArrowLeft']) direction.sub(moveRight);
    if (keys['KeyD'] || keys['ArrowRight']) direction.add(moveRight);

    if (direction.length() > 0) {
      direction.normalize().multiplyScalar(speed);
      velocity.current.lerp(direction, 0.1);
      
      // Rotate robot to face movement direction
      const targetRotation = Math.atan2(direction.x, direction.z);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotation, 0.1);
    } else {
      velocity.current.lerp(new THREE.Vector3(), 0.1);
    }

    group.current.position.add(velocity.current);

    // Jump Logic
    if (keys['Space'] && !isJumping.current) {
      isJumping.current = true;
      jumpVelocity.current = 0.3;
    }

    if (isJumping.current) {
      group.current.position.y += jumpVelocity.current;
      jumpVelocity.current += gravity;

      if (group.current.position.y <= 0) {
        group.current.position.y = 0;
        isJumping.current = false;
        jumpVelocity.current = 0;
      }
    } else {
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, Math.sin(t * 2) * 0.1, 0.1);
    }
  });

  return (
    <group ref={group} name="robot">
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        {/* Astronaut Suit Body */}
        <mesh position={[0, 0.4, 0]}>
          <capsuleGeometry args={[0.4, 0.6, 8, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.2} emissive="#222222" />
        </mesh>

        {/* Helmet */}
        <group position={[0, 1.1, 0]}>
          <mesh>
            <sphereGeometry args={[0.45, 32, 32]} />
            <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.2} emissive="#222222" />
          </mesh>
          {/* Visor */}
          <mesh position={[0, 0, 0.1]}>
            <sphereGeometry args={[0.4, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
            <meshStandardMaterial color="#000000" metalness={1} roughness={0} />
          </mesh>
        </group>

        {/* Arms */}
        <mesh position={[0.5, 0.6, 0]} rotation={[0, 0, -0.2]}>
          <capsuleGeometry args={[0.12, 0.5, 4, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-0.5, 0.6, 0]} rotation={[0, 0, 0.2]}>
          <capsuleGeometry args={[0.12, 0.5, 4, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* Legs */}
        <mesh position={[0.2, -0.1, 0]}>
          <capsuleGeometry args={[0.15, 0.4, 4, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-0.2, -0.1, 0]}>
          <capsuleGeometry args={[0.15, 0.4, 4, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* Details (Purple/Teal Accents) */}
        <mesh position={[0, 0.5, 0.35]}>
          <boxGeometry args={[0.2, 0.3, 0.1]} />
          <meshStandardMaterial color="#8a2be2" /> {/* Purple chest plate */}
        </mesh>
        <mesh position={[0.1, 0.4, 0.4]} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.1, 8]} />
          <meshStandardMaterial color="#00ced1" /> {/* Teal button */}
        </mesh>
        <mesh position={[-0.1, 0.4, 0.4]} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.1, 8]} />
          <meshStandardMaterial color="#00ced1" /> {/* Teal button */}
        </mesh>

        {/* Backpack Tube */}
        <mesh position={[0, 1.2, -0.3]} rotation={[0.5, 0, 0]}>
          <torusGeometry args={[0.3, 0.05, 8, 24, Math.PI]} />
          <meshStandardMaterial color="#00ced1" />
        </mesh>

        {/* Thrusters */}
        <group position={[0, -0.4, 0]}>
          <Trail
            width={1.5}
            length={6}
            color={new THREE.Color('#00f2ff')}
            attenuation={(t) => t * t}
          >
            <mesh position={[0.2, 0, 0]}>
              <sphereGeometry args={[0.1]} />
              <meshBasicMaterial color="#00f2ff" />
            </mesh>
          </Trail>
          <Trail
            width={1.5}
            length={6}
            color={new THREE.Color('#00f2ff')}
            attenuation={(t) => t * t}
          >
            <mesh position={[-0.2, 0, 0]}>
              <sphereGeometry args={[0.1]} />
              <meshBasicMaterial color="#00f2ff" />
            </mesh>
          </Trail>
        </group>
      </Float>
    </group>
  );
}
