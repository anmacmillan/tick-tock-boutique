// The princess doll, built from Igor Galochkin's Princess Character pack
// (shrunk to web size by tools/build_art.py). Every sprite shares one canvas,
// so the layers simply stack.
const ART = 'art/princess/';
export let PARTS = {};
export async function loadPrincess() {
  PARTS = (await (await fetch(ART + 'parts.json')).json()).parts;
}

// drawn back to front
const ORDER = [
  ['cape', 'back'], ['hair', 'back'], ['body', 'single'], ['underwear', 'single'], ['shoes', 'single'], ['dress', 'single'],
  ['gloves', 'single'], ['girdle', 'single'], ['bracelet_left', 'single'], ['bracelet_right', 'single'], ['necklace', 'single'],
  ['cape', 'front'], ['eyes', 'back'], ['irises', 'single'], ['eyes', 'front'], ['eyebrows', 'single'], ['lips', 'single'],
  ['cheeks', 'single'], ['earrings', 'single'], ['hair', 'single'], ['hair', 'front'], ['veil', 'single'], ['hat', 'single'],
  ['in_hand_left', 'single'], ['in_hand_right', 'single'], ['pet', 'single'],
];

// what Margot can buy: [style, name, price in stars]
export const SHOP = {
  dress: [[1, 'Peach blossom gown', 0], [2, 'Emerald gown', 6], [3, 'Golden ball gown', 8], [4, 'Midnight starlight gown', 10]],
  hair: [[1, 'Long braid', 0], [2, 'Dark curls', 0], [3, 'Side ponytail', 4], [4, 'Royal updo', 5], [5, 'Curly updo', 5]],
  hat: [[1, 'Golden tiara', 6], [2, 'Velvet bow', 3], [3, 'Silver tiara', 6], [4, 'Jewelled hairpin', 4]],
  veil: [[1, 'Rose veil', 4], [2, 'Cream veil', 4], [3, 'Lace veil', 5], [4, 'Lilac veil', 5]],
  cape: [[1, 'Royal fur cape', 8], [2, 'Starry velvet cape', 8]],
  shoes: [[1, 'Glass slippers', 0], [2, 'Sparkly heels', 3], [3, 'Butterfly heels', 5]],
  necklace: [[1, 'Ruby necklace', 4], [2, 'Diamond necklace', 5]],
  earrings: [[1, 'Pearl drops', 2], [2, 'Chandelier earrings', 3]],
  bracelets: [[1, 'Bracelets', 2], [2, 'Jewelled bracelets', 3]],
  gloves: [[1, 'Long gloves', 3]],
  girdle: [[1, 'Jewelled belt', 2]],
  in_hand_left: [[1, 'Magic mirror', 4], [2, 'Pink fan', 3], [3, 'Star wand', 4], [4, 'Flower bouquet', 4]],
  in_hand_right: [[1, 'Lace fan', 3], [2, 'Masquerade mask', 4], [3, 'Blue rose', 3], [4, 'Book of spells', 4]],
  pet: [[1, 'Pony', 10], [2, 'Puppy', 8], [3, 'Parrot', 8], [4, 'Kitten', 8]],
  eyes: [[1, 'Sparkly eyes', 0], [2, 'Soft eyes', 0], [3, 'Dreamy eyes', 2]],
  irises: [[1, 'Eye colour', 0]],
  eyebrows: [[1, 'Eyebrows 1', 0], [2, 'Eyebrows 2', 0], [3, 'Eyebrows 3', 1], [4, 'Eyebrows 4', 1], [5, 'Eyebrows 5', 1]],
  lips: [[1, 'Pink smile', 0], [2, 'Sweet smile', 1], [3, 'Rosy lips', 2], [4, 'Happy smile', 2], [5, 'Party lips', 2], [6, 'Glossy lips', 3]],
  cheeks: [[1, 'Blush', 0]],
  body: [[1, 'Skin', 0]],
};
// tap a worn one again to take it off
export const OPTIONAL = new Set(['hat', 'veil', 'cape', 'shoes', 'necklace', 'earrings', 'bracelets', 'gloves', 'girdle', 'in_hand_left', 'in_hand_right', 'pet', 'cheeks']);
export const PCATS = [
  { key: 'gown', label: 'Gowns', icon: '👗', parts: ['dress'] },
  { key: 'hair', label: 'Hair', icon: '💇‍♀️', parts: ['hair'] },
  { key: 'crown', label: 'Crowns & veils', icon: '👑', parts: ['hat', 'veil'] },
  { key: 'cape', label: 'Capes', icon: '🧣', parts: ['cape'] },
  { key: 'shoes', label: 'Shoes', icon: '👠', parts: ['shoes'] },
  { key: 'jewel', label: 'Jewellery', icon: '💎', parts: ['necklace', 'earrings', 'bracelets', 'gloves', 'girdle'] },
  { key: 'hold', label: 'Things to hold', icon: '🪄', parts: ['in_hand_left', 'in_hand_right'] },
  { key: 'pet', label: 'Pets', icon: '🐶', parts: ['pet'] },
  { key: 'face', label: 'Face & make-up', icon: '💄', parts: ['eyes', 'irises', 'eyebrows', 'lips', 'cheeks'] },
  { key: 'skin', label: 'Skin', icon: '✋', parts: ['body'] },
  { key: 'bg', label: 'Places', icon: '🏰', parts: [] },
];
export const DEFAULT_LOOK = { body: [1, 2], dress: [1, 4], hair: [1, 2], shoes: [1, 5], eyes: [1, 1], irises: [1, 5], eyebrows: [1, 1], lips: [1, 1], cheeks: [1, 1] };
export const FREE_ITEMS = Object.entries(SHOP).flatMap(([p, list]) => list.filter(x => x[2] === 0).map(x => `${p}-${x[0]}`));
export const itemName = (part, style) => (SHOP[part].find(x => x[0] === style) || [0, part])[1];
export const itemCost = (part, style) => (SHOP[part].find(x => x[0] === style) || [0, '', 0])[2];

// bracelets are one choice in the shop but two sprites on the doll
const SPRITE_PART = { bracelets: ['bracelet_left', 'bracelet_right'] };
export const thumbURL = (part, style) => `${ART}thumbs/${(SPRITE_PART[part] || [part])[0]}-${style}.webp`;
export const swatches = (part, style) => (PARTS[(SPRITE_PART[part] || [part])[0]] || {})[style]?.swatches || [];

export function princessHTML(look) {
  const v = { ...look, underwear: [1, 1] };
  if (look.bracelets) { v.bracelet_left = look.bracelets; v.bracelet_right = look.bracelets; }
  const imgs = ORDER.map(([part, layer]) => {
    const sel = v[part]; if (!sel) return '';
    const info = PARTS[part] && PARTS[part][sel[0]]; if (!info || !info.layers.includes(layer)) return '';
    return `<img ${part === 'pet' ? 'class="pet" ' : ''}src="${ART}${part}-${sel[0]}_${sel[1]}${layer === 'single' ? '' : '_' + layer}.webp" alt="" draggable="false">`;
  });
  return `<div class="pdoll">${imgs.join('')}</div>`;
}
