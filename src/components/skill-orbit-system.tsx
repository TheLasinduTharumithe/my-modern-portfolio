"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { SiReact } from "react-icons/si";

import { skillGroups } from "@/lib/portfolio-data";
import { getSkillVisual } from "@/lib/skill-visuals";

type Point = {
  x: number;
  y: number;
};

type Orbit = {
  duration: number;
  floating: {
    x: number[];
    y: number[];
  };
};

const skills = skillGroups.flatMap((group) =>
  group.skills.map(([name]) => ({
    name,
    group: group.title,
    visual: getSkillVisual(name, group.accent),
  })),
);

const ringCounts = [5, 8, 10, 12] as const;
const floatingRadii = [9, 14, 19, 25] as const;

function makePath(startingAngle: number, direction: number, radius: number) {
  const points = Array.from({ length: 13 }, (_, pointIndex) => {
    const progress = pointIndex / 12;
    const angle = startingAngle + direction * progress * Math.PI * 2;

    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  });

  return {
    x: points.map((point) => point.x),
    y: points.map((point) => point.y),
  };
}

function makeOrbit(index: number): Orbit {
  let ring = 0;
  let itemIndex = index;

  while (itemIndex >= ringCounts[ring] && ring < ringCounts.length - 1) {
    itemIndex -= ringCounts[ring];
    ring += 1;
  }

  const count = ringCounts[ring];
  const direction = ring % 2 === 0 ? 1 : -1;
  const startingAngle = (itemIndex / count) * Math.PI * 2 + ring * 0.28;

  return {
    duration: 16 + ring * 3 + (itemIndex % 3) * 0.9,
    floating: makePath(startingAngle, direction, floatingRadii[ring]),
  };
}

function getScatteredPoint(index: number, width: number, height: number): Point {
  const columns = 7;
  const rows = 5;
  const column = (index * 3) % columns;
  const row = Math.floor(index / columns);
  const jitterX = Math.sin((index + 1) * 12.9898) * 0.24;
  const jitterY = Math.cos((index + 1) * 7.233) * 0.2;
  const xRatio = 0.035 + ((column + 0.5 + jitterX) / columns) * 0.93;
  const yRatio = 0.065 + ((row + 0.5 + jitterY) / rows) * 0.87;

  return {
    x: xRatio * width,
    y: yRatio * height,
  };
}

const orbits = skills.map((_, index) => makeOrbit(index));

