import { KeyboardControls, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Debug, Physics, RigidBody } from "@react-three/rapier";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Player from "./Player";
import Soilder from "./Soilder";

ReactDOM.createRoot(document.getElementById("root")).render(
  <KeyboardControls
    map={[
      { name: "forward", keys: ["ArrowUp", "w", "W"] },
      { name: "backward", keys: ["ArrowDown", "s", "S"] },
      { name: "left", keys: ["ArrowLeft", "a", "A"] },
      { name: "right", keys: ["ArrowRight", "d", "D"] },
      { name: "jump", keys: ["Space"] },
      { name: "shift", keys: ["Shift"] },
    ]}
  >
    <Canvas>
      <ambientLight />
      <OrbitControls />
      <Physics gravity={[0, -5, 0]}>
        <Debug />
        {/* <Soilder position={[0, 0, 0]} /> */}
        <Player />
        <RigidBody type="fixed">
          <mesh position={[0, 0, -10]}>
            <sphereGeometry />
            <meshBasicMaterial color="orange" />
          </mesh>
        </RigidBody>
        <RigidBody type="fixed" friction={0.3}>
          <mesh position={-1} rotation-x={-Math.PI * 0.5} scale={50}>
            <planeGeometry />
            <meshBasicMaterial color="green" />
          </mesh>
        </RigidBody>
      </Physics>
    </Canvas>
  </KeyboardControls>
);
