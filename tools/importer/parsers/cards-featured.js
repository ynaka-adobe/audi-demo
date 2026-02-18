/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-featured block
 *
 * Source: https://www.audiusa.com/en/
 * Base Block: cards
 *
 * Block Structure (from markdown example):
 * - Row N: [image | heading + CTA link] (one row per featured card)
 *
 * Source HTML Pattern:
 * <div class="styles__StyledContentTileContainer-sc-...">
 *   <div class="styles__StyledContentTileImage-sc-...">
 *     <img src="..." alt="..." />
 *   </div>
 *   <div class="styles__StyledContentTileContent-sc-...">
 *     <h2>Model Name</h2>
 *     <a href="/en/models/...">Explore Model</a>
 *   </div>
 * </div>
 *
 * Generated: 2026-02-18
 */
export default function parse(element, { document }) {
  // Extract image
  // VALIDATED: Source uses img inside StyledContentTileImage container
  const img = element.querySelector('img[class*="Image"], picture img') ||
              element.querySelector('img');

  // Extract heading
  // VALIDATED: Source uses h2 or span for tile headings
  const heading = element.querySelector('h2, h3, [class*="heading"], [class*="Heading"]') ||
                  element.querySelector('span[class*="title"], span[class*="Title"]');

  // Extract CTA link
  // VALIDATED: Source uses <a> elements for tile CTAs
  const ctaLink = element.querySelector('a[class*="cta"], a[class*="button"], a[class*="Button"]') ||
                  element.querySelector('a[href]');

  // Build cells array for a single card row
  const cells = [];

  if (img) {
    const textCell = [];

    if (heading) {
      const strong = document.createElement('strong');
      strong.textContent = heading.textContent.trim();
      textCell.push(strong);
    }

    if (ctaLink) {
      const a = document.createElement('a');
      a.href = ctaLink.href;
      a.textContent = ctaLink.textContent.trim();
      textCell.push(a);
    }

    cells.push([img, textCell]);
  }

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Featured', cells });
    element.replaceWith(block);
  }
}
