// String surgery for the auto-generated theme markup in `src/sections/`.
//
// Those section blobs are injected verbatim via dangerouslySetInnerHTML, so the
// per-route variants (the ad landing page, the trimmed main site) are derived
// from the extraction by exact-text edits rather than kept as second hand-edited
// copies that would silently drift the next time the extractor is re-run.

const preview = (s: string) => `"${s.slice(0, 60).replace(/\s+/g, " ")}…"`;

/**
 * Replaces `find` with `replace`, throwing unless `find` occurs exactly once.
 * The derived modules run these at import time, so a re-extraction that reworded
 * the source copy fails the build loudly instead of quietly shipping the
 * original wording.
 */
export function replaceOnce(html: string, find: string, replace: string): string {
  const at = html.indexOf(find);
  if (at === -1) throw new Error(`replaceOnce: no match for ${preview(find)}`);
  if (html.indexOf(find, at + find.length) !== -1) {
    throw new Error(`replaceOnce: more than one match for ${preview(find)}`);
  }
  return html.slice(0, at) + replace + html.slice(at + find.length);
}

/**
 * Drops the `<div>` opened by `openTag` along with everything up to its matching
 * `</div>`. With `marker`, the block removed is the last one opened before that
 * text — the way to name an element the markup gives no unique class of its own.
 */
export function removeBlock(html: string, openTag: string, marker?: string): string {
  let start: number;
  if (marker === undefined) {
    start = html.indexOf(openTag);
    if (start === -1) throw new Error(`removeBlock: no ${preview(openTag)}`);
    if (html.indexOf(openTag, start + openTag.length) !== -1) {
      throw new Error(`removeBlock: more than one ${preview(openTag)}`);
    }
  } else {
    const at = html.indexOf(marker);
    if (at === -1) throw new Error(`removeBlock: no match for ${preview(marker)}`);
    start = html.lastIndexOf(openTag, at);
    if (start === -1) {
      throw new Error(`removeBlock: no ${preview(openTag)} before ${preview(marker)}`);
    }
  }

  const tags = /<div\b|<\/div>/g;
  tags.lastIndex = start;
  let depth = 0;
  for (let m = tags.exec(html); m; m = tags.exec(html)) {
    depth += m[0] === "</div>" ? -1 : 1;
    if (depth === 0) return html.slice(0, start) + html.slice(m.index + m[0].length);
  }
  throw new Error(`removeBlock: unbalanced markup after ${preview(openTag)}`);
}

/**
 * Moves the extraction's own internal links under `base` (e.g. `/landing-page`)
 * so a duplicated route tree stays self-contained. Only the paths that resolve
 * to real routes are rewritten; the theme's many links to pages that were never
 * ported (`/services/…`, `/portfolio/`) 404 either way and are left alone.
 */
export function rebaseLinks(html: string, base: string): string {
  return html
    .replace(/href="\/"/g, `href="${base}"`)
    .replace(/href="\/#/g, `href="${base}#`)
    .replace(/href="\/contact\//g, `href="${base}/contact/`)
    .replace(/href="\/case-study\//g, `href="${base}/case-study/`);
}

/**
 * Rebases the hidden `page-url` the enquiry forms email through, so leads from
 * the ad tree are distinguishable from leads off the main site.
 */
export function rebasePageUrl(html: string, base: string): string {
  return html.replace(
    /value="(\/[^"]*)" id="((?:ict-)?page-url)"/g,
    (_m, path: string, id: string) => `value="${base}${path === "/" ? "" : path}" id="${id}"`,
  );
}
