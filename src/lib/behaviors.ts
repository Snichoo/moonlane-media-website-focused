// Vanilla re-implementation of the Chromatix theme's home.min.js interactions
// (everything except the Slick carousels, which live in sliders.ts).
// Mirrors the original class hooks: `scroll` on header/logo, `rp-menu-opened`
// on body, `side-form-opened`/`side-form-peek` on body, `number-load` on stats,
// scroll-driven `data-speed` parallax on the hero layers/leaves + footer image,
// the hero leaves' entrance rotation, and the FAQ leaf fan-out (`show`).

type Cleanup = () => void;

export function initBehaviors(root: HTMLElement | Document = document): Cleanup {
  const cleanups: Cleanup[] = [];
  const on = <K extends keyof WindowEventMap>(
    t: Window | Document | HTMLElement,
    ev: K | string,
    fn: EventListenerOrEventListenerObject,
    opts?: AddEventListenerOptions,
  ) => {
    t.addEventListener(ev, fn as EventListener, opts);
    cleanups.push(() => t.removeEventListener(ev, fn as EventListener, opts));
  };
  const q = <T extends Element = HTMLElement>(s: string) => root.querySelector<T>(s);
  const qa = <T extends Element = HTMLElement>(s: string) =>
    Array.from(root.querySelectorAll<T>(s));

  /* ---- 1. Sticky header: toggle `scroll` on header + logo container ---- */
  const header = q(".chr-header");
  const logo = q(".chr-logo-container");
  const onHeaderScroll = () => {
    const scrolled = window.scrollY > 0;
    header?.classList.toggle("scroll", scrolled);
    logo?.classList.toggle("scroll", scrolled);
  };

  /* ---- 2. Scroll-driven parallax on hero layers + footer image ---- */
  const layers = qa<HTMLElement>(".home-banner .layer[data-speed]");
  // footer flower + the contact page's side image drift as they enter view
  const driftImgs = qa<HTMLElement>(
    ".footer-image-wrapper[data-speed], .form-side-image-wrapper[data-speed]",
  );
  const applyParallax = () => {
    const y = window.scrollY;
    for (const el of layers) {
      const speed = parseFloat(el.dataset.speed || "0");
      el.style.transform = `translate3d(0, ${-(y * speed)}px, 0)`;
    }
    for (const el of driftImgs) {
      const speed = parseFloat(el.dataset.speed || "0");
      const rect = el.getBoundingClientRect();
      const progress = window.innerHeight - rect.top; // >0 once it enters view
      const o = progress > 0 ? progress * speed * 0.35 : 0;
      el.style.transform = `translate3d(0, ${-o}px, 0)`;
    }
  };

  /* ---- 2b. Hero leaves: entrance rotation, then scroll parallax ----
     Port of home.min.js `f()`/`c()`: each `.leaf` swings from data-start-angle
     to data-end-angle after data-delay, gains `load`, and only then follows
     the scroll at data-speed (inline translate3d + rotate, like the theme).
     The theme runs this on desktop only — smaller breakpoints restyle the
     leaves and expect them untouched. */
  const isDesktop = window.matchMedia("screen and (min-width: 1240px)").matches;
  const banner = q<HTMLElement>(".home-banner");
  const loadedLeaves: HTMLElement[] = [];
  const swing = (t: number) => 0.5 - Math.cos(t * Math.PI) / 2;
  if (isDesktop) {
    for (const leaf of qa<HTMLElement>(".leaves-group .leaf")) {
      const start = parseFloat(leaf.dataset.startAngle || "0");
      const end = parseFloat(leaf.dataset.endAngle || "0");
      const dur = parseInt(leaf.dataset.duration || "1000", 10);
      const delay = parseInt(leaf.dataset.delay || "0", 10);
      const timer = window.setTimeout(() => {
        leaf.classList.add("show");
        const t0 = performance.now();
        const step = (now: number) => {
          const p = Math.min(1, (now - t0) / dur);
          leaf.style.transform = `rotate(${start + (end - start) * swing(p)}deg)`;
          if (p < 1) {
            requestAnimationFrame(step);
          } else {
            leaf.classList.add("load");
            loadedLeaves.push(leaf);
          }
        };
        requestAnimationFrame(step);
      }, delay);
      cleanups.push(() => window.clearTimeout(timer));
    }
  }
  const applyLeafParallax = () => {
    if (!banner || !loadedLeaves.length) return;
    const y = window.scrollY;
    const bannerTop = banner.getBoundingClientRect().top + y;
    const bannerBottom = bannerTop + banner.offsetHeight;
    if (y + window.innerHeight <= bannerTop || y >= bannerBottom) return;
    for (const leaf of loadedLeaves) {
      const speed = parseFloat(leaf.dataset.speed || "0");
      const end = parseFloat(leaf.dataset.endAngle || "0");
      leaf.style.transform = `translate3d(0, ${-(speed * (y - bannerTop))}px, 0) rotate(${end}deg)`;
    }
  };

  /* ---- 2c. FAQ side image: leaves fan out (`show`) once the wrapper's top
     crosses 55% of the viewport, retracting on scroll-back — mirrors the
     theme's ScrollMagic scene (triggerHook .55, reverse) ---- */
  const faqAnims = isDesktop ? qa<HTMLElement>(".faq-section .faq-animation") : [];
  const applyFaqReveal = () => {
    for (const el of faqAnims) {
      el.classList.toggle("show", el.getBoundingClientRect().top < window.innerHeight * 0.55);
    }
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      onHeaderScroll();
      applyParallax();
      applyLeafParallax();
      applyFaqReveal();
      applyReveals();
      ticking = false;
    });
  };
  on(window, "scroll", onScroll, { passive: true });
  onHeaderScroll();
  applyParallax();
  applyFaqReveal();

  /* ---- 3. Count-up stats: animate `.number` to data-number on enter view ---- */
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
  const runCount = (item: HTMLElement) => {
    if (item.classList.contains("number-load")) return;
    item.classList.add("number-load");
    const numEl = item.querySelector<HTMLElement>(".number");
    const target = parseInt(item.getAttribute("data-number") || "0", 10);
    if (!numEl || !target) return;
    const dur = 2000;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      numEl.textContent = ` ${Math.round(easeOutCubic(p) * target)} `;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const numbers = qa<HTMLElement>(".item-number[data-number]");
  if (numbers.length) {
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              runCount(e.target as HTMLElement);
              io.unobserve(e.target);
            }
          }
        },
        { threshold: 0.4 },
      );
      numbers.forEach((n) => io.observe(n));
      cleanups.push(() => io.disconnect());
    } else {
      numbers.forEach(runCount);
    }
  }

  /* ---- 3b. Scroll-reveal: services cards (staggered `.show`) + fade blocks ---- */
  const observeOnce = (el: Element, cb: () => void, threshold = 0.15) => {
    if (!("IntersectionObserver" in window)) return cb();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            cb();
            io.disconnect();
          }
        }
      },
      { threshold },
    );
    io.observe(el);
    cleanups.push(() => io.disconnect());
  };

  qa(".services-items-container").forEach((container) => {
    const items = Array.from(container.querySelectorAll<HTMLElement>(".single-item"));
    // pre-arm the transition target; reveal is staggered like the theme
    observeOnce(container, () => {
      items.forEach((it, i) => {
        const t = window.setTimeout(() => it.classList.add("show"), i * 120);
        cleanups.push(() => window.clearTimeout(t));
      });
    });
  });

  // Generic fade-on-view blocks that ship at opacity:0 (e.g. section-three intro).
  qa<HTMLElement>("#chr-section-three .content-part").forEach((el) => {
    observeOnce(el, () => {
      el.style.transition = "opacity .8s ease, transform .8s ease";
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  });

  /* ---- 3d. Case-study sub-page parts: fade-on-view reveals (`show`) ----
     main.min.css ships these at opacity 0 / translated; the theme's
     fadeOnView adds `show` once an element's top crosses the viewport bottom
     — including elements already scrolled past (deep links, fast scrolls) —
     so this is a scroll-driven check, not an IntersectionObserver. */
  const revealSelectors = [
    ".content-only-part .content",
    // both the section wrapper and the nested inner image container ship at
    // opacity 0 and reveal independently
    ".full-width-image",
    ".chr-text-and-image-container",
    ".two-column-testimonial-part .two-column-testimonial-container",
    ".text-and-image-group-part .chr-single-text-and-image-container",
    ".quotes-group-part .quotes-content .quote span",
    ".highlight-paragraph-part .content",
  ].join(", ");
  let pendingReveals = qa(revealSelectors);
  const applyReveals = () => {
    if (!pendingReveals.length) return;
    const line = window.innerHeight * 0.95;
    pendingReveals = pendingReveals.filter((el) => {
      if (el.getBoundingClientRect().top >= line) return true;
      el.classList.add("show");
      return false;
    });
  };
  applyReveals();

  /* ---- 4. Hamburger → mobile menu ---- */
  const hamburger = q(".chr-hamburger");
  const menuWrapper = q(".chr-menu-wrapper");
  if (hamburger) {
    const toggleMenu = () => {
      hamburger.classList.toggle("opened");
      menuWrapper?.classList.toggle("opened");
      document.body.classList.toggle("rp-menu-opened");
    };
    on(hamburger, "click", toggleMenu);
  }

  /* ---- 5. Side form: peek reveal + open/close ---- */
  const onMouseMove = (e: MouseEvent) => {
    const peek = e.pageX / window.innerWidth > 0.66;
    document.body.classList.toggle("side-form-peek", peek);
  };
  on(document, "mousemove", onMouseMove as EventListener, { passive: true });

  const openBtn = q(".side-form-open-btn");
  const closeBtn = q(".chr-close-btn");
  const overlay = q(".side-form-black-overlay");
  if (openBtn) on(openBtn, "click", () => document.body.classList.add("side-form-opened"));
  // "Get a Quote" / "Need a Quote?" buttons pop the same quote form.
  qa(".side-form-open-trigger").forEach((btn) =>
    on(btn, "click", () => document.body.classList.add("side-form-opened")),
  );
  const closeSideForm = () => document.body.classList.remove("side-form-opened");
  if (closeBtn) on(closeBtn, "click", closeSideForm);
  if (overlay) on(overlay, "click", closeSideForm);
  on(document, "keydown", ((e: KeyboardEvent) => {
    if (e.key === "Escape") closeSideForm();
  }) as EventListener);

  /* ---- 6. Google review badge reveal after 2s ---- */
  const badge = q(".google-review-image");
  if (badge) {
    const t = window.setTimeout(() => badge.classList.add("show"), 2000);
    cleanups.push(() => window.clearTimeout(t));
  }

  /* ---- 7. Smooth-scroll for in-page anchor links ----
     Handles both "#id" and "/#id" (menu links usable from sub-pages) when the
     link resolves to the current path. */
  const onAnchorClick = (e: Event) => {
    const a = (e.target as HTMLElement)?.closest?.("a[href]") as HTMLAnchorElement | null;
    if (!a) return;
    if (!a.hash || a.pathname !== window.location.pathname) return;
    const id = a.hash;
    if (id === "#") return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
      if (document.body.classList.contains("rp-menu-opened")) {
        document.body.classList.remove("rp-menu-opened");
        hamburger?.classList.remove("opened");
        menuWrapper?.classList.remove("opened");
      }
    }
  };
  on(document, "click", onAnchorClick);

  /* ---- 8. Neutralise form submits (no backend in the clone) ---- */
  qa<HTMLFormElement>("form").forEach((f) =>
    on(f, "submit", (e) => e.preventDefault()),
  );

  return () => cleanups.forEach((c) => c());
}
