import { getConfig, getMetadata } from '../../scripts/ak.js';
import { loadFragment } from '../fragment/fragment.js';
import { setColorScheme } from '../section-metadata/section-metadata.js';

const { locale } = getConfig();

const AUDI_RINGS_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="69" height="24" viewBox="0 0 69 24" fill="none" aria-label="Audi" role="img"><path d="M57.0623 21.3142C54.9409 21.3142 52.9856 20.5922 51.422 19.3822C53.0087 17.3448 53.9585 14.7826 53.9585 12C53.9585 9.21768 53.0087 6.65544 51.422 4.61784C52.9856 3.408 54.9409 2.68584 57.0623 2.68584C62.1714 2.68584 66.3281 6.86424 66.3281 12C66.3281 17.136 62.1714 21.3142 57.0623 21.3142ZM36.3802 19.3822C37.9672 17.3448 38.917 14.7826 38.917 12C38.917 9.21768 37.9672 6.65544 36.3804 4.61784C37.9438 3.408 39.8997 2.68584 42.0208 2.68584C44.1421 2.68584 46.0975 3.408 47.6611 4.61784C46.0743 6.65544 45.1246 9.21768 45.1246 12C45.1246 14.7826 46.0743 17.3448 47.6611 19.3822C46.0975 20.5922 44.1421 21.3142 42.0208 21.3142C39.8997 21.3142 37.9438 20.5922 36.3802 19.3822ZM21.3387 19.3822C22.9257 17.3448 23.8754 14.7826 23.8754 12C23.8754 9.21768 22.9257 6.65544 21.3389 4.61784C22.9023 3.408 24.8581 2.68584 26.9792 2.68584C29.1003 2.68584 31.0562 3.408 32.6196 4.61784C31.0328 6.65544 30.083 9.21768 30.083 12C30.083 14.7826 31.0328 17.3448 32.6196 19.3822C31.0562 20.5922 29.1003 21.3142 26.9792 21.3142C24.8581 21.3142 22.9023 20.5922 21.3387 19.3822ZM2.6719 12C2.6719 6.86424 6.82861 2.68584 11.9377 2.68584C14.0588 2.68584 16.0147 3.408 17.578 4.61784C15.9913 6.65544 15.0415 9.21768 15.0415 12C15.0415 14.7826 15.9913 17.3448 17.578 19.3822C16.0147 20.5922 14.0588 21.3142 11.9377 21.3142C6.82861 21.3142 2.6719 17.136 2.6719 12ZM19.4585 17.4305C18.3619 15.9005 17.7134 14.0256 17.7134 12C17.7134 9.97464 18.3619 8.09952 19.4585 6.56952C20.5551 8.09952 21.2035 9.97464 21.2035 12C21.2035 14.0256 20.5551 15.9005 19.4585 17.4305ZM34.5 17.4305C33.4034 15.9005 32.7549 14.0256 32.7549 12C32.7549 9.97464 33.4034 8.09952 34.5 6.56952C35.5966 8.09952 36.2451 9.97464 36.2451 12C36.2451 14.0256 35.5966 15.9005 34.5 17.4305ZM49.5415 17.4305C48.4449 15.9005 47.7965 14.0256 47.7965 12C47.7965 9.97464 48.4449 8.09952 49.5415 6.56952C50.6381 8.09952 51.2866 9.97464 51.2866 12C51.2866 14.0256 50.6381 15.9005 49.5415 17.4305ZM57.0623 0C54.2135 0 51.5958 1.00968 49.5415 2.68968C47.4873 1.00968 44.8696 0 42.0208 0C39.1719 0 36.5542 1.00968 34.5 2.68968C32.4458 1.00968 29.8278 0 26.9792 0C24.1304 0 21.5127 1.00968 19.4585 2.68968C17.4042 1.00968 14.7863 0 11.9377 0C5.35526 0 0 5.3832 0 12C0 18.617 5.35526 24 11.9377 24C14.7863 24 17.4042 22.9906 19.4585 21.3103C21.5127 22.9906 24.1304 24 26.9792 24C29.8278 24 32.4458 22.9906 34.5 21.3103C36.5542 22.9906 39.1719 24 42.0208 24C44.8696 24 47.4873 22.9906 49.5415 21.3103C51.5958 22.9906 54.2135 24 57.0623 24C63.6447 24 69 18.617 69 12C69 5.3832 63.6447 0 57.0623 0Z" fill="white"/></svg>`;

const HEADER_PATH = '/fragments/nav/header';
const HEADER_ACTIONS = [
  '/tools/widgets/scheme',
  '/tools/widgets/language',
  '/tools/widgets/toggle',
];

function closeAllMenus() {
  const openMenus = document.body.querySelectorAll('header .is-open');
  for (const openMenu of openMenus) {
    openMenu.classList.remove('is-open');
  }
}

function docClose(e) {
  if (e.target.closest('header')) return;
  closeAllMenus();
}

function toggleMenu(menu) {
  const isOpen = menu.classList.contains('is-open');
  closeAllMenus();
  if (isOpen) {
    document.removeEventListener('click', docClose);
    return;
  }

  // Setup the global close event
  document.addEventListener('click', docClose);
  menu.classList.add('is-open');
}

function decorateLanguage(btn) {
  const section = btn.closest('.section');
  btn.addEventListener('click', async () => {
    let menu = section.querySelector('.language.menu');
    if (!menu) {
      const content = document.createElement('div');
      content.classList.add('block-content');
      const fragment = await loadFragment(`${locale.prefix}${HEADER_PATH}/languages`);
      menu = document.createElement('div');
      menu.className = 'language menu';
      menu.append(fragment);
      content.append(menu);
      section.append(content);
    }
    toggleMenu(section);
  });
}

function decorateScheme(btn) {
  btn.addEventListener('click', async () => {
    const { body } = document;

    let currPref = localStorage.getItem('color-scheme');
    if (!currPref) {
      currPref = matchMedia('(prefers-color-scheme: dark)')
        .matches ? 'dark-scheme' : 'light-scheme';
    }

    const theme = currPref === 'dark-scheme'
      ? { add: 'light-scheme', remove: 'dark-scheme' }
      : { add: 'dark-scheme', remove: 'light-scheme' };

    body.classList.remove(theme.remove);
    body.classList.add(theme.add);
    localStorage.setItem('color-scheme', theme.add);
    // Re-calculatie section schemes
    const sections = document.querySelectorAll('.section');
    for (const section of sections) {
      setColorScheme(section);
    }
  });
}

function decorateNavToggle(btn) {
  btn.addEventListener('click', () => {
    const header = document.body.querySelector('header');
    if (header) header.classList.toggle('is-mobile-open');
  });
}

async function decorateAction(header, pattern) {
  const link = header.querySelector(`[href*="${pattern}"]`);
  if (!link) return;

  const icon = link.querySelector('.icon');
  const text = link.textContent;
  const btn = document.createElement('button');
  if (icon) btn.append(icon);
  if (text) {
    const textSpan = document.createElement('span');
    textSpan.className = 'text';
    textSpan.textContent = text;
    btn.append(textSpan);
  }
  const wrapper = document.createElement('div');
  wrapper.className = `action-wrapper ${icon.classList[1].replace('icon-', '')}`;
  wrapper.append(btn);
  link.parentElement.parentElement.replaceChild(wrapper, link.parentElement);

  if (pattern === '/tools/widgets/language') decorateLanguage(btn);
  if (pattern === '/tools/widgets/scheme') decorateScheme(btn);
  if (pattern === '/tools/widgets/toggle') decorateNavToggle(btn);
}

function decorateMenu() {
  // TODO: finish single menu support
  return null;
}

function decorateMegaMenu(li) {
  const menu = li.querySelector('.fragment-content');
  if (!menu) return null;
  const wrapper = document.createElement('div');
  wrapper.className = 'mega-menu';
  wrapper.append(menu);
  li.append(wrapper);
  return wrapper;
}

function decorateNavItem(li) {
  li.classList.add('main-nav-item');
  const link = li.querySelector(':scope > p > a');
  if (link) link.classList.add('main-nav-link');
  const menu = decorateMegaMenu(li) || decorateMenu(li);
  if (!(menu || link)) return;
  link.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMenu(li);
  });
}

function decorateBrandSection(section) {
  section.classList.add('brand-section');

  let brandLink = section.querySelector('a');
  if (!brandLink) {
    const p = document.createElement('p');
    brandLink = document.createElement('a');
    brandLink.href = `${locale.prefix}/`;
    p.append(brandLink);
    const defaultContent = section.querySelector('.default-content') || section;
    defaultContent.prepend(p);
  }

  // Remove any existing icon-logo span to avoid duplicates
  brandLink.querySelector('.icon-logo')?.remove();

  // Inject the Audi rings SVG directly, bypassing any content icon reference
  const logoSpan = document.createElement('span');
  logoSpan.className = 'icon icon-logo';
  logoSpan.innerHTML = AUDI_RINGS_SVG;
  brandLink.prepend(logoSpan);

  // Hide the link text visually
  const textNode = [...brandLink.childNodes].find((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
  if (textNode) {
    const span = document.createElement('span');
    span.className = 'brand-text';
    span.append(textNode);
    brandLink.append(span);
  }
}

function decorateNavSection(section) {
  section.classList.add('main-nav-section');
  const navContent = section.querySelector('.default-content');
  const navList = section.querySelector('ul');
  if (!navList) return;
  navList.classList.add('main-nav-list');

  const nav = document.createElement('nav');
  nav.append(navList);
  navContent.append(nav);

  const mainNavItems = section.querySelectorAll('nav > ul > li');
  for (const navItem of mainNavItems) {
    decorateNavItem(navItem);
  }
}

async function decorateActionSection(section) {
  section.classList.add('actions-section');
}

async function decorateHeader(fragment) {
  const sections = fragment.querySelectorAll(':scope > .section');
  if (sections[0]) decorateBrandSection(sections[0]);
  if (sections[1]) decorateNavSection(sections[1]);
  if (sections[2]) decorateActionSection(sections[2]);

  for (const pattern of HEADER_ACTIONS) {
    decorateAction(fragment, pattern);
  }
}

/**
 * loads and decorates the header
 * @param {Element} el The header element
 */
export default async function init(el) {
  const headerMeta = getMetadata('header');
  const path = headerMeta || HEADER_PATH;
  try {
    const fragment = await loadFragment(`${locale.prefix}${path}`);
    fragment.classList.add('header-content');
    await decorateHeader(fragment);
    el.append(fragment);
  } catch (e) {
    throw Error(e);
  }
}
