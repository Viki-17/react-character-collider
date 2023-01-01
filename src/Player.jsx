import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React from "react";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";

let walkDirection = new THREE.Vector3();
let rotateAngle = new THREE.Vector3(0, 1, 0);

const directionOffset = ({ forward, backward, left, right }) => {
  let directionOffset = 0;

  if (forward) {
    if (left) {
      directionOffset = Math.PI / 4;
    } else if (right) {
      directionOffset = -Math.PI / 4;
    }
  } else if (backward) {
    if (left) {
      directionOffset = Math.PI / 4 + Math.PI / 2;
    } else if (right) {
      directionOffset = -Math.PI / 4 - Math.PI / 2;
    } else {
      directionOffset = Math.PI;
    }
  } else if (left) {
    directionOffset = Math.PI / 2;
  } else if (right) {
    directionOffset = -Math.PI / 2;
  }
  return directionOffset;
};

const Player = () => {
  const model = useGLTF("src/assets/Soldier.glb");
  const [, get] = useKeyboardControls();
  const { forward, backward, left, right, jump, shift } = get();
  const { actions } = useAnimations(model.animations, model.scene);

  const currentAction = useRef("");
  const body = useRef();

  useFrame((state, delta) => {
    const { forward, backward, left, right, jump, shift } = get();
    let action = "";
    if (forward || backward || left || right) {
      action = "Walk";
      if (shift) {
        action = "Run";
      }
    } else {
      action = "Idle";
    }

    if (currentAction.current != action) {
      const nextActionToPlay = actions[action];
      const current = actions[currentAction.current];
      current?.fadeOut(0.2);
      nextActionToPlay?.reset().fadeIn(0.2).play();
      currentAction.current = action;
    }

    const impulse = { x: 0, y: 0, z: 0 };

    const impulseStrength = 10 * delta;
    if (forward) {
      impulse.z -= impulseStrength;
      if (shift) {
        impulse.z -= impulseStrength * 2;
      }
    }
    if (backward) {
      impulse.z += impulseStrength;
      if (shift) {
        impulse.z += impulseStrength * 2;
      }
    }
    if (right) {
      impulse.x += impulseStrength;
    }
    if (left) {
      impulse.x -= impulseStrength;
    }

    body.current.applyImpulse(impulse);

    const bodyPosition = body.current.translation();

    let newDirectionOffSet = directionOffset({
      forward,
      backward,
      left,
      right,
    });

    //burno camera position
    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(bodyPosition);
    cameraPosition.z += 2.25;
    cameraPosition.y += 2;

    //burno camera target
    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(bodyPosition);
    cameraTarget.y += 0.25;

    // locking camera at the target
    // state.camera.position.copy(cameraPosition);
    // state.camera.lookAt(cameraTarget);

    let angleYCameraDirection = Math.atan2(
      state.camera.position.x - model.scene.position.x,
      state.camera.position.z - model.scene.position.z
    );
    let rotateQuaternion = new THREE.Quaternion();
    rotateQuaternion.setFromAxisAngle(
      rotateAngle,
      angleYCameraDirection + newDirectionOffSet
    );
    model.scene.quaternion.rotateTowards(rotateQuaternion, 0.2);
  });

  return (
    <>
      <RigidBody
        ref={body}
        position={[0, 0, 0]}
        colliders={false}
        restitution={0.2}
        // friction={0.5}
        linearDamping={0.5}
      >
        <primitive object={model.scene} />
        <CuboidCollider args={[0.6, 1, 0.6]} position={[0, 1, 0]} />
      </RigidBody>
    </>
  );
};
export default Player;
