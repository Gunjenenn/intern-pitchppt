'use client';
import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointMaterial, Points } from '@react-three/drei';
import * as THREE from 'three';
import { slides } from '@/data/slidesData';

/** Камерын шилжилтийн хурд (их = хурдан) */
const SPEED = 2;

function Rig({ index }: { index: number }) {
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3());
  const tp = useMemo(() => new THREE.Vector3(), []);
  const tl = useMemo(() => new THREE.Vector3(), []);
  useFrame((s, dt) => {
    const c = slides[index].cam, k = 1 - Math.exp(-dt * SPEED), l = c.look ?? [0, 0, 0];
    camera.position.lerp(tp.set(...c.pos), k);
    look.current.lerp(tl.set(l[0] + s.pointer.x, l[1] + s.pointer.y * 0.6, l[2]), k);
    camera.lookAt(look.current);
  });
  return null;
}

/** Алтан тоос — зөвхөн зөөлөн бөөмс, шугамгүй */
function Dust({ count, size, color, radius }: { count: number; size: number; color: string; radius: number }) {
  const ref = useRef<THREE.Points>(null!);
  const pos = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2 + Math.random() * radius, t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1);
      a.set([r * Math.sin(p) * Math.cos(t), r * Math.sin(p) * Math.sin(t) * 0.7, r * Math.cos(p)], i * 3);
    }
    return a;
  }, [count, radius]);
  useFrame((_, dt) => { ref.current.rotation.y += dt * 0.02; });
  return (
    <Points ref={ref} positions={pos} stride={3}>
      <PointMaterial transparent color={color} size={size} sizeAttenuation depthWrite={false} opacity={0.8} blending={THREE.AdditiveBlending} />
    </Points>
  );
}

export default function Scene({ index }: { index: number }) {
  return (
    <Canvas camera={{ position: [0, 0, 12], fov: 50 }} dpr={[1, 1.75]} gl={{ alpha: true, antialias: true }}>
      <Rig index={index} />
      <Dust count={1800} size={0.045} color="#D4AF37" radius={16} />
      <Dust count={120} size={0.16} color="#F3E2A0" radius={12} />
    </Canvas>
  );
}
