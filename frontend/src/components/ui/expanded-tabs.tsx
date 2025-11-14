"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useOnClickOutside } from "usehooks-ts";
import { cn } from "@/lib/utils";
import type { Transition } from "framer-motion";

interface Tab {
  title: string;
  icon: LucideIcon;
  id: string; // added: target section id or special action (like notifications)
  type?: never;
}

interface Separator {
  type: "separator";
  title?: never;
  icon?: never;
  id?: never;
}

type TabItem = Tab | Separator;

interface ExpandedTabsProps {
  tabs: TabItem[];
  className?: string;
  activeColor?: string;
  onChange?: (index: number | null) => void;
  onTabClick?: (tab: Tab) => void; // new: handle navigation click
}

const buttonVariants = {
  initial: { gap: 0, paddingLeft: ".5rem", paddingRight: ".5rem" },
  animate: (isHovered: boolean) => ({
    gap: isHovered ? ".5rem" : 0,
    paddingLeft: isHovered ? "1rem" : ".5rem",
    paddingRight: isHovered ? "1rem" : ".5rem",
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition: Transition = {
  delay: 0.1,
  type: "spring",
  bounce: 0,
  duration: 0.6,
};

export function ExpandedTabs({
  tabs,
  className,
  activeColor = "text-primary",
  onChange,
  onTabClick,
}: ExpandedTabsProps) {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const [selected, setSelected] = React.useState<number | null>(null);

  const outsideClickRef = React.useRef<HTMLDivElement>(
    null as unknown as HTMLDivElement
  );

  useOnClickOutside(outsideClickRef, () => {
    setSelected(null);
    onChange?.(null);
  });

  const handleClick = (index: number, tab: Tab) => {
    setSelected(index);
    onChange?.(index);
    onTabClick?.(tab); // triggers navigation / custom action
  };

  const Separator = () => (
    <div className="h-[24px] w-[1.2px] bg-border" aria-hidden="true" />
  );

  return (
    <div
      ref={outsideClickRef}
      className={cn(
        "flex gap-2 rounded-2xl border bg-background p-1 shadow-sm",
        className
      )}
    >
      {tabs.map((tab, index) => {
        if (tab.type === "separator") return <Separator key={index} />;

        const Icon = tab.icon;

        const isHovered = hovered === index;

        return (
          <motion.button
            key={tab.title}
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            custom={isHovered}
            onHoverStart={() => setHovered(index)}
            onHoverEnd={() => setHovered(null)}
            onClick={() => handleClick(index, tab)}
            transition={transition}
            className={cn(
              "relative flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300",
              "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
              selected === index && cn("bg-muted", activeColor)
            )}
          >
            <Icon size={20} />

            <AnimatePresence initial={false}>
              {isHovered && (
                <motion.span
                  variants={spanVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={transition}
                  className="overflow-hidden whitespace-nowrap"
                >
                  {tab.title}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
