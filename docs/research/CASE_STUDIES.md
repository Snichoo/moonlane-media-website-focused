# Case-Study Pages (Portfolio Detail Clones)

Eight case-study pages from chromatix.com.au, cloned as content variants of a
single shared template and rebranded to Moonlane Media. Slugs:
`repurpose-it`, `cyc`, `neo`, `rylock`, `boa`, `powerplus-energy`,
`ydl-stone`, `bowens` — served at `/case-study/<slug>` (SSG via
`generateStaticParams`, unknown slugs 404).

## Page topology (identical template across all 8)

```
div.chr-content
  header.chr-header#chr-header          ← shared markup (S.header) minus:
                                           `home` state, current-menu underline,
                                           header phone (original sub-pages omit it)
  section.side-form-section              ← shared quote side-form (S.sideForm)
  div.chr-content.clearfix
    div.sub-page.case-study-page         ← per-page extracted innerHTML
      .chr-banner                        ← title + banner image + accent blob
      .single-part …                     ← mix of: text-and-image-part (L/R),
                                           full-width-image, service-list-part,
                                           quotes-group-part, content-only-part,
                                           logo-list-part, two-column-testimonial-part
  footer.chr-footer                      ← shared contact footer (S.footer)
  div.mobile-bottom-button-wrapper       ← shared mobile CTA (S.mobileButton)
```

## Interaction model

Static content with **scroll-driven fade-on-view reveals** — no sliders, no
accordions, no magnific popups on these pages. `main.min.css` ships several
parts at `opacity: 0` (translated) and the original theme's `fadeOnView`
jQuery helper adds `.show` as each enters the viewport. Reimplemented with
IntersectionObserver in `src/lib/behaviors.ts` (section 3d) for:
`.content-only-part .content`, `.single-part.full-width-image`,
`.chr-text-and-image-container`, `.two-column-testimonial-container`,
`.chr-single-text-and-image-container`, `.quotes-group-part .quote span`,
`.highlight-paragraph-part .content`. The service-list-part reuses the
homepage's staggered `.single-item.show` reveal (behaviors section 3b).

## Styling

- `src/styles/chromatix-main.css` — ported sitewide `main.min.css` v1.50.0
  (assets rewritten to the local `/wp-content` mirror). Imported **before**
  `chromatix.css` in `src/app/layout.tsx` so the verified homepage rules keep
  precedence; sub-page selectors don't exist in the home stylesheet.
- **Per-page brand accent**: WordPress emits an inline `<style>` block per
  case study coloring the banner blob, quote/testimonial backdrops and list
  bullets. Captured verbatim into each page's `css` field and rendered as a
  `<style>` tag by `CaseStudyPage`. Accents: repurpose-it `#96ca30`,
  cyc `#025c7a`, neo `#9ab6ef`, rylock `#c72730`, boa `#d6ddba`,
  powerplus-energy `#b64403`, ydl-stone `#e2c879`, bowens `#0d57a5`.

## Pipeline (auditable / re-runnable)

1. Raw page HTML snapshots live in the session scratchpad (`cs-<slug>.html`).
2. `scripts/extract-case-studies.mjs` → `src/sections/case-studies.ts`
   (cleaning: un-lazy media, local asset paths, scripts stripped, forms
   neutralised; plus the Moonlane Media rebrand: name, Melbourne→Australia(n),
   contact details, relative links — same rules as the homepage).
3. `scripts/download-case-study-assets.mjs` → mirrors every `/wp-content`
   asset referenced by the extracted markup + `chromatix-main.css` into
   `public/` (390 refs, all resolved).

## Known gaps

- Nav links to unclonable pages (`/portfolio/`, `/about/`, `/services/`,
  `/blog/`, `/careers/`, `/contact/`, "VIEW LIVE SITE" external links) are
  left as-is and 404 locally / go off-site by design.
- Sub-page white logo variant is the single Moonlane logo knocked out to
  white via CSS filter (only one logo file exists).
