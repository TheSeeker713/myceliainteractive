"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type MobileFeatureErrorBoundaryProps = {
  /** Short id for console diagnostics (e.g. a11y-sheet, mobile-nav). */
  feature: string;
  children: ReactNode;
  /** Optional fallback when the mobile feature fails; defaults to null. */
  fallback?: ReactNode;
};

type MobileFeatureErrorBoundaryState = {
  hasError: boolean;
};

/**
 * Isolates mobile-only UI failures so they cannot tear down shared chrome
 * (header, desktop a11y popover, card stage desktop path).
 */
export class MobileFeatureErrorBoundary extends Component<
  MobileFeatureErrorBoundaryProps,
  MobileFeatureErrorBoundaryState
> {
  state: MobileFeatureErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): MobileFeatureErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(
      `[mycelia:mobile] ${this.props.feature} failed; desktop/shared chrome continues.`,
      error,
      info.componentStack,
    );
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}
