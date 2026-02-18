/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for Audi USA website cleanup
 * Purpose: Remove non-content elements and fix HTML issues
 * Applies to: www.audiusa.com (all templates)
 * Generated: 2026-02-18
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration of https://www.audiusa.com/en/
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove OneTrust cookie consent banner
    // EXTRACTED: Found <div id="onetrust-consent-sdk"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '.onetrust-pc-dark-filter',
      '#onetrust-banner-sdk',
    ]);

    // Remove header navigation (handled by EDS header/footer)
    // EXTRACTED: Found <header> and <nav id="main-navigation"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'header',
      'nav#main-navigation',
    ]);

    // Remove footer (handled by EDS footer block)
    // EXTRACTED: Found <footer> element in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'footer',
    ]);

    // Re-enable scrolling if hidden by modals
    if (element.style.overflow === 'hidden') {
      element.setAttribute('style', 'overflow: scroll;');
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove remaining non-content elements
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
      'source',
    ]);

    // Clean up tracking attributes
    // EXTRACTED: Found data-testid and onclick attributes on multiple elements
    const allElements = element.querySelectorAll('*');
    allElements.forEach((el) => {
      el.removeAttribute('data-testid');
      el.removeAttribute('onclick');
      el.removeAttribute('data-analytics');
    });
  }
}
