"use client";

import { motion, type Variants, useReducedMotion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { skillGroups } from "@/lib/portfolio-data";
import { getSkillVisual } from "@/lib/skill-visuals";
import { cn } from "@/lib/utils";

const accentStyles = {
  cyan: {
    icon: "text-[#b8613b]",
    glow: "bg-[#b8613b]/12",
    tile: "hover:border-[#b8613b]/45 hover:bg-[#b8613b]/[0.06] active:border-[#b8613b]/45 active:bg-[#b8613b]/[0.06]",
    count: "text-[#b8613b]",
  },
  emerald: {
    icon: "text-[#596b50]",
    glow: "bg-[#596b50]/12",
    tile: "hover:border-[#596b50]/45 hover:bg-[#596b50]/[0.06] active:border-[#596b50]/45 active:bg-[#596b50]/[0.06]",
    count: "text-[#596b50]",
  },
  amber: {
    icon: "text-[#9b7128]",
    glow: "bg-[#9b7128]/12",
    tile: "hover:border-[#9b7128]/45 hover:bg-[#9b7128]/[0.06] active:border-[#9b7128]/45 active:bg-[#9b7128]/[0.06]",
    count: "text-[#9b7128]",
  },
  rose: {
    icon: "text-[#a45d52]",
    glow: "bg-[#a45d52]/12",
    tile: "hover:border-[#a45d52]/45 hover:bg-[#a45d52]/[0.06] active:border-[#a45d52]/45 active:bg-[#a45d52]/[0.06]",
    count: "text-[#a45d52]",
  },
  violet: {
    icon: "text-[#71627c]",
    glow: "bg-[#71627c]/12",
    tile: "hover:border-[#71627c]/45 hover:bg-[#71627c]/[0.06] active:border-[#71627c]/45 active:bg-[#71627c]/[0.06]",
    count: "text-[#71627c]",
  },
} as const;

const sectionVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.09,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 34, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.48, ease: "easeOut" },
  },
};

export function TechnicalSkillsSection() {
  const shouldReduceMotion = useReducedMotion();
  const skillCount = skillGroups.reduce((total, group) => total + group.skills.length, 0);

  return (
    <section id="skills" data-skill-section className="section-pad relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="max-w-3xl">
            <Badge>Technical Skills</Badge>
            <h2 className="mt-5 text-3xl font-semibold tracking-normal text-white sm:text-4xl">
              Tools I use to turn ideas into working systems.
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-400">
              A practical stack across interfaces, services, data, infrastructure,
              and delivery—organized by where each technology fits in real work.
            </p>
          </div>

          <div className="flex gap-3" aria-label={`${skillGroups.length} disciplines and ${skillCount} technologies`}>
            <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3 text-center">
              <p className="text-xl font-semibold text-white">{skillGroups.length}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">
                Disciplines
              </p>
            </div>
            <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3 text-center">
              <p className="text-xl font-semibold text-white">{skillCount}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">
                Technologies
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
          variants={shouldReduceMotion ? undefined : sectionVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.08 }}
        >
          {skillGroups.map((group, groupIndex) => {
            const GroupIcon = group.icon;
            const accent = accentStyles[group.accent];
            const groupStartIndex = skillGroups
              .slice(0, groupIndex)
              .reduce((total, item) => total + item.skills.length, 0);

            return (
              <motion.div
                key={group.title}
                variants={shouldReduceMotion ? undefined : cardVariants}
                className="h-full"
              >
                <Card className="group/card relative h-full overflow-visible p-5 transition duration-300 hover:-translate-y-1 hover:border-white/16 active:-translate-y-1 active:border-white/16 sm:p-6">
                  <div
                    className={cn(
                      "pointer-events-none absolute -right-14 -top-14 size-36 rounded-full opacity-0 blur-3xl transition duration-500 group-hover/card:opacity-100 group-active/card:opacity-100",
                      accent.glow,
                    )}
                  />

                  <div className="relative flex items-center justify-between gap-4 border-b border-white/8 pb-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.04]",
                          accent.icon,
                        )}
                      >
                        <GroupIcon className="size-4" aria-hidden="true" />
                      </span>
                      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">
                        {group.title}
                      </h3>
                    </div>
                    <span className={cn("text-xs font-semibold tabular-nums", accent.count)}>
                      {String(group.skills.length).padStart(2, "0")}
                    </span>
                  </div>

                  <ul className="relative mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                    {group.skills.map(([name], skillIndex) => {
                      const visual = getSkillVisual(name, group.accent);
                      const SkillIcon = visual.icon;
                      const globalSkillIndex = groupStartIndex + skillIndex;

                      return (
                        <li key={name} className="relative">
                          <motion.div
                            className={cn(
                              "flex min-h-28 flex-col items-center justify-center gap-3 rounded-[18px] border border-white/8 bg-black/15 px-2 py-4 text-center transition duration-300",
                              accent.tile,
                            )}
                            whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.025 }}
                            whileTap={shouldReduceMotion ? undefined : { y: -4, scale: 1.025 }}
                            transition={{ type: "spring", stiffness: 280, damping: 20 }}
                          >
                            <span
                              data-skill-dock={globalSkillIndex}
                              className="relative z-20 grid size-11 place-items-center rounded-[14px] border border-white/10 bg-white/[0.055] shadow-[0_10px_24px_rgba(74,65,45,0.1)]"
                            >
                              <SkillIcon
                                data-skill-static-icon
                                className="size-6"
                                style={{ color: visual.color }}
                                aria-hidden="true"
                              />
                            </span>
                            <span className="text-[11px] font-medium leading-4 text-slate-300">
                              {name}
                            </span>
                          </motion.div>
                        </li>
                      );
                    })}
                  </ul>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