export function SkillOrbitSystem() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [docked, setDocked] = useState(false);
  const [cursor, setCursor] = useState<Point>({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [dockPoints, setDockPoints] = useState<Array<Point | null>>(() =>
    skills.map(() => null),
  );
  const dustCanvas = useRef<HTMLCanvasElement>(null);
  const pointerFrame = useRef<number | null>(null);
  const measureFrame = useRef<number | null>(null);
  const latestPointer = useRef<Point>({ x: 0, y: 0 });
  const isDocked = useRef(false);
  const orbitData = useMemo(() => orbits, []);
  const canAnimate = enabled && !shouldReduceMotion;

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    const updatePointerCapability = () => {
      const nextEnabled = finePointer.matches;
      setEnabled(nextEnabled);
      setViewport({ width: window.innerWidth, height: window.innerHeight });

      if (nextEnabled && latestPointer.current.x === 0 && latestPointer.current.y === 0) {
        const initialPoint = {
          x: window.innerWidth * 0.56,
          y: window.innerHeight * 0.5,
        };
        latestPointer.current = initialPoint;
        setCursor(initialPoint);
      }
    };

    const handleResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    const initialFrame = window.requestAnimationFrame(updatePointerCapability);

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      latestPointer.current = { x: event.clientX, y: event.clientY };
      setCursorVisible(true);

      if (pointerFrame.current !== null) return;

      pointerFrame.current = window.requestAnimationFrame(() => {
        setCursor(latestPointer.current);
        pointerFrame.current = null;
      });
    };

    const handlePointerLeave = () => {
      setCursorVisible(false);
    };

    finePointer.addEventListener("change", updatePointerCapability);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handlePointerLeave);
    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(initialFrame);
      if (pointerFrame.current !== null) {
        window.cancelAnimationFrame(pointerFrame.current);
      }
      finePointer.removeEventListener("change", updatePointerCapability);
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("mouseleave", handlePointerLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("skill-orbit-active", canAnimate);
    document.documentElement.classList.toggle("react-cursor-active", canAnimate);

    return () => {
      document.documentElement.classList.remove("skill-orbit-active");
      document.documentElement.classList.remove("react-cursor-active");
    };
  }, [canAnimate]);

  useEffect(() => {
    if (!canAnimate) return;

    const canvas = dustCanvas.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    type DustParticle = {
      x: number;
      y: number;
      velocityX: number;
      velocityY: number;
      life: number;
      size: number;
      sparkle: boolean;
    };

    const particles: DustParticle[] = [];
    let animationFrame = 0;
    let previousFrame = performance.now();
    let previousPointer: Point | null = null;
    let lastEmission = 0;
    let pixelRatio = 1;

    const resizeCanvas = () => {
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * pixelRatio);
      canvas.height = Math.round(window.innerHeight * pixelRatio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const emitDust = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      const now = performance.now();
      const current = { x: event.clientX, y: event.clientY };
      const movementX = previousPointer ? current.x - previousPointer.x : 0;
      const movementY = previousPointer ? current.y - previousPointer.y : 0;
      previousPointer = current;

      if (now - lastEmission < 14) return;
      lastEmission = now;

      const amount = Math.min(6, 3 + Math.round(Math.hypot(movementX, movementY) / 16));

      for (let index = 0; index < amount; index += 1) {
        particles.push({
          x: current.x + (Math.random() - 0.5) * 15,
          y: current.y + (Math.random() - 0.5) * 15,
          velocityX: -movementX * 0.035 + (Math.random() - 0.5) * 0.8,
          velocityY: -movementY * 0.035 + (Math.random() - 0.5) * 0.8 - 0.15,
          life: 1,
          size: 0.9 + Math.random() * 1.9,
          sparkle: Math.random() > 0.64,
        });
      }

      if (particles.length > 140) {
        particles.splice(0, particles.length - 140);
      }
    };

    const drawDust = (now: number) => {
      const elapsed = Math.min(now - previousFrame, 34);
      previousFrame = now;
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      context.globalCompositeOperation = "lighter";

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];
        particle.life -= elapsed / 920;

        if (particle.life <= 0) {
          particles.splice(index, 1);
          continue;
        }

        particle.x += particle.velocityX * (elapsed / 16.67);
        particle.y += particle.velocityY * (elapsed / 16.67);
        particle.velocityX *= 0.985;
        particle.velocityY = particle.velocityY * 0.985 + 0.008 * (elapsed / 16.67);

        const alpha = Math.sin(particle.life * Math.PI) * 0.88;
        context.fillStyle = `rgba(224, 183, 93, ${alpha})`;
        context.shadowColor = `rgba(198, 143, 42, ${alpha})`;
        context.shadowBlur = 8;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();

        if (particle.sparkle && particle.life > 0.36) {
          const ray = particle.size * 2.6;
          context.strokeStyle = `rgba(246, 215, 139, ${alpha * 0.8})`;
          context.lineWidth = 0.7;
          context.beginPath();
          context.moveTo(particle.x - ray, particle.y);
          context.lineTo(particle.x + ray, particle.y);
          context.moveTo(particle.x, particle.y - ray);
          context.lineTo(particle.x, particle.y + ray);
          context.stroke();
        }
      }

      context.shadowBlur = 0;
      context.globalCompositeOperation = "source-over";
      animationFrame = window.requestAnimationFrame(drawDust);
    };

    resizeCanvas();
    animationFrame = window.requestAnimationFrame(drawDust);
    window.addEventListener("pointermove", emitDust, { passive: true });
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", emitDust);
      window.removeEventListener("resize", resizeCanvas);
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };
  }, [canAnimate]);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let section: HTMLElement | null = null;
    const settleTimers: number[] = [];
    let viewportSettleTimer: number | null = null;

    const measureDockPoints = () => {
      if (!isDocked.current || measureFrame.current !== null) return;

      measureFrame.current = window.requestAnimationFrame(() => {
        const nextPoints = skills.map((_, index) => {
          const target = document.querySelector<HTMLElement>(
            `[data-skill-dock="${index}"]`,
          );

          if (!target) return null;

          const bounds = target.getBoundingClientRect();
          return {
            x: bounds.left + bounds.width / 2,
            y: bounds.top + bounds.height / 2,
          };
        });

        setDockPoints(nextPoints);
        measureFrame.current = null;
      });
    };

    const clearSettleTimers = () => {
      settleTimers.splice(0).forEach((timer) => window.clearTimeout(timer));
    };

    const settleDockPoints = () => {
      clearSettleTimers();
      [0, 100, 240, 480, 760].forEach((delay) => {
        settleTimers.push(window.setTimeout(measureDockPoints, delay));
      });
    };

    const handleViewportChange = () => {
      measureDockPoints();

      if (viewportSettleTimer !== null) {
        window.clearTimeout(viewportSettleTimer);
      }
      viewportSettleTimer = window.setTimeout(() => {
        settleDockPoints();
        viewportSettleTimer = null;
      }, 90);
    };

    const routeFrame = window.requestAnimationFrame(() => {
      section = document.querySelector<HTMLElement>("[data-skill-section]");

      if (!section) {
        isDocked.current = false;
        setDocked(false);
        return;
      }

      const sectionBounds = section.getBoundingClientRect();
      const initiallyVisible =
        sectionBounds.bottom > window.innerHeight * 0.1 &&
        sectionBounds.top < window.innerHeight * 0.9;

      isDocked.current = initiallyVisible;
      setDocked(initiallyVisible);
      if (initiallyVisible) settleDockPoints();

      observer = new IntersectionObserver(
        ([entry]) => {
          const nextDocked = entry.isIntersecting;
          isDocked.current = nextDocked;
          setDocked(nextDocked);
          if (nextDocked) settleDockPoints();
        },
        { rootMargin: "-10% 0px -10% 0px", threshold: 0.01 },
      );
      observer.observe(section);
    });

    window.addEventListener("scroll", handleViewportChange, { passive: true });
    window.addEventListener("resize", handleViewportChange);

    return () => {
      window.cancelAnimationFrame(routeFrame);
      if (measureFrame.current !== null) {
        window.cancelAnimationFrame(measureFrame.current);
        measureFrame.current = null;
      }
      observer?.disconnect();
      clearSettleTimers();
      if (viewportSettleTimer !== null) {
        window.clearTimeout(viewportSettleTimer);
      }
      window.removeEventListener("scroll", handleViewportChange);
      window.removeEventListener("resize", handleViewportChange);
    };
  }, [pathname]);

  if (!canAnimate) return null;

  return (
    <div
      data-skill-orbit-system
      className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
      aria-hidden="true"
    >
      <canvas ref={dustCanvas} className="absolute inset-0 size-full" />

      {skills.map((skill, index) => {
        const Icon = skill.visual.icon;
        const dockPoint = dockPoints[index];
        const orbit = orbitData[index];
        const scatteredPoint = getScatteredPoint(
          index,
          viewport.width,
          viewport.height,
        );
        const target = docked && dockPoint
          ? dockPoint
          : scatteredPoint;

        return (
          <motion.div
            key={`${skill.group}-${skill.name}`}
            data-orbit-skill={index}
            className="absolute left-0 top-0 grid size-11 place-items-center"
            initial={false}
            animate={{
              x: target.x - 22,
              y: target.y - 22,
              opacity: docked ? 1 : 0.26 + (index % 4) * 0.04,
              filter: docked ? "blur(0px)" : "blur(2.4px)",
            }}
            transition={{
              x: {
                type: "spring",
                stiffness: docked ? 120 : 48,
                damping: docked ? 24 : 17,
                mass: 1.08,
              },
              y: {
                type: "spring",
                stiffness: docked ? 120 : 48,
                damping: docked ? 24 : 17,
                mass: 1.08,
              },
              opacity: { duration: 0.55 },
              filter: { duration: 0.5, ease: "easeOut" },
            }}
          >
            <motion.span
              className="grid size-9 place-items-center rounded-[12px] border border-[#4a4130]/15 bg-[#faf6eb]/90 shadow-[0_6px_18px_rgba(74,65,45,0.15)]"
              initial={false}
              animate={
                docked
                  ? { x: 0, y: 0, rotate: 0, scale: 1 }
                  : {
                      x: orbit.floating.x,
                      y: orbit.floating.y,
                      rotate: [0, 5, -4, 3, 0],
                      scale: 0.86 + (index % 4) * 0.07,
                    }
              }
              transition={
                docked
                  ? {
                      type: "spring",
                      stiffness: 105 + (index % 5) * 8,
                      damping: 15,
                    }
                  : {
                      x: { duration: orbit.duration, ease: "linear", repeat: Infinity },
                      y: { duration: orbit.duration, ease: "linear", repeat: Infinity },
                      rotate: {
                        duration: 5 + (index % 4),
                        ease: "easeInOut",
                        repeat: Infinity,
                      },
                      scale: { duration: 0.25 },
                    }
              }
            >
              <Icon className="size-6" style={{ color: skill.visual.color }} />
            </motion.span>
          </motion.div>
        );
      })}

      <motion.div
        data-react-cursor
        className="fixed left-0 top-0 z-[90] grid size-9 place-items-center"
        initial={false}
        animate={{
          x: cursor.x - 18,
          y: cursor.y - 18,
          opacity: cursorVisible ? 1 : 0,
          scale: cursorVisible ? 1 : 0.7,
        }}
        transition={{
          x: { type: "spring", stiffness: 620, damping: 38, mass: 0.16 },
          y: { type: "spring", stiffness: 620, damping: 38, mass: 0.16 },
          opacity: { duration: 0.15 },
          scale: { duration: 0.15 },
        }}
      >
        <motion.span
          className="grid size-9 place-items-center rounded-full border border-[#d4a74b]/70 bg-[#17140e] shadow-[0_5px_18px_rgba(180,130,38,0.3)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, ease: "linear", repeat: Infinity }}
        >
          <SiReact className="size-6 text-[#e0b75d]" />
        </motion.span>
      </motion.div>
    </div>
  );
}
