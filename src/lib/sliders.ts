// Initialises the Chromatix Slick carousels with the exact options ported from
// the live theme's home.min.js. jQuery + Slick are dynamically imported so they
// only load in the browser. The Slick CSS ships inside the ported chromatix.css.

type Cleanup = () => void;

export async function initSliders(): Promise<Cleanup> {
  if (typeof window === "undefined") return () => {};

  const jqMod = await import("jquery");
  const $ = (jqMod.default || jqMod) as JQueryStatic;
  // Slick attaches itself to the global jQuery at import time.
  (window as unknown as { jQuery: JQueryStatic; $: JQueryStatic }).jQuery = $;
  (window as unknown as { jQuery: JQueryStatic; $: JQueryStatic }).$ = $;
  // @ts-expect-error — slick-carousel has no types export, it patches jQuery.fn
  await import("slick-carousel/slick/slick.js");

  const inited: JQuery[] = [];

  // 1. Testimonials — fade grid, 2 rows x 3 per row (→ 2 per row < 1240px).
  const testimonials = $(".testimonial-video-slider");
  if (testimonials.length) {
    testimonials.slick({
      arrows: true,
      dots: false,
      infinite: true,
      cssEase: "linear",
      fade: true,
      slidesToShow: 1,
      adaptiveHeight: true,
      rows: 2,
      slidesPerRow: 3,
      responsive: [
        { breakpoint: 1240, settings: { slidesPerRow: 2 } },
        { breakpoint: 768, settings: { slidesPerRow: 1 } },
      ],
    });
    inited.push(testimonials);
  }

  // 2. Partner logo rows — continuous marquee; middle row runs rtl (dir attr).
  $(".partners-list").each((_i, el) => {
    const $el = $(el);
    const rtl = $el.attr("dir") === "rtl";
    $el.slick({
      dots: false,
      infinite: true,
      arrows: false,
      cssEase: "linear",
      autoplay: true,
      speed: 8000,
      slidesToShow: 7,
      slidesToScroll: 1,
      autoplaySpeed: 0,
      swipeToSlide: false,
      pauseOnHover: false,
      pauseOnFocus: false,
      rtl,
      responsive: [
        { breakpoint: 1560, settings: { slidesToShow: 6 } },
        { breakpoint: 1430, settings: { slidesToShow: 5 } },
        { breakpoint: 900, settings: { slidesToShow: 4 } },
        { breakpoint: 767, settings: { slidesToShow: 3 } },
        { breakpoint: 500, settings: { slidesToShow: 2 } },
      ],
    });
    inited.push($el);
  });

  // 3. FAQ list — paged 2-up with dots; each question is a click-accordion.
  $(".faq-section .faq-list").each((_i, el) => {
    const $el = $(el);
    $el.slick({
      arrows: false,
      dots: true,
      infinite: false,
      cssEase: "linear",
      slidesToShow: 2,
      slidesToScroll: 2,
      adaptiveHeight: true,
      responsive: [{ breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } }],
    });
    inited.push($el);
  });

  // FAQ accordion — start closed, slideToggle answer, recompute Slick height.
  const $faqLists = $(".faq-section .faq-list");
  $faqLists.find(".single-faq .answer").hide();
  const onQuestion = function (this: HTMLElement) {
    const $q = $(this);
    $q.toggleClass("opened");
    $q.next(".answer").slideToggle(250, () => $faqLists.slick("setPosition"));
  };
  $faqLists.on("click", ".single-faq .question", onQuestion);

  return () => {
    $faqLists.off("click", ".single-faq .question", onQuestion);
    for (const $s of inited) {
      try {
        $s.slick("unslick");
      } catch {
        /* already torn down */
      }
    }
  };
}
