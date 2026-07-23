"use client";

import "@/app/styles/mobile/card-guide.css";

type MobileCardGuideArrowsProps = {
  fading?: boolean;
};

/** Decorative L/R arrows on the first card — aria-hidden, non-interactive. */
export function MobileCardGuideArrows({ fading = false }: MobileCardGuideArrowsProps) {
  return (
    <div
      className={`mycelia-card-guide mycelia-card-guide-arrows${fading ? " mycelia-card-guide--fading" : ""}`}
      aria-hidden="true"
    >
      <svg
        className="mycelia-card-guide-arrow mycelia-card-guide-arrow--left"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
      <svg
        className="mycelia-card-guide-arrow mycelia-card-guide-arrow--right"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </div>
  );
}

type MobileCardGuideTipProps = {
  fading?: boolean;
};

/**
 * Compact first-use tip below the hero card (sticky-stage bottom band).
 * Short-viewport copy swaps via CSS (@media max-height: 640px).
 */
export function MobileCardGuideTip({ fading = false }: MobileCardGuideTipProps) {
  return (
    <p
      className={`mycelia-card-guide mycelia-card-guide-tip${fading ? " mycelia-card-guide--fading" : ""}`}
      role="note"
    >
      <span className="mycelia-card-guide-tip-full">
        Drag sideways to browse. Scroll inside a card to read more.
      </span>
      <span className="mycelia-card-guide-tip-short">
        Drag sideways to browse · Scroll to read more
      </span>
    </p>
  );
}
