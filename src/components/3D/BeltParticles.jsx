import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function BeltParticles({ body, count = 260 }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const spread = body.isCloud ? 4.2 : 2.4;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 1.4 + Math.random() * spread;
      const h = (Math.random() - 0.5) * (body.isCloud ? spread : 0.6);
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = h;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    return arr;
  }, [count, body.isCloud]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.05;
  });

  return (
    <group ref={ref}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={body.isCloud ? 0.12 : 0.16} color={body.color} transparent opacity={0.85} sizeAttenuation />
      </points>
      <mesh>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshBasicMaterial color={body.color} transparent opacity={0.25} />
      </mesh>
    </group>
  );
}
