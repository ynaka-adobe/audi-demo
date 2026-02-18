/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-model block
 *
 * Source: https://www.audiusa.com/en/
 * Base Block: cards
 *
 * Block Structure (from markdown example):
 * - Row N: [image | heading + link] (one row per model card)
 *
 * Source HTML Pattern:
 * <div class="LeanMoxxView__Layout-sc-...">
 *   <div class="LeanMoxxView__Card-sc-..."> (repeated for each model)
 *     <img src="..." alt="Model Name" />
 *     <span class="model-name">Model Name</span>
 *     <a href="/en/models/...">Explore</a>
 *   </div>
 * </div>
 *
 * Generated: 2026-02-18
 */
export default function parse(element, { document }) {
  // Find all model card items
  // VALIDATED: Source uses li or div elements inside the LeanMoxxView grid
  const cardItems = Array.from(
    element.querySelectorAll('li[class*="ModelCard"], div[class*="ModelCard"], a[class*="ModelCard"]')
  );

  // Fallback: try to find repeating items with images
  const items = cardItems.length > 0
    ? cardItems
    : Array.from(element.querySelectorAll(':scope > div > div, :scope > ul > li'));

  const cells = [];

  items.forEach((item) => {
    // Extract image
    const img = item.querySelector('img');
    if (!img) return;

    // Extract model name
    // VALIDATED: Source uses span or heading elements for model name
    const modelName = item.querySelector('h2, h3, span[class*="model"], span[class*="Model"], [class*="name"]') ||
                      item.querySelector('span:not(:empty)');

    // Extract link
    const link = item.querySelector('a[href*="models"], a[href*="overview"]') ||
                 item.tagName === 'A' ? item : item.querySelector('a');

    // Build card row: [image | heading + link]
    const textCell = [];
    if (modelName) {
      const strong = document.createElement('strong');
      strong.textContent = modelName.textContent.trim();
      textCell.push(strong);
    }
    if (link && link.href) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = 'Explore';
      textCell.push(a);
    }

    if (textCell.length > 0) {
      cells.push([img, textCell]);
    }
  });

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'Cards-Model', cells });
    element.replaceWith(block);
  }
}
