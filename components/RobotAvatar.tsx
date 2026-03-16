'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { planets } from '@/data/portfolio';

export default function RobotAvatar({ 
  isIntro, 
  onIntroComplete,
  isChatMode,
  onSelectPlanet
}: { 
  isIntro: boolean;
  onIntroComplete: () => void;
  isChatMode: boolean;
  onSelectPlanet?: (id: string | null) => void;
}) {
  const group = useRef<THREE.Group>(null!);
  const shipMesh = useRef<THREE.Group>(null!);
  
  const [keys, setKeys] = useState<Record<string, boolean>>({});
  const velocity = useRef(0);
  const maxSpeed = 0.6;
  const acceleration = 0.02;
  const deceleration = 0.01;
  const turnSpeed = 0.03;
  
  const currentRoll = useRef(0);
  const currentPitch = useRef(0);
  
  const elapsed = useRef(0);
  const introProgress = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.code]: true }));
      
      // Handle Space to select nearest planet
      if (e.code === 'Space' && !isIntro && !isChatMode && onSelectPlanet && group.current) {
        let nearestPlanet = null;
        let minDistance = 20; // Maximum distance to interact
        
        planets.forEach(p => {
          const pPos = new THREE.Vector3(...p.position);
          const dist = group.current.position.distanceTo(pPos);
          if (dist < minDistance) {
            minDistance = dist;
            nearestPlanet = p.id;
          }
        });
        
        if (nearestPlanet) {
          onSelectPlanet(nearestPlanet);
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => setKeys(prev => ({ ...prev, [e.code]: false }));
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isChatMode, isIntro, onSelectPlanet]);
  
  useFrame((state, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;
    
    if (isIntro) {
      introProgress.current = Math.min(introProgress.current + delta * 0.5, 1);
      const targetY = -10 + introProgress.current * 10;
      group.current.position.set(0, targetY, 20);
      group.current.scale.setScalar(3);
      group.current.rotation.y = Math.sin(t) * 0.2;
      return;
    }

    if (isChatMode) {
      group.current.position.lerp(new THREE.Vector3(0, 0, 20), 0.05);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, Math.sin(t) * 0.2, 0.05);
      group.current.scale.lerp(new THREE.Vector3(3, 3, 3), 0.05);
      
      // Reset pitch and roll
      if (shipMesh.current) {
        shipMesh.current.rotation.z = THREE.MathUtils.lerp(shipMesh.current.rotation.z, 0, 0.1);
        shipMesh.current.rotation.x = THREE.MathUtils.lerp(shipMesh.current.rotation.x, 0, 0.1);
      }
      return;
    }

    // Gameplay Transition
    group.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05);
    
    // Flight Logic
    let isAccelerating = false;
    let isReversing = false;
    let isTurningLeft = false;
    let isTurningRight = false;

    if (keys['KeyW'] || keys['ArrowUp']) isAccelerating = true;
    if (keys['KeyS'] || keys['ArrowDown']) isReversing = true;
    if (keys['KeyA'] || keys['ArrowLeft']) isTurningLeft = true;
    if (keys['KeyD'] || keys['ArrowRight']) isTurningRight = true;

    // Acceleration & Deceleration
    if (isAccelerating) {
      velocity.current = Math.min(velocity.current + acceleration, maxSpeed);
    } else if (isReversing) {
      velocity.current = Math.max(velocity.current - acceleration, -maxSpeed * 0.5);
    } else {
      if (velocity.current > 0) {
        velocity.current = Math.max(velocity.current - deceleration, 0);
      } else if (velocity.current < 0) {
        velocity.current = Math.min(velocity.current + deceleration, 0);
      }
    }

    // Turning (Yaw)
    if (isTurningLeft) {
      group.current.rotation.y += turnSpeed;
    }
    if (isTurningRight) {
      group.current.rotation.y -= turnSpeed;
    }

    // Apply movement along the current forward vector
    const direction = new THREE.Vector3(0, 0, -1);
    direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), group.current.rotation.y);
    group.current.position.add(direction.multiplyScalar(velocity.current));

    // Visual Banking (Roll) and Pitching
    let targetRoll = 0;
    let targetPitch = 0;

    if (isTurningLeft) targetRoll = Math.PI / 4; // Bank left
    if (isTurningRight) targetRoll = -Math.PI / 4; // Bank right
    
    if (isAccelerating) targetPitch = -Math.PI / 12; // Nose down when accelerating
    if (isReversing) targetPitch = Math.PI / 12; // Nose up when reversing

    currentRoll.current = THREE.MathUtils.lerp(currentRoll.current, targetRoll, 0.1);
    currentPitch.current = THREE.MathUtils.lerp(currentPitch.current, targetPitch, 0.1);

    if (shipMesh.current) {
      shipMesh.current.rotation.z = currentRoll.current;
      shipMesh.current.rotation.x = currentPitch.current;
      
      // Add a slight hover effect
      shipMesh.current.position.y = Math.sin(t * 2) * 0.2;
    }
  });

  return (
    <group ref={group} name="robot">
      <group ref={shipMesh}>
        {/* Main Hull */}
        <mesh position={[0, 0, 0]} castShadow>
          <coneGeometry args={[0.8, 3, 4]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.8} flatShading />
        </mesh>

        {/* Cockpit Glass */}
        <mesh position={[0, 0.3, 0.5]} rotation={[-0.2, 0, 0]}>
          <capsuleGeometry args={[0.3, 0.8, 4, 8]} />
          <meshStandardMaterial color="#00f2ff" roughness={0.1} metalness={1} transparent opacity={0.8} />
        </mesh>

        {/* Left Wing */}
        <mesh position={[-1.2, -0.2, 0.5]} rotation={[0, 0, -0.2]} castShadow>
          <boxGeometry args={[2, 0.1, 1.5]} />
          <meshStandardMaterial color="#222222" roughness={0.5} metalness={0.5} flatShading />
        </mesh>
        {/* Left Wing Tip */}
        <mesh position={[-2.2, 0.2, 0.5]} rotation={[0, 0, -0.5]} castShadow>
          <boxGeometry args={[0.1, 1, 1.5]} />
          <meshStandardMaterial color="#00f2ff" roughness={0.2} metalness={0.8} emissive="#00f2ff" emissiveIntensity={0.5} />
        </mesh>

        {/* Right Wing */}
        <mesh position={[1.2, -0.2, 0.5]} rotation={[0, 0, 0.2]} castShadow>
          <boxGeometry args={[2, 0.1, 1.5]} />
          <meshStandardMaterial color="#222222" roughness={0.5} metalness={0.5} flatShading />
        </mesh>
        {/* Right Wing Tip */}
        <mesh position={[2.2, 0.2, 0.5]} rotation={[0, 0, 0.5]} castShadow>
          <boxGeometry args={[0.1, 1, 1.5]} />
          <meshStandardMaterial color="#00f2ff" roughness={0.2} metalness={0.8} emissive="#00f2ff" emissiveIntensity={0.5} />
        </mesh>

        {/* Engine Thrusters */}
        <group position={[0, 0, 1.5]}>
          <mesh position={[-0.4, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.3, 0.5, 8]} />
            <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0.4, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.3, 0.5, 8]} />
            <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Engine Trails */}
          <Trail width={1.5} length={8} color={new THREE.Color('#00f2ff')} attenuation={(t) => t * t}>
            <mesh position={[-0.4, -0.2, 0.2]}>
              <sphereGeometry args={[0.15]} />
              <meshBasicMaterial color="#00f2ff" />
            </mesh>
          </Trail>
          <Trail width={1.5} length={8} color={new THREE.Color('#00f2ff')} attenuation={(t) => t * t}>
            <mesh position={[0.4, -0.2, 0.2]}>
              <sphereGeometry args={[0.15]} />
              <meshBasicMaterial color="#00f2ff" />
            </mesh>
          </Trail>
        </group>
      </group>
    </group>
  );
}
