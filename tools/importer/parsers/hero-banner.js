/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-banner block
 *
 * Source: https://www.audiusa.com/en/
 * Base Block: hero
 *
 * Block Structure (from markdown example):
 * - Row 1: Background image (optional)
 * - Row 2: Content (heading, subheading, CTAs)
 *
 * Source HTML Pattern:
 * <div class="StageContainer__StageContainerWrap-sc-...">
 *   <div class="StageContainer__Block-sc-...">
 *     <div class="StageContainer__ShowOnDesktop-sc-...">
 *       <img src="..." /> (background image)
 *     </div>
 *     <div> (content overlay)
 *       <h1>Heading</h1>
 *       <p>Subheading</p>
 *       <a>CTA</a>
 *     </div>
 *   </div>
 * </div>
 *
 * Generated: 2026-02-18
 */
export default function parse(element, { document }) {
  // Extract background image
  // VALIDATED: Source HTML uses img inside StageContainer__ShowOnDesktop
  const bgImage = element.querySelector('img[class*="StageImageStyle"], img[class*="Stage"], picture img') ||
                  element.querySelector('img');

  // Extract heading
  // VALIDATED: Source HTML uses h1 elements within stage content
  const heading = element.querySelector('h1') ||
                  element.querySelector('h2') ||
                  element.querySelector('[class*="heading"], [class*="title"]');

  // Extract subheading/description
  // VALIDATED: Source HTML uses p elements for subheading text
  const description = element.querySelector('p:not(:has(a))') ||
                      element.querySelector('[class*="subtitle"], [class*="description"]');

  // Extract CTA links
  // VALIDATED: Source HTML uses <a> elements with class containing "cta" or "button"
  const ctaLinks = Array.from(
    element.querySelectorAll('a[class*="cta"], a[class*="button"], a[class*="Button"], a[href]')
  ).filter((a) => a.textContent.trim().length > 0);

  // Build cells array matching hero block structure
  const cells = [];

  // Row 1: Background image (optional)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Content (heading, subheading, CTAs)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  contentCell.push(...ctaLinks);

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero-Banner', cells });
  element.replaceWith(block);
}
