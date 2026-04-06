'use client';

import { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Trail, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { planets } from '@/data/portfolio';

function RobotModel() {
  const { scene } = useGLTF('/elements/robot.glb');

  // The robot is scaled up slightly and Y position is re-centered.
  // Rotated PI/2 to align its native face model away from the camera during flight
  return <primitive object={scene} scale={2.2} position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} />;
}

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
  const boosterMesh = useRef<THREE.Mesh>(null!);
  
  const [keys, setKeys] = useState<Record<string, boolean>>({});
  const velocity = useRef(0);
  const maxSpeed = 1.0;
  const acceleration = 0.04;
  const deceleration = 0.01;
  const turnSpeed = 0.03;
  
  const currentRoll = useRef(0);
  const currentPitch = useRef(0);
  
  const elapsed = useRef(0);
  const introProgress = useRef(0);
  const isRecovering = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.code]: true }));
      
      // Handle Space to select nearest planet
      if (e.code === 'Space' && !isIntro && !isChatMode && onSelectPlanet && group.current) {
        let nearestPlanet = null;
        let minDistance = 45; // Maximum distance to interact - must be > COLLISION_RADIUS (20)
        
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
      group.current.rotation.y = Math.PI + Math.sin(t) * 0.2;
      isRecovering.current = true;
      return;
    }

    if (isChatMode) {
      group.current.position.lerp(new THREE.Vector3(0, 0, 20), 0.05);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, Math.PI + Math.sin(t) * 0.2, 0.05);
      group.current.scale.lerp(new THREE.Vector3(3, 3, 3), 0.05);
      isRecovering.current = true;
      
      // Reset pitch and roll
      if (shipMesh.current) {
        shipMesh.current.rotation.z = THREE.MathUtils.lerp(shipMesh.current.rotation.z, 0, 0.1);
        shipMesh.current.rotation.x = THREE.MathUtils.lerp(shipMesh.current.rotation.x, 0, 0.1);
      }
      return;
    }

    // Recover rotation to 0 after intro or chat mode
    if (isRecovering.current) {
      const diff = THREE.MathUtils.clamp(0 - group.current.rotation.y, -0.1, 0.1);
      group.current.rotation.y += diff;
      if (Math.abs(group.current.rotation.y) < 0.01) {
        group.current.rotation.y = 0;
        isRecovering.current = false;
      }
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
    
    const nextPosition = group.current.position.clone().add(direction.clone().multiplyScalar(velocity.current));
    let hasCollision = false;
    const COLLISION_RADIUS = 10; // Tight boundary to let robot fly cut-to-cut with the planet

    for (const p of planets) {
      const pPos = new THREE.Vector3(p.position[0], p.position[1], p.position[2]);
      const currentDist = group.current.position.distanceTo(pPos);
      const nextDist = nextPosition.distanceTo(pPos);
      
      // Block movement only if we are inside the boundary AND trying to move closer
      if (nextDist < COLLISION_RADIUS && nextDist < currentDist) {
        hasCollision = true;
        break;
      }
    }

    if (!hasCollision) {
      group.current.position.copy(nextPosition);
    } else {
      // Bounce effect
      velocity.current = -velocity.current * 0.5;
    }

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

    if (boosterMesh.current) {
      const thrust = THREE.MathUtils.clamp(velocity.current / maxSpeed, 0, 1.5);
      boosterMesh.current.scale.set(1, thrust, 1);
      (boosterMesh.current.material as THREE.MeshBasicMaterial).opacity = thrust * 0.8;
      // Flickering effect based on time
      boosterMesh.current.position.z = 1.5 + Math.random() * (thrust * 0.2);
    }
  });

  return (
    <group ref={group} name="robot">
      <group ref={shipMesh}>
        <Suspense fallback={null}>
          <RobotModel />
        </Suspense>
        
        {/* Dynamic Booster Flame attached to the back of the Robot */}
        <mesh ref={boosterMesh} position={[0, -0.6, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0, 0.4, 2, 16]} />
          <meshBasicMaterial color="#00f2ff" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}
