import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

export default function TexturedPlanet({ body, radius = 2, spin = 0.1 }) {
  const map = useLoader(THREE.TextureLoader, body.texture);
  const bump = body.bumpTexture ? useLoader(THREE.TextureLoader, body.bumpTexture) : null;
  const clouds = body.cloudTexture ? useLoader(THREE.TextureLoader, body.cloudTexture) : null;
  const ring = body.hasRings && body.ringTexture ? useLoader(THREE.TextureLoader, body.ringTexture) : null;

  const planetRef = useRef();
  const cloudsRef = useRef();

  useFrame((_, delta) => {
    if (planetRef.current) planetRef.current.rotation.y += delta * spin;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * spin * 1.3;
  });

  const tiltRad = ((body.axialTilt ?? 0) * Math.PI) / 180;

  return (
    <group rotation={[0, 0, tiltRad]}>
      <mesh ref={planetRef}>
        <sphereGeometry args={[radius, 96, 96]} />
        {body.isStar ? (
          <meshBasicMaterial map={map} />
        ) : (
          <meshStandardMaterial
            map={map}
            bumpMap={bump ?? undefined}
            bumpScale={0.04}
            roughness={0.9}
            metalness={0.05}
          />
        )}
      </mesh>

      {clouds && (
        <mesh ref={cloudsRef} scale={1.015}>
          <sphereGeometry args={[radius, 64, 64]} />
          <meshStandardMaterial map={clouds} transparent opacity={0.55} depthWrite={false} />
        </mesh>
      )}

      {/* soft atmosphere glow shell */}
      <mesh scale={1.08}>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshBasicMaterial color={body.color} transparent opacity={body.isStar ? 0.22 : 0.08} side={THREE.BackSide} />
      </mesh>

      {ring && (
        <mesh rotation={[Math.PI / 2 - 0.3, 0, 0]}>
          <ringGeometry args={[radius * 1.4, radius * 2.2, 128]} />
          <meshBasicMaterial map={ring} side={THREE.DoubleSide} transparent opacity={0.95} />
        </mesh>
      )}

      {body.isStar && <pointLight color="#ffe1a8" intensity={2.5} distance={250} decay={0.6} />}
    </group>
  );
}
