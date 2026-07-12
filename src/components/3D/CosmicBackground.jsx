import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Starfield({ count = 6000, radius = 260 }) {
  const pointsRef = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = radius * (0.4 + Math.random() * 0.6);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count, radius]);

  useFrame((_, delta) => {
    if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.002;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.6} color="#ffffff" sizeAttenuation transparent opacity={0.85} />
    </points>
  );
}

function FloatingDust({ count = 400 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 120;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 60;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 120;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.25} color="#8f7bff" transparent opacity={0.35} sizeAttenuation />
    </points>
  );
}

function ShootingStars({ count = 5 }) {
  const group = useRef();
  const streaks = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        start: new THREE.Vector3((Math.random() - 0.5) * 150, Math.random() * 40 + 10, (Math.random() - 0.5) * 150),
        speed: 30 + Math.random() * 40,
        delay: Math.random() * 10,
        active: false,
        progress: 0,
      })),
    [count]
  );
  const refs = useRef([]);

  useFrame((state, delta) => {
    streaks.forEach((s, i) => {
      s.progress += delta * (s.speed / 40);
      const mesh = refs.current[i];
      if (!mesh) return;
      if (s.progress > 12) {
        s.progress = -s.delay;
        s.start.set((Math.random() - 0.5) * 150, Math.random() * 40 + 10, (Math.random() - 0.5) * 150);
      }
      const t = Math.max(0, s.progress);
      mesh.position.set(s.start.x - t * 6, s.start.y - t * 3, s.start.z);
      mesh.visible = s.progress > 0 && s.progress < 3;
    });
  });

  return (
    <group ref={group}>
      {streaks.map((_, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshBasicMaterial color="#e9ecf6" />
        </mesh>
      ))}
    </group>
  );
}

export default function CosmicBackground() {
  return (
    <>
      <color attach="background" args={['#05070d']} />
      <fog attach="fog" args={['#05070d', 40, 220]} />
      <ambientLight intensity={0.15} />
      <Starfield />
      <FloatingDust />
      <ShootingStars />
    </>
  );
}
