export const BRIDGE_PRESETS = [
  {
    main: "M 50 0 C 30 40, 70 60, 50 100",
    branch: "M 50 35 L 72 52 M 50 35 L 28 48",
  },
  {
    main: "M 50 0 C 65 35, 35 65, 50 100",
    branch: "M 50 50 L 68 38 M 50 50 L 32 62",
  },
  {
    main: "M 50 0 Q 25 50 50 100",
    branch: "M 50 25 L 62 40 M 50 60 L 38 72",
  },
] as const;
