/**
 * Moves all the attributes from one element to another.
 * @param {Element} from
 * @param {Element} to
 * @param {string[]} [attributes] - specific attributes to move; defaults to all
 */
export function moveAttributes(from, to, attributes) {
  const attrs = attributes ?? [...from.attributes].map(({ nodeName }) => nodeName);
  attrs.forEach((attr) => {
    const value = from.getAttribute(attr);
    if (value) {
      to.setAttribute(attr, value);
      from.removeAttribute(attr);
    }
  });
}

/**
 * Moves UE instrumentation attributes (data-aue-* and data-richtext-*) from one element to another.
 * @param {Element} from
 * @param {Element} to
 */
export function moveInstrumentation(from, to) {
  moveAttributes(
    from,
    to,
    [...from.attributes]
      .map(({ nodeName }) => nodeName)
      .filter((attr) => attr.startsWith('data-aue-') || attr.startsWith('data-richtext-')),
  );
}
