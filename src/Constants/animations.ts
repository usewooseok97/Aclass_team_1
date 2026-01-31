export const motionVariants = {
  button: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
  },
  smallButton: {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.9 },
  },
  card: {
    whileHover: { scale: 1.02, y: -3 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 },
  },
  actionButton: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
  },
} as const;
