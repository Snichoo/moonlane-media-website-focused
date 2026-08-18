"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SLIDE_SELECTOR = "[data-proposal-slide]";

export function useProposalDeck() {
  const deckRef = useRef<HTMLElement>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const goToSlide = useCallback((index: number) => {
    const deck = deckRef.current;
    if (!deck) return;

    const slideElements = Array.from(
      deck.querySelectorAll<HTMLElement>(SLIDE_SELECTOR),
    );
    const safeIndex = Math.max(0, Math.min(index, slideElements.length - 1));
    const targetSlide = slideElements[safeIndex];
    if (!targetSlide) return;

    activeIndexRef.current = safeIndex;
    setActiveIndex(safeIndex);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    targetSlide.scrollTo({ behavior: "auto", top: 0 });
    deck.scrollTo({
      behavior: reduceMotion ? "auto" : "smooth",
      left: targetSlide.offsetLeft,
    });
    targetSlide.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;

    document.body.classList.add("proposal-deck-open");
    const slideElements = Array.from(
      deck.querySelectorAll<HTMLElement>(SLIDE_SELECTOR),
    );
    let resizeFrame = 0;
    let wheelAccumulator = 0;
    let wheelLockTimeout = 0;
    let wheelLocked = false;

    const syncActiveSlide = () => {
      const centre = deck.scrollLeft + deck.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      slideElements.forEach((slide, index) => {
        const slideCentre = slide.offsetLeft + slide.offsetWidth / 2;
        const distance = Math.abs(slideCentre - centre);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      activeIndexRef.current = closestIndex;
      setActiveIndex(closestIndex);
    };

    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.isComposing || event.metaKey) {
        return;
      }

      const eventTarget = event.target;
      if (
        eventTarget instanceof HTMLElement &&
        eventTarget.closest(
          "a, button, input, textarea, select, [role='button'], [contenteditable='true']",
        )
      ) {
        return;
      }

      const current = activeIndexRef.current;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToSlide(current + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToSlide(current - 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        goToSlide(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goToSlide(slideElements.length - 1);
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        return;
      }

      const currentSlide = slideElements[activeIndexRef.current];
      if (!currentSlide || event.deltaY === 0) return;

      const canScrollUp = currentSlide.scrollTop > 1;
      const canScrollDown =
        currentSlide.scrollTop + currentSlide.clientHeight <
        currentSlide.scrollHeight - 1;
      const direction = Math.sign(event.deltaY);

      if ((direction < 0 && canScrollUp) || (direction > 0 && canScrollDown)) {
        return;
      }

      event.preventDefault();

      window.clearTimeout(wheelLockTimeout);
      wheelLockTimeout = window.setTimeout(() => {
        wheelAccumulator = 0;
        wheelLocked = false;
      }, 180);

      if (wheelLocked) return;

      const deltaScale =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? 16
          : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? deck.clientHeight
            : 1;
      wheelAccumulator += event.deltaY * deltaScale;

      if (Math.abs(wheelAccumulator) < 36) return;

      wheelLocked = true;
      goToSlide(activeIndexRef.current + (wheelAccumulator > 0 ? 1 : -1));
      wheelAccumulator = 0;
    };

    const alignAfterResize = () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        const currentSlide = slideElements[activeIndexRef.current];
        if (currentSlide) {
          deck.scrollTo({ behavior: "auto", left: currentSlide.offsetLeft });
        }
      });
    };

    deck.addEventListener("scroll", syncActiveSlide, { passive: true });
    deck.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyboard);
    window.addEventListener("resize", alignAfterResize);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncVideoMotion = () => {
      deck.querySelectorAll("video").forEach((video) => {
        if (reduceMotion.matches) video.pause();
        else void video.play().catch(() => undefined);
      });
    };
    reduceMotion.addEventListener("change", syncVideoMotion);
    syncVideoMotion();
    syncActiveSlide();

    return () => {
      document.body.classList.remove("proposal-deck-open");
      deck.removeEventListener("scroll", syncActiveSlide);
      deck.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyboard);
      window.removeEventListener("resize", alignAfterResize);
      reduceMotion.removeEventListener("change", syncVideoMotion);
      window.cancelAnimationFrame(resizeFrame);
      window.clearTimeout(wheelLockTimeout);
    };
  }, [goToSlide]);

  return { activeIndex, deckRef, goToSlide };
}
