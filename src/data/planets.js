// Central content model for every stop on the Voyager journey.
// Physical/structural data below is language-neutral (orbits, scale,
// textures, colors). All translatable text (names, descriptions, stats
// copy, mission notes, etc.) lives in ./planetsContent.js, keyed by
// language and then by body id. Use getBodies(lang) to get the same
// shape the rest of the app expects, merged for the requested language.
//
// Real texture maps are loaded at runtime from a public CDN mirror
// (jsdelivr -> GitHub) of the open-source jeromeetienne/threex.planets
// asset set. No binary assets are bundled in this repo; the browser
// fetches them directly when the app runs.
import { planetsContent } from './planetsContent.js';

export const TEX = 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images';

const BASE_BODIES = [
  {
    id: 'sun',
    order: 0,
    color: '#ffb545',
    emissive: '#ff8a00',
    isStar: true,
    renderScale: 2.4,
    orbitRadius: 0,
    orbitSpeed: 0,
    axialTilt: 7.25,
    texture: `${TEX}/sunmap.jpg`,
  },
  {
    id: 'mercury',
    order: 1,
    color: '#9b9b93',
    renderScale: 0.38,
    orbitRadius: 6,
    orbitSpeed: 0.48,
    axialTilt: 0.03,
    texture: `${TEX}/mercurymap.jpg`,
    bumpTexture: `${TEX}/mercurybump.jpg`,
    surfaceStyle: 'rocky-harsh',
  },
  {
    id: 'venus',
    order: 2,
    color: '#e8c27a',
    renderScale: 0.6,
    orbitRadius: 8.5,
    orbitSpeed: 0.35,
    axialTilt: 2.64,
    texture: `${TEX}/venusmap.jpg`,
    bumpTexture: `${TEX}/venusbump.jpg`,
    surfaceStyle: 'thick-yellow-atmosphere',
  },
  {
    id: 'earth',
    order: 3,
    color: '#2a6bd6',
    renderScale: 0.64,
    orbitRadius: 11.5,
    orbitSpeed: 0.29,
    axialTilt: 23.44,
    texture: `${TEX}/earthmap1k.jpg`,
    bumpTexture: `${TEX}/earthbump1k.jpg`,
    cloudTexture: `${TEX}/earthcloudmap.jpg`,
    surfaceStyle: 'earth-clouds-lights',
  },
  {
    id: 'moon',
    order: 3.5,
    color: '#c9c9c9',
    renderScale: 0.27,
    orbitRadius: 1.7,
    orbitSpeed: 2.4,
    axialTilt: 6.68,
    parentId: 'earth',
    isSatellite: true,
    texture: `${TEX}/moonmap1k.jpg`,
    bumpTexture: `${TEX}/moonbump1k.jpg`,
    surfaceStyle: 'cratered-grey',
  },
  {
    id: 'mars',
    order: 4,
    color: '#c1440e',
    renderScale: 0.42,
    orbitRadius: 15,
    orbitSpeed: 0.24,
    axialTilt: 25.19,
    texture: `${TEX}/marsmap1k.jpg`,
    bumpTexture: `${TEX}/marsbump1k.jpg`,
    surfaceStyle: 'red-dust',
  },
  {
    id: 'jupiter',
    order: 5,
    color: '#d8ae82',
    renderScale: 1.5,
    orbitRadius: 23,
    orbitSpeed: 0.13,
    axialTilt: 3.13,
    texture: `${TEX}/jupitermap.jpg`,
    surfaceStyle: 'great-red-spot',
  },
  {
    id: 'saturn',
    order: 6,
    color: '#e3c99a',
    hasRings: true,
    renderScale: 1.3,
    orbitRadius: 29,
    orbitSpeed: 0.097,
    axialTilt: 26.73,
    texture: `${TEX}/saturnmap.jpg`,
    ringTexture: `${TEX}/saturnringcolor.jpg`,
  },
  {
    id: 'uranus',
    order: 7,
    color: '#8fd8d8',
    renderScale: 0.95,
    orbitRadius: 34,
    orbitSpeed: 0.068,
    axialTilt: 97.77,
    hasRings: true,
    texture: `${TEX}/uranusmap.jpg`,
    ringTexture: `${TEX}/uranusringcolour.jpg`,
  },
  {
    id: 'neptune',
    order: 8,
    color: '#3b5fd8',
    renderScale: 0.93,
    orbitRadius: 39,
    orbitSpeed: 0.054,
    axialTilt: 28.32,
    texture: `${TEX}/neptunemap.jpg`,
    surfaceStyle: 'blue-storm',
  },
];

export function getBodies(lang = 'en') {
  const content = planetsContent[lang] || planetsContent.en;
  return BASE_BODIES.map((base) => ({ ...base, ...content[base.id] }));
}

export const getBodyById = (id, lang = 'en') => getBodies(lang).find((b) => b.id === id);
