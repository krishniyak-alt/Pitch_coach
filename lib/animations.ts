export const TRANSITION_EASE = [0.22, 1, 0.36, 1] as const;

export const FADE_UP_VARIANTS = {
  hidden: { opacity: 0.001, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const STAGGER_CONTAINER = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

export const SCALE_IN_VARIANTS = {
  hidden: { opacity: 0.001, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const VIEWPORT_CONFIG = {
  once: true,
  amount: 0.15,
  margin: "0px 0px -8% 0px" as const,
};
