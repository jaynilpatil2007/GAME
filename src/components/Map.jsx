import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect } from "react";
import * as THREE from "three";

// Define spawn positions here if your map doesn't have spawn points
// Adjust these coordinates based on your map layout
const SPAWN_POSITIONS = [
  { x: 0, y: 1, z: 0 },
  { x: 5, y: 1, z: 5 },
  { x: -5, y: 1, z: 5 },
  { x: 5, y: 1, z: -5 },
  { x: -5, y: 1, z: -5 },
];

export const Map = () => {
  const map = useGLTF("models/map.glb");
  useEffect(() => {
    map.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    // Check if spawn points exist in the map
    const hasSpawnPoints = map.scene.getObjectByName("spawn_0") !== undefined;
    
    // If no spawn points found, create them programmatically
    if (!hasSpawnPoints) {
      console.log("No spawn points found in map, creating default spawn points");
      SPAWN_POSITIONS.forEach((pos, index) => {
        const spawnPoint = new THREE.Object3D();
        spawnPoint.name = `spawn_${index}`;
        spawnPoint.position.set(pos.x, pos.y, pos.z);
        map.scene.add(spawnPoint);
      });
    }
  }, [map.scene]);
  
  return (
    <>
      <RigidBody colliders="trimesh" type="fixed">
        <primitive object={map.scene} />
      </RigidBody>
    </>
  );
};
useGLTF.preload("models/map.glb");
