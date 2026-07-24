"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import { callMobileSafe, runMobileSafe } from "@/app/mobile/guardMobile";
import { attachVisualViewportFixedRoot } from "@/app/mobile/visualViewportFixedRoot";
import { MobileFeatureErrorBoundary } from "@/app/mobile/MobileFeatureErrorBoundary";
import "@/app/styles/mobile/card-image.css";

type MobileCardImageProps = {
  src: string;
  alt: string;
  /** Default cover — use contain for full artwork (e.g. S33k3r). */
  objectFit?: "cover" | "contain";
  className?: string;
};

type MobileCardVideoThumbProps = {
  src: string;
  label: string;
  className?: string;
};

function subscribeNoop() {
  return () => {};
}

function useIsClient() {
  return useSyncExternalStore(subscribeNoop, () => true, () => false);
}

/**
 * Mark media (and descendants) so card-stage drag never captures / preventDefaults.
 * Enables native long-press “Save Image” / “Save Video” on real media elements.
 */
export const MOBILE_CARD_MEDIA_SELECTOR = "[data-card-media]";

function stopCardDragPropagation(event: ReactPointerEvent) {
  event.stopPropagation();
}

function MobileCardLightbox({
  open,
  onClose,
  label,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: React.ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const isClient = useIsClient();
  const titleId = useId();

  useEffect(() => {
    if (!open || !isClient) return;

    const previousOverflow = document.body.style.overflow;
    runMobileSafe("card-image-lightbox-open", () => {
      document.body.style.overflow = "hidden";
      rootRef.current?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        runMobileSafe("card-image-lightbox-escape", onClose);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      runMobileSafe("card-image-lightbox-close", () => {
        document.body.style.overflow = previousOverflow;
        document.removeEventListener("keydown", onKeyDown);
      });
    };
  }, [open, isClient, onClose]);

  useEffect(() => {
    if (!open || !isClient) return;
    const root = rootRef.current;
    if (!root) return;
    return callMobileSafe(
      "card-image-lightbox-vv",
      () => attachVisualViewportFixedRoot(root),
      () => {},
    );
  }, [open, isClient]);

  if (!open || !isClient) return null;

  return callMobileSafe(
    "card-image-lightbox-portal",
    () =>
      createPortal(
        <div
          ref={rootRef}
          className="mycelia-mobile-card-lightbox-root"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          data-card-media=""
          tabIndex={-1}
          onClick={() => runMobileSafe("card-image-lightbox-tap", onClose)}
          onPointerDown={stopCardDragPropagation}
          onKeyDown={(event: ReactKeyboardEvent) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onClose();
            }
          }}
        >
          <span id={titleId} className="sr-only">
            {label}. Tap to close.
          </span>
          {children}
        </div>,
        document.body,
      ),
    null,
  );
}

/**
 * Compact mobile-only card thumbnail + tap-to-expand lightbox.
 * Real `<img>` for native long-press Save Image. Drag-excluded via data-card-media.
 */
export function MobileCardImage(props: MobileCardImageProps) {
  return (
    <MobileFeatureErrorBoundary feature="card-image">
      <MobileCardImageInner {...props} />
    </MobileFeatureErrorBoundary>
  );
}

function MobileCardImageInner({
  src,
  alt,
  objectFit = "cover",
  className = "",
}: MobileCardImageProps) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  const fitClass =
    objectFit === "contain" ? " mycelia-mobile-card-image--contain" : "";
  const extra = className ? ` ${className}` : "";

  return (
    <>
      <button
        type="button"
        className={`mycelia-mobile-card-image md:hidden${fitClass}${extra}`}
        data-card-media=""
        aria-label={alt ? `Expand ${alt}` : "Expand image"}
        onClick={() => runMobileSafe("card-image-open", () => setOpen(true))}
        onPointerDown={stopCardDragPropagation}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- real <img> required for native Save Image */}
        <img src={src} alt={alt} draggable={false} />
      </button>
      <MobileCardLightbox
        open={open}
        onClose={close}
        label={alt || "Expanded image"}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- real <img> required for native Save Image */}
        <img
          src={src}
          alt={alt}
          className="mycelia-mobile-card-lightbox-media"
          draggable={false}
          onClick={(event) => {
            event.stopPropagation();
            close();
          }}
          onPointerDown={stopCardDragPropagation}
        />
      </MobileCardLightbox>
    </>
  );
}

/**
 * AIS (and similar): compact paused video frame — no autoplay in the card stack.
 * Same drag exclusion; lightbox shows the same paused clip larger.
 * Native long-press Save Video when the browser offers it on `<video>`.
 */
export function MobileCardVideoThumb(props: MobileCardVideoThumbProps) {
  return (
    <MobileFeatureErrorBoundary feature="card-video">
      <MobileCardVideoThumbInner {...props} />
    </MobileFeatureErrorBoundary>
  );
}

function MobileCardVideoThumbInner({
  src,
  label,
  className = "",
}: MobileCardVideoThumbProps) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const extra = className ? ` ${className}` : "";

  const openLightbox = () =>
    runMobileSafe("card-video-open", () => setOpen(true));

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        className={`mycelia-mobile-card-image md:hidden${extra}`}
        data-card-media=""
        aria-label={`Expand ${label}`}
        onClick={openLightbox}
        onPointerDown={stopCardDragPropagation}
        onKeyDown={(event: ReactKeyboardEvent) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openLightbox();
          }
        }}
      >
        <video
          src={src}
          muted
          playsInline
          preload="metadata"
          aria-label={label}
          draggable={false}
        />
      </div>
      <MobileCardLightbox open={open} onClose={close} label={label}>
        <video
          src={src}
          muted
          playsInline
          preload="metadata"
          className="mycelia-mobile-card-lightbox-media"
          aria-label={label}
          draggable={false}
          onClick={(event) => {
            event.stopPropagation();
            close();
          }}
          onPointerDown={stopCardDragPropagation}
        />
      </MobileCardLightbox>
    </>
  );
}
