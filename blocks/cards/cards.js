export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else {
        div.className = 'cards-card-body';
      }
    });

    const body = li.querySelector('.cards-card-body');
    if (body) {
      const paragraphs = body.querySelectorAll('p');
      if (paragraphs.length > 1) {
        // Multiple paragraphs: last one becomes footer
        const footer = document.createElement('div');
        footer.className = 'cards-card-footer';
        footer.append(paragraphs[paragraphs.length - 1]);
        const arrow = document.createElement('span');
        arrow.className = 'cards-card-arrow';
        arrow.setAttribute('aria-hidden', 'true');
        footer.append(arrow);
        body.after(footer);
      } else {
        // Single paragraph or bare text: split strong title from remaining text
        const strong = body.querySelector('strong');
        if (strong) {
          const titleP = document.createElement('p');
          titleP.className = 'cards-card-title';
          titleP.append(strong.cloneNode(true));

          // Collect remaining text after the strong
          const remaining = [];
          let node = strong.nextSibling;
          while (node) {
            remaining.push(node);
            node = node.nextSibling;
          }
          // Also check parent p siblings
          const parentP = strong.closest('p');
          if (parentP) {
            node = parentP.nextSibling;
            while (node) {
              remaining.push(node);
              node = node.nextSibling;
            }
          }

          const subtitleText = remaining.map((n) => n.textContent).join('').trim();
          body.textContent = '';
          body.append(titleP);

          if (subtitleText) {
            const footer = document.createElement('div');
            footer.className = 'cards-card-footer';
            const footerP = document.createElement('p');
            footerP.textContent = subtitleText;
            footer.append(footerP);
            const arrow = document.createElement('span');
            arrow.className = 'cards-card-arrow';
            arrow.setAttribute('aria-hidden', 'true');
            footer.append(arrow);
            body.after(footer);
          }
        }
      }
    }

    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
