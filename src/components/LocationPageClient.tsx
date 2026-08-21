"use client";

import { useEffect } from "react";
import { initBehaviors } from "@/lib/behaviors";

type Cleanup = () => void;

export default function LocationPageClient({
  sliders = false,
}: {
  sliders?: boolean;
}) {
  useEffect(() => {
    let cancelled = false;
    let sliderCleanup: Cleanup | undefined;
    let sliderObserver: IntersectionObserver | undefined;
    let videoObserver: IntersectionObserver | undefined;
    let imageObserver: IntersectionObserver | undefined;
    const behaviorCleanup = initBehaviors(document);

    const deferredImages = Array.from(
      document.querySelectorAll<HTMLImageElement>(
        ".paid-location-page img[data-deferred-image]",
      ),
    );
    const loadImage = (image: HTMLImageElement) => {
      if (image.dataset.srcset) image.srcset = image.dataset.srcset;
      if (image.dataset.src) image.src = image.dataset.src;
      image.removeAttribute("data-srcset");
      image.removeAttribute("data-src");
      image.removeAttribute("data-deferred-image");
    };

    if (deferredImages.length && "IntersectionObserver" in window) {
      imageObserver = new IntersectionObserver(
        (entries, observer) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            loadImage(entry.target as HTMLImageElement);
            observer.unobserve(entry.target);
          }
        },
        { rootMargin: "900px 0px" },
      );
      deferredImages.forEach((image) => imageObserver?.observe(image));
    } else {
      deferredImages.forEach(loadImage);
    }

    const deferredVideos = Array.from(
      document.querySelectorAll<HTMLVideoElement>(
        ".paid-location-page video[data-deferred-video]",
      ),
    );
    const loadVideo = (video: HTMLVideoElement) => {
      for (const source of video.querySelectorAll<HTMLSourceElement>(
        "source[data-src]",
      )) {
        source.src = source.dataset.src || "";
        source.removeAttribute("data-src");
      }
      video.load();
      video.play().catch(() => {});
    };

    if (deferredVideos.length) {
      if ("IntersectionObserver" in window) {
        videoObserver = new IntersectionObserver(
          (entries, observer) => {
            for (const entry of entries) {
              if (!entry.isIntersecting) continue;
              loadVideo(entry.target as HTMLVideoElement);
              observer.unobserve(entry.target);
            }
          },
          { rootMargin: "600px 0px" },
        );
        deferredVideos.forEach((video) => videoObserver?.observe(video));
      } else {
        deferredVideos.forEach(loadVideo);
      }
    }

    if (sliders) {
      const init = () => {
        sliderObserver?.disconnect();
        import("@/lib/sliders").then(({ initSliders }) =>
          initSliders().then((cleanup) => {
            if (cancelled) cleanup();
            else sliderCleanup = cleanup;
          }),
        );
      };
      const firstSlider = document.querySelector(
        ".paid-location-page .testimonial-video-slider-section",
      );

      if (firstSlider && "IntersectionObserver" in window) {
        sliderObserver = new IntersectionObserver(
          (entries) => {
            if (entries.some((entry) => entry.isIntersecting)) init();
          },
          { rootMargin: "1200px 0px" },
        );
        sliderObserver.observe(firstSlider);
      } else {
        init();
      }
    }

    return () => {
      cancelled = true;
      behaviorCleanup();
      imageObserver?.disconnect();
      videoObserver?.disconnect();
      sliderObserver?.disconnect();
      sliderCleanup?.();
    };
  }, [sliders]);

  return null;
}
