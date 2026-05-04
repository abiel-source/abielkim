"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  useGLTF,
  useAnimations,
  OrbitControls,
  Preload,
  Center,
} from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

useGLTF.preload("/robot.glb");

const IDLE = "RobotArmature|Robot_Idle";

const INTRO = [
  {
    anim: "RobotArmature|Robot_Wave",
    message:
      "1/3 Hello human! I'm Zetatron — Abiel's robot assistant. Welcome to my page!",
  },
  {
    anim: "RobotArmature|Robot_Jump",
    message:
      "2/3 Got questions about my human? Access our chat at the bottom right!",
  },
  {
    anim: "RobotArmature|Robot_Dance",
    message:
      "3/3 Or... just hang out with me! Click and spin me around for some dance moves",
  },
];

const REACTIONS = [
  { anim: "RobotArmature|Robot_Wave", message: "Hey there! 👋" },
  { anim: "RobotArmature|Robot_Dance", message: "Let's get it! 🕺" },
  { anim: "RobotArmature|Robot_ThumbsUp", message: "Nice. 👍" },
  { anim: "RobotArmature|Robot_Jump", message: "Yippee! 🚀" },
  { anim: "RobotArmature|Robot_Yes", message: "Absolutely! ✅" },
  { anim: "RobotArmature|Robot_Punch", message: "POW! 💥" },
  { anim: "RobotArmature|Robot_No", message: "tsk tsk tsk... 🙅" },
];

const SPIN_MESSAGES = [
  "Wooo!",
  "Woohooo!",
  "Spin party!",
  "Beyblade, let it rip!",
  "To spin or not to spin...",
  "Uhh... getting dizzy here...",
  "Someone take my gyrometer out!",
];

// module-level flag so intro never replays on remount
let introHasRun = false;

function Robot({ onReaction, isReacting, onHover }) {
  const group = useRef();
  const { scene, animations } = useGLTF("/robot.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const idle = actions[IDLE];
    if (!idle) return;

    idle.reset().fadeIn(0.5).play();

    if (!introHasRun) {
      introHasRun = true;

      let step = 0;
      let timer;

      const playNext = () => {
        if (step >= INTRO.length) {
          idle.reset().fadeIn(0.5).play();
          onReaction(null);
          return;
        }

        const { anim, message } = INTRO[step++];
        const action = actions[anim];
        if (!action) {
          playNext();
          return;
        }

        onReaction(message);
        idle.fadeOut(0.3);
        action.reset().setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
        action.fadeIn(0.3).play();

        timer = setTimeout(playNext, action.getClip().duration * 1000 + 1400);
      };

      const startTimer = setTimeout(playNext, 1000);
      return () => {
        clearTimeout(startTimer);
        clearTimeout(timer);
        idle.fadeOut(0.3);
      };
    }

    return () => idle.fadeOut(0.3);
  }, [actions]);

  const handleClick = (e) => {
    e.stopPropagation();
    if (isReacting) return;

    const pick = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
    const idle = actions[IDLE];
    const next = actions[pick.anim];
    if (!next) return;

    onReaction(pick.message);
    idle?.fadeOut(0.3);

    next.reset().setLoop(THREE.LoopOnce, 1);
    next.clampWhenFinished = true;
    next.fadeIn(0.3).play();

    const ms = next.getClip().duration * 1000;
    setTimeout(() => {
      next.fadeOut(0.3);
      idle?.reset().fadeIn(0.3).play();
      onReaction(null);
    }, ms - 300);
  };

  return (
    <group
      ref={group}
      position={[0, -0.5, 0]}
      onClick={handleClick}
      onPointerOver={() => onHover(true)}
      onPointerOut={() => onHover(false)}
    >
      <Center>
        <primitive object={scene} scale={0.6} />
      </Center>
    </group>
  );
}

function Controls() {
  return (
    <OrbitControls
      enableZoom={false}
      enablePan={false}
      minPolarAngle={Math.PI / 2}
      maxPolarAngle={Math.PI / 2}
      target={[0, 0, 0]}
    />
  );
}

export default function RobotCanvas() {
  const [reactionBubble, setReactionBubble] = useState(null);
  const [spinBubble, setSpinBubble] = useState(null);
  const [hovered, setHovered] = useState(false);
  const spinIndexRef = useRef(0);
  const spinTimerRef = useRef(null);
  const pointerDownRef = useRef(null);
  const isSpinningRef = useRef(false);
  const reactionRef = useRef(false);

  useEffect(() => {
    reactionRef.current = reactionBubble !== null;
  }, [reactionBubble]);

  const startSpin = () => {
    clearTimeout(spinTimerRef.current);
    const msg = SPIN_MESSAGES[spinIndexRef.current % SPIN_MESSAGES.length];
    spinIndexRef.current += 1;
    setSpinBubble(msg);
  };

  const endSpin = () => {
    spinTimerRef.current = setTimeout(() => setSpinBubble(null), 800);
  };

  const handlePointerDown = (e) => {
    pointerDownRef.current = { x: e.clientX, y: e.clientY };
    isSpinningRef.current = false;
  };

  const handlePointerMove = (e) => {
    if (!pointerDownRef.current || reactionRef.current) return;
    const dx = Math.abs(e.clientX - pointerDownRef.current.x);
    if (!isSpinningRef.current && dx > 5) {
      isSpinningRef.current = true;
      startSpin();
    }
  };

  const handlePointerUp = () => {
    if (isSpinningRef.current) {
      isSpinningRef.current = false;
      endSpin();
    }
    pointerDownRef.current = null;
  };

  const displayBubble = reactionBubble ?? spinBubble;

  return (
    <div
      className="relative h-full w-full"
      style={{ cursor: hovered ? "pointer" : "default" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <Canvas
        shadows
        frameloop="always"
        dpr={[1, 2]}
        camera={{ position: [0, 0, 22], fov: 24 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 8, 4]} intensity={1.2} castShadow />
        <pointLight position={[-4, 3, -4]} intensity={0.4} color="#6688ff" />

        <Suspense fallback={null}>
          <Robot
            onReaction={setReactionBubble}
            isReacting={reactionBubble !== null}
            onHover={setHovered}
          />
          <Controls />
          <Preload all />
        </Suspense>
      </Canvas>

      {/* Speech bubble */}
      <AnimatePresence mode="wait">
        {displayBubble && (
          <motion.div
            key={displayBubble}
            initial={{ opacity: 0, scale: 0.85, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pointer-events-none absolute left-1/2 top-[28%] w-max max-w-sm -translate-x-1/2 rounded-2xl bg-[#c68c2f]/25 px-5 py-2.5 text-center text-sm font-bold text-white/95 backdrop-blur-md"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            {displayBubble}
            <span className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 border-l-[7px] border-r-[7px] border-t-[7px] border-l-transparent border-r-transparent border-t-[#c68c2f]/25" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
