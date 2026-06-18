import {
  useTransform,
  type MotionValue,
} from "framer-motion";

export const FOLD_OUT_END = 0.45;
export const FOLD_IN_START = 0.45;

export function useFoldOutTransforms(
  progress: MotionValue<number>,
  use3D = true,
) {
  const opacity = useTransform(progress, [0, 0.35, FOLD_OUT_END], [1, 0.6, 0]);
  const scaleY = useTransform(progress, [0, FOLD_OUT_END], [1, 0.12]);
  const rotateX = useTransform(
    progress,
    [0, FOLD_OUT_END],
    use3D ? [0, 68] : [0, 0],
  );
  const blur = useTransform(progress, [0, FOLD_OUT_END], [0, 4]);

  return { opacity, scaleY, rotateX, blur };
}

export function useFoldInTransforms(
  progress: MotionValue<number>,
  use3D = true,
) {
  const opacity = useTransform(
    progress,
    [FOLD_IN_START, 0.55, 1],
    [0, 0.4, 1],
  );
  const scaleY = useTransform(progress, [FOLD_IN_START, 0.6, 1], [0.2, 0.5, 1]);
  const rotateX = useTransform(
    progress,
    [FOLD_IN_START, 0.65, 1],
    use3D ? [-55, -15, 0] : [0, 0, 0],
  );

  return { opacity, scaleY, rotateX };
}

export function useBandInTransforms(progress: MotionValue<number>) {
  const opacity = useTransform(progress, [FOLD_IN_START, 0.6, 1], [0, 0.5, 1]);
  const scaleY = useTransform(progress, [FOLD_IN_START, 0.65, 1], [0, 0.6, 1]);

  return { opacity, scaleY };
}

export function useBandOutTransforms(progress: MotionValue<number>) {
  const opacity = useTransform(progress, [0, 0.35, FOLD_OUT_END], [1, 0.5, 0]);
  const scaleY = useTransform(progress, [0, FOLD_OUT_END], [1, 0]);

  return { opacity, scaleY };
}

export function useFadeOutTransforms(progress: MotionValue<number>) {
  const opacity = useTransform(progress, [0, 0.5], [1, 0]);
  const scaleY = useTransform(progress, [0, 1], [1, 1]);
  const rotateX = useTransform(progress, [0, 1], [0, 0]);
  const blur = useTransform(progress, [0, 1], [0, 0]);

  return { opacity, scaleY, rotateX, blur };
}

export function useFadeInTransforms(progress: MotionValue<number>) {
  const opacity = useTransform(progress, [0.35, 1], [0, 1]);
  const scaleY = useTransform(progress, [0, 1], [1, 1]);
  const rotateX = useTransform(progress, [0, 1], [0, 0]);

  return { opacity, scaleY, rotateX };
}

export function useCardFoldTransforms(
  progress: MotionValue<number>,
  index: number,
  total: number,
  use3D = true,
) {
  const stagger = Math.min(0.12, 0.5 / Math.max(total, 1));
  const start = 0.5 + index * stagger;
  const end = Math.min(start + stagger + 0.08, 1);

  const opacity = useTransform(progress, [start, end], [0, 1]);
  const scaleY = useTransform(progress, [start, end], [0.15, 1]);
  const rotateX = useTransform(
    progress,
    [start, end],
    use3D ? [-50, 0] : [0, 0],
  );

  return { opacity, scaleY, rotateX, start, end };
}
