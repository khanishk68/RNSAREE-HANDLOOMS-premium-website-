"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, Suspense } from "react";
import * as THREE from "three";

function SilkCloth() {
  const mesh = useRef<THREE.Mesh>(null);
  const t = useRef(0);

  useFrame((_, delta) => {
    t.current += delta * 0.4;
    if (!mesh.current) return;
    const pos = mesh.current.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z =
        Math.sin(x * 2 + t.current) * 0.15 +
        Math.cos(y * 3 + t.current * 0.8) * 0.1;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
    mesh.current.rotation.y = Math.sin(t.current * 0.2) * 0.15;
  });

  return (
    <mesh ref={mesh} rotation={[-0.4, 0.2, 0.1]}>
      <planeGeometry args={[4.5, 3, 48, 48]} />
      <meshStandardMaterial
        color="#4a0e1f"
        metalness={0.55}
        roughness={0.35}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function SilkCanvas({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none ${className}`}>
      <Canvas camera={{ position: [0, 0, 3.2], fov: 45 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 2, 4]} intensity={1.2} color="#c9a962" />
        <directionalLight position={[-2, -1, 2]} intensity={0.4} color="#6b1a2e" />
        <Suspense fallback={null}>
          <SilkCloth />
        </Suspense>
      </Canvas>
    </div>
  );
}
