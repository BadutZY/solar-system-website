// Data for the Gallery page.
// Each item represents one photo in public/gallery/. To add a new
// photo: drop the image file into public/gallery/, then add one new
// entry to BASE_ITEMS below plus matching text in ./galleryContent.js.
//
// Category keys are canonical (language-neutral) and map to translated
// labels via uiText.gallery.categories in ../i18n/uiText.js.

import { galleryContent } from './galleryContent.js';

const BASE_ITEMS = [
  { id: 'matahari', categoryKey: 'star', color: '#ffb545', image: '/gallery/matahari.jpg' },
  { id: 'merkurius', categoryKey: 'planet', color: '#9b9b93', image: '/gallery/merkurius.jpg' },
  { id: 'venus', categoryKey: 'planet', color: '#e8c27a', image: '/gallery/venus.jpg' },
  { id: 'bumi', categoryKey: 'planet', color: '#2a6bd6', image: '/gallery/bumi.jfif' },
  { id: 'mars', categoryKey: 'planet', color: '#c1440e', image: '/gallery/mars.jpg' },
  { id: 'jupiter', categoryKey: 'planet', color: '#d8ae82', image: '/gallery/jupiter.jpg' },
  { id: 'saturnus', categoryKey: 'planet', color: '#e3c99a', image: '/gallery/saturnus.webp' },
  { id: 'uranus', categoryKey: 'planet', color: '#8fd8d8', image: '/gallery/uranus.jpg' },
  { id: 'neptunus', categoryKey: 'planet', color: '#3b5fd8', image: '/gallery/neptunus.jpg' },
  { id: 'pluto', categoryKey: 'dwarfPlanet', color: '#c9b8a3', image: '/gallery/pluto.jpg' },
  { id: 'blackhole', categoryKey: 'phenomenon', color: '#8a5cf6', image: '/gallery/blackhole.webp' },
];

export const CATEGORY_KEYS = ['all', 'star', 'planet', 'dwarfPlanet', 'phenomenon'];

export function getGalleryItems(lang = 'en') {
  const content = galleryContent[lang] || galleryContent.en;
  return BASE_ITEMS.map((base) => ({ ...base, ...content[base.id], category: base.categoryKey }));
}

export function getGalleryCategories(t) {
  return CATEGORY_KEYS.map((key) => ({ key, label: t(`gallery.categories.${key}`) }));
}
