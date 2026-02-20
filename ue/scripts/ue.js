import { moveInstrumentation } from './ue-utils.js';

/**
 * cards-featured: block replaces each source div row with a <li> inside a <ul>.
 * Move data-aue-* from the original div rows to the new <li> elements.
 */
function observeCardsFeatured() {
  document.querySelectorAll('div.cards-featured').forEach((block) => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.target === block) {
          const addedUl = [...mutation.addedNodes].find((n) => n.tagName === 'UL');
          if (addedUl) {
            const removedDivs = [...mutation.removedNodes].filter((n) => n.tagName === 'DIV');
            removedDivs.forEach((div, i) => {
              if (addedUl.children[i]) moveInstrumentation(div, addedUl.children[i]);
            });
          }
        }
      });
    });
    observer.observe(block, { childList: true });
  });
}

/**
 * cards-model: block replaces each source div row with a <li> inside a <ul>
 * and prepends a toolbar. Move data-aue-* from div rows to <li> elements.
 */
function observeCardsModel() {
  document.querySelectorAll('div.cards-model').forEach((block) => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.target === block) {
          const addedUl = [...mutation.addedNodes].find((n) => n.tagName === 'UL');
          if (addedUl) {
            const removedDivs = [...mutation.removedNodes].filter((n) => n.tagName === 'DIV');
            removedDivs.forEach((div, i) => {
              if (addedUl.children[i]) moveInstrumentation(div, addedUl.children[i]);
            });
          }
        }
      });
    });
    observer.observe(block, { childList: true });
  });
}

/**
 * Handle image src updates: when UE patches an img src, propagate
 * the new value to all <source> srcset attributes in the parent <picture>.
 */
function setupImagePatchHandler() {
  document.addEventListener('aue:content-patch', (event) => {
    if (event.detail?.patch?.name?.match(/img.*\[src\]/)) {
      const newSrc = event.detail.patch.value;
      const picture = event.srcElement?.querySelector('picture');
      if (picture) {
        picture.querySelectorAll('source').forEach((source) => {
          source.setAttribute('srcset', newSrc);
        });
      }
    }
  });
}

export default function init() {
  observeCardsFeatured();
  observeCardsModel();
  setupImagePatchHandler();
}
