const NO_MOTION_ROUTES = ["/ls/play", "/ls/game"];

export function shouldUseMotionShell(pathname: string): boolean {
  return !NO_MOTION_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}
