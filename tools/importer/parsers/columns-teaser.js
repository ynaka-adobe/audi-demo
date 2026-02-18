/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-teaser block
 *
 * Source: https://www.audiusa.com/en/
 * Base Block: columns
 *
 * Block Structure (from markdown example):
 * - Row 1: [image | heading + subheading + CTAs]
 *
 * Source HTML Pattern:
 * <div class="BasicTeaser__StyledContainer-sc-...">
 *   <div class="BasicTeaser__StyledMedia-sc-... BasicTeaser__StyledImage-sc-...">
 *     <img src="..." alt="..." />
 *   </div>
 *   <div class="BasicTeaser__StyledTextArea-sc-...">
 *     <h2>Heading</h2>
 *     <h3>Subheading</h3>
 *     <a>CTA 1</a>
 *     <a>CTA 2</a>
 *   </div>
 * </div>
 *
 * Generated: 2026-02-18
 */
export default function parse(element, { document }) {
  // Extract image
  // VALIDATED: Source uses img inside BasicTeaser__StyledMedia/StyledImage container
  const imgContainer = element.querySelector('div[class*="StyledMedia"], div[class*="StyledImage"]');
  const img = imgContainer
    ? imgContainer.querySelector('img')
    : element.querySelector('img');

  // Extract text area
  // VALIDATED: Source uses div with class BasicTeaser__StyledTextArea
  const textArea = element.querySelector('div[class*="StyledTextArea"], div[class*="TextArea"]');

  // Extract heading
  const heading = textArea
    ? textArea.querySelector('h2, h1, [class*="heading"]')
    : element.querySelector('h2, h1');

  // Extract subheading
  const subheading = textArea
    ? textArea.querySelector('h3, p[class*="sub"], [class*="subheading"]')
    : element.querySelector('h3');

  // Extract CTA links
  const ctaLinks = Array.from(
    (textArea || element).querySelectorAll('a[class*="cta"], a[class*="button"], a[class*="Button"], a[href]')
  ).filter((a) => a.textContent.trim().length > 0);

  // Build cells: single row with [image | text content]
  const cells = [];

  const imageCell = img ? [img] : [];

  const textCell = [];
  if (heading) textCell.push(heading);
  if (subheading) textCell.push(subheading);
  textCell.push(...ctaLinks);

  if (imageCell.length > 0 || textCell.length > 0) {
    cells.push([imageCell, textCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns-Teaser', cells });
  element.replaceWith(block);
}
