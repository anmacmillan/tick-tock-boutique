// The doll and her wardrobe, drawn in SVG on a 300 x 500 canvas.
// Every item has a category, a price in stars (0 = free) and a draw function.

export function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const c = v => Math.max(0, Math.min(255, Math.round(v * f)));
  return '#' + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => c(v).toString(16).padStart(2, '0')).join('');
}
const sparkles = (pts, col = '#fff') => pts.map(([x, y, r = 3]) =>
  `<path d="M${x} ${y - r * 2}L${x + r * .6} ${y - r * .6}L${x + r * 2} ${y}L${x + r * .6} ${y + r * .6}L${x} ${y + r * 2}L${x - r * .6} ${y + r * .6}L${x - r * 2} ${y}L${x - r * .6} ${y - r * .6}Z" fill="${col}" opacity=".9"/>`).join('');
const TEE = 'M120 200 Q150 191 180 200 L194 236 L180 241 L177 302 L123 302 L120 241 L106 236 Z';

// ---------- categories, in the order they show in the wardrobe ----------
export const CATS = [
  { key: 'dress', label: 'Dresses', icon: '👗', optional: true },
  { key: 'top', label: 'Tops', icon: '👚' },
  { key: 'bottom', label: 'Skirts & trousers', icon: '🩳' },
  { key: 'shoes', label: 'Shoes', icon: '👟', optional: true },
  { key: 'hair', label: 'Hairstyles', icon: '💇‍♀️' },
  { key: 'hairColor', label: 'Hair colour', icon: '🎨' },
  { key: 'hat', label: 'Hats & crowns', icon: '👑', optional: true },
  { key: 'wings', label: 'Wings', icon: '🧚', optional: true },
  { key: 'acc', label: 'Things to hold', icon: '🪄', optional: true },
  { key: 'eyes', label: 'Eyes', icon: '👀' },
  { key: 'makeup', label: 'Make-up', icon: '💄', multi: true },
  { key: 'skin', label: 'Skin', icon: '✋' },
  { key: 'bg', label: 'Places', icon: '🏰' },
];

// ---------- the items ----------
export const ITEMS = [
  // tops
  { id: 'tee', cat: 'top', name: 'T-shirt', cost: 0, draw: () => `<path d="${TEE}" fill="#7ec8ff"/><path d="M138 197 Q150 210 162 197" fill="none" stroke="#5aa8e6" stroke-width="3"/>` },
  { id: 'stripes', cat: 'top', name: 'Stripy top', cost: 3, draw: () => `<clipPath id="ct"><path d="${TEE}"/></clipPath><path d="${TEE}" fill="#fff"/><g clip-path="url(#ct)">${[205, 225, 245, 265, 285].map(y => `<rect x="100" y="${y}" width="100" height="10" fill="#ff6b9a"/>`).join('')}</g>` },
  { id: 'heart', cat: 'top', name: 'Heart top', cost: 4, draw: () => `<path d="${TEE}" fill="#ffe14d"/><path d="M150 262 C130 246 136 228 150 238 C164 228 170 246 150 262Z" fill="#ff4d7d"/>` },
  { id: 'sparkle', cat: 'top', name: 'Sparkly top', cost: 5, draw: () => `<path d="${TEE}" fill="#b07cff"/>${sparkles([[134, 225], [164, 240, 4], [146, 268], [170, 282, 2.5], [128, 288, 2.5]])}` },
  { id: 'hoodie', cat: 'top', name: 'Cosy hoodie', cost: 6, draw: () => `<path d="M118 200 Q150 186 182 200 L198 290 L184 294 L180 306 L120 306 L116 294 L102 290 Z" fill="#ff8f6b"/><path d="M128 198 Q150 222 172 198" fill="#e8734f"/><rect x="132" y="262" width="36" height="22" rx="8" fill="#e8734f"/><path d="M144 206 L142 232 M156 206 L158 232" stroke="#fff" stroke-width="2.5"/>` },

  // bottoms
  { id: 'shorts', cat: 'bottom', name: 'Shorts', cost: 0, draw: () => `<path d="M123 296 L177 296 L180 338 L153 338 L150 318 L147 338 L120 338 Z" fill="#4a6fd1"/>` },
  { id: 'skirt', cat: 'bottom', name: 'Twirly skirt', cost: 3, draw: () => `<path d="M123 294 L177 294 L200 362 Q150 372 100 362 Z" fill="#ff7ab8"/><path d="M104 352 Q150 364 196 352" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="2 6"/>` },
  { id: 'jeans', cat: 'bottom', name: 'Jeans', cost: 4, draw: () => `<path d="M123 294 L177 294 L175 440 L153 440 L150 330 L147 440 L125 440 Z" fill="#3b5ba9"/><path d="M150 300 L150 320" stroke="#e8c15a" stroke-width="2"/>` },
  { id: 'tutu', cat: 'bottom', name: 'Ballet tutu', cost: 6, draw: () => [0, 1, 2].map(i => `<ellipse cx="150" cy="${316 + i * 6}" rx="${62 - i * 6}" ry="${16 - i * 2}" fill="#ffb3d9" opacity=".85"/>`).join('') + sparkles([[118, 318, 2], [182, 322, 2], [150, 330, 2]]) },
  { id: 'rainbow', cat: 'bottom', name: 'Rainbow leggings', cost: 7, draw: () => `<clipPath id="cb"><path d="M123 294 L177 294 L175 440 L153 440 L150 330 L147 440 L125 440 Z"/></clipPath><g clip-path="url(#cb)">${['#ff4d4d', '#ff9f43', '#ffe14d', '#4cd97b', '#4da6ff', '#a66bff', '#ff4d4d', '#ff9f43'].map((c, i) => `<rect x="110" y="${294 + i * 19}" width="80" height="19" fill="${c}"/>`).join('')}</g>` },

  // dresses (these replace the top and bottom)
  { id: 'party', cat: 'dress', name: 'Party dress', cost: 5, draw: () => `<path d="M120 200 Q150 191 180 200 L178 296 L208 382 Q150 396 92 382 L122 296 Z" fill="#ff5c8a"/><path d="M134 296 Q150 304 166 296 L172 306 Q150 290 128 306 Z" fill="#fff"/><circle cx="150" cy="298" r="6" fill="#fff"/>` },
  { id: 'gown', cat: 'dress', name: 'Princess gown', cost: 10, draw: () => `<circle cx="120" cy="206" r="14" fill="#f7c6ff"/><circle cx="180" cy="206" r="14" fill="#f7c6ff"/><path d="M122 200 Q150 192 178 200 L174 292 Q228 380 236 446 Q150 466 64 446 Q72 380 126 292 Z" fill="#e7a6ff"/><path d="M126 292 Q150 300 174 292" fill="none" stroke="#ffd34d" stroke-width="5"/><path d="M80 430 Q150 450 220 430" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/>${sparkles([[110, 380], [190, 360, 4], [150, 410], [96, 430, 2.5], [206, 420, 2.5], [150, 330, 2.5]])}` },
  { id: 'mermaid', cat: 'dress', name: 'Mermaid dress', cost: 9, draw: () => `<clipPath id="cm"><path d="M122 200 Q150 192 178 200 L180 300 L172 390 Q200 420 212 450 Q150 440 88 450 Q100 420 128 390 L120 300 Z"/></clipPath><path d="M122 200 Q150 192 178 200 L180 300 L172 390 Q200 420 212 450 Q150 440 88 450 Q100 420 128 390 L120 300 Z" fill="#2ec4b6"/><g clip-path="url(#cm)" fill="none" stroke="#9ff0e6" stroke-width="2" opacity=".8">${Array.from({ length: 14 }, (_, r) => Array.from({ length: 6 }, (_, c) => `<path d="M${112 + c * 16 + (r % 2) * 8} ${210 + r * 16} q8 10 16 0"/>`).join('')).join('')}</g>` },
  { id: 'witch', cat: 'dress', name: 'Witchy dress', cost: 8, draw: () => `<path d="M120 200 Q150 191 180 200 L178 296 L212 392 L196 382 L186 396 L172 384 L160 398 L150 386 L140 398 L128 384 L114 396 L104 382 L88 392 L122 296 Z" fill="#5b2a86"/><path d="M122 296 L178 296" stroke="#7cff6b" stroke-width="5"/><circle cx="150" cy="240" r="5" fill="#ff9f43"/>` },
  { id: 'fairy', cat: 'dress', name: 'Fairy dress', cost: 8, draw: () => `<path d="M120 200 Q150 191 180 200 L178 296 L200 340 L186 336 L192 372 L172 350 L170 384 L150 356 L130 384 L128 350 L108 372 L114 336 L100 340 L122 296 Z" fill="#7be38a"/>${sparkles([[140, 240, 2.5], [164, 270, 2.5], [150, 330, 3]], '#fffbcc')}` },

  { id: 'icequeen', cat: 'dress', name: 'Ice queen gown', cost: 10, draw: () => `<path d="M118 204 Q90 330 70 452 Q150 470 230 452 Q210 330 182 204Z" fill="#cfefff" opacity=".55"/><path d="M122 200 Q150 192 178 200 L174 292 Q214 380 222 448 Q150 462 78 448 Q86 380 126 292 Z" fill="#7cc8f5"/><path d="M126 292 Q150 300 174 292" fill="none" stroke="#e8f8ff" stroke-width="5"/>${[[110, 360], [186, 380], [150, 420], [132, 330], [170, 320]].map(([x, y]) => `<g stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M${x - 7} ${y}h14M${x} ${y - 7}v14M${x - 5} ${y - 5}l10 10M${x + 5} ${y - 5}l-10 10"/></g>`).join('')}${sparkles([[140, 230, 2.5], [164, 250, 2.5]])}` },
  { id: 'magical', cat: 'dress', name: 'Magical girl outfit', cost: 9, draw: () => `<path d="M120 200 Q150 191 180 200 L178 300 L124 300 Z" fill="#fff"/><path d="M120 200 L150 236 L180 200 L176 214 L150 248 L124 214Z" fill="#4d7cff"/><path d="M124 298 L176 298 L198 350 L102 350Z" fill="#ff7ab8"/>${[112, 124, 136, 148, 160, 172, 184].map(x => `<path d="M${x} 300 L${x + 4} 350" stroke="#e85a9a" stroke-width="2"/>`).join('')}<path d="M150 240 L128 228 L130 256Z M150 240 L172 228 L170 256Z" fill="#ff3b5c"/><circle cx="150" cy="241" r="6" fill="#ffd23d"/>${sparkles([[150, 241, 2]])}` },
  { id: 'blossom', cat: 'dress', name: 'Blossom dress', cost: 7, draw: () => `<path d="M120 200 Q150 191 180 200 L178 296 L196 390 Q150 400 104 390 L122 296 Z" fill="#ffc2dc"/><rect x="121" y="262" width="58" height="22" rx="4" fill="#d6336c"/><path d="M168 266 L188 292 L176 294Z" fill="#d6336c"/>${[[132, 320], [170, 340], [146, 366], [118, 372], [184, 372], [140, 222], [166, 238]].map(([x, y]) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="${Math.cos(a * Math.PI / 180) * 4}" cy="${Math.sin(a * Math.PI / 180) * 4}" rx="3.5" ry="2.5" transform="rotate(${a} ${Math.cos(a * Math.PI / 180) * 4} ${Math.sin(a * Math.PI / 180) * 4})" fill="#fff"/>`).join('')}<circle r="1.5" fill="#ffd23d"/></g>`).join('')}` },

  // shoes
  { id: 'trainers', cat: 'shoes', name: 'Trainers', cost: 0, draw: () => [139, 161].map(x => `<ellipse cx="${x}" cy="444" rx="13" ry="8" fill="#fff" stroke="#ccc"/><path d="M${x - 10} 444 L${x + 10} 444" stroke="#ff6b9a" stroke-width="3"/>`).join('') },
  { id: 'flats', cat: 'shoes', name: 'Ballet shoes', cost: 3, draw: () => [139, 161].map(x => `<ellipse cx="${x}" cy="443" rx="11" ry="7" fill="#ffb3d9"/><path d="M${x - 8} 430 L${x + 8} 438 M${x + 8} 430 L${x - 8} 438" stroke="#ffb3d9" stroke-width="2"/>`).join('') },
  { id: 'wellies', cat: 'shoes', name: 'Wellies', cost: 4, draw: () => [139, 161].map(x => `<path d="M${x - 10} 398 L${x + 10} 398 L${x + 10} 440 Q${x + 16} 450 ${x} 450 L${x - 10} 450 Z" fill="#ffd23d"/>`).join('') },
  { id: 'boots', cat: 'shoes', name: 'Cool boots', cost: 5, draw: () => [139, 161].map(x => `<path d="M${x - 10} 404 L${x + 10} 404 L${x + 10} 440 Q${x + 18} 448 ${x + 2} 450 L${x - 10} 450 Z" fill="#6b3d2e"/><rect x="${x - 10}" y="404" width="20" height="6" fill="#8a5a44"/>`).join('') },
  { id: 'glass', cat: 'shoes', name: 'Glass slippers', cost: 8, draw: () => [139, 161].map(x => `<ellipse cx="${x}" cy="443" rx="13" ry="8" fill="#bfe9ff" opacity=".85" stroke="#fff"/>${sparkles([[x + 5, 438, 2]])}`).join('') },

  // hairstyles (colour comes from hairColor)
  { id: 'long', cat: 'hair', name: 'Long hair', cost: 0 },
  { id: 'bob', cat: 'hair', name: 'Bob', cost: 0 },
  { id: 'pigtails', cat: 'hair', name: 'Pigtails', cost: 3 },
  { id: 'bun', cat: 'hair', name: 'Ballet bun', cost: 3 },
  { id: 'ponytail', cat: 'hair', name: 'Ponytail', cost: 4 },
  { id: 'curly', cat: 'hair', name: 'Curly', cost: 5 },
  { id: 'spacebuns', cat: 'hair', name: 'Space buns', cost: 4 },
  { id: 'twintails', cat: 'hair', name: 'Long twin tails', cost: 5 },

  // hair colours
  { id: 'hc-brown', cat: 'hairColor', name: 'Brown', cost: 0, color: '#7a4a2a' },
  { id: 'hc-blonde', cat: 'hairColor', name: 'Blonde', cost: 0, color: '#f2cc63' },
  { id: 'hc-black', cat: 'hairColor', name: 'Black', cost: 0, color: '#2a2024' },
  { id: 'hc-red', cat: 'hairColor', name: 'Red', cost: 0, color: '#c8502a' },
  { id: 'hc-pink', cat: 'hairColor', name: 'Pink', cost: 3, color: '#ff8fc8' },
  { id: 'hc-purple', cat: 'hairColor', name: 'Purple', cost: 3, color: '#9b6bff' },
  { id: 'hc-blue', cat: 'hairColor', name: 'Blue', cost: 4, color: '#4da6ff' },
  { id: 'hc-mint', cat: 'hairColor', name: 'Mermaid green', cost: 4, color: '#45d6b5' },

  // hats and crowns
  { id: 'bow', cat: 'hat', name: 'Big bow', cost: 2, draw: () => `<path d="M188 58 L164 44 L166 74 Z M188 58 L212 44 L210 74 Z" fill="#ff4d7d"/><circle cx="188" cy="59" r="7" fill="#e83565"/>` },
  { id: 'catears', cat: 'hat', name: 'Cat ears', cost: 3, draw: () => `<path d="M100 72 L104 28 L134 56 Z M200 72 L196 28 L166 56 Z" fill="#3a3040"/><path d="M106 62 L108 40 L124 56 Z M194 62 L192 40 L176 56 Z" fill="#ffb3d9"/>` },
  { id: 'flowers', cat: 'hat', name: 'Flower crown', cost: 4, draw: () => [[96, 82], [112, 64], [132, 54], [150, 51], [168, 54], [188, 64], [204, 82]].map(([x, y], i) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map(a => `<circle cx="${Math.cos(a * Math.PI / 180) * 6}" cy="${Math.sin(a * Math.PI / 180) * 6}" r="5" fill="${['#ff8fc8', '#ffe14d', '#b07cff', '#fff'][i % 4]}"/>`).join('')}<circle r="3.5" fill="#ff9f43"/></g>`).join('') },
  { id: 'tiara', cat: 'hat', name: 'Sparkly tiara', cost: 5, draw: () => `<path d="M112 70 Q150 48 188 70 L182 54 L170 62 L160 40 L150 58 L140 40 L130 62 L118 54 Z" fill="#dfe6f2" stroke="#9fb0c8"/><circle cx="150" cy="56" r="5" fill="#4da6ff"/>${sparkles([[160, 40, 2], [140, 42, 2]])}` },
  { id: 'witchhat', cat: 'hat', name: 'Witch hat', cost: 5, draw: () => `<ellipse cx="150" cy="64" rx="78" ry="14" fill="#2b1a40"/><path d="M110 62 L160 -24 L170 -10 L190 62 Z" fill="#3a2258"/><rect x="112" y="48" width="76" height="10" fill="#7cff6b"/>` },
  { id: 'crown', cat: 'hat', name: 'Golden crown', cost: 6, draw: () => `<path d="M108 66 L114 22 L132 46 L150 14 L168 46 L186 22 L192 66 Z" fill="#ffd23d" stroke="#d9a400" stroke-width="2"/><circle cx="150" cy="54" r="6" fill="#ff4d7d"/><circle cx="126" cy="58" r="4" fill="#4da6ff"/><circle cx="174" cy="58" r="4" fill="#4cd97b"/>` },
  { id: 'unicorn', cat: 'hat', name: 'Unicorn horn', cost: 7, draw: () => `<path d="M138 56 L150 -6 L162 56 Z" fill="#fff4c4" stroke="#e8c15a" stroke-width="2"/><path d="M141 44 L159 38 M143 30 L157 25 M146 16 L154 13" stroke="#e8c15a" stroke-width="2"/><circle cx="124" cy="60" r="7" fill="#ff8fc8"/><circle cx="176" cy="60" r="7" fill="#b07cff"/>` },

  // wings (drawn behind the doll)
  { id: 'fairywings', cat: 'wings', name: 'Fairy wings', cost: 6, draw: () => `<g opacity=".75"><ellipse cx="100" cy="220" rx="44" ry="30" transform="rotate(-25 100 220)" fill="#bff0ff" stroke="#7fd4ff" stroke-width="2"/><ellipse cx="200" cy="220" rx="44" ry="30" transform="rotate(25 200 220)" fill="#bff0ff" stroke="#7fd4ff" stroke-width="2"/><ellipse cx="110" cy="268" rx="28" ry="18" transform="rotate(25 110 268)" fill="#ffd9f2"/><ellipse cx="190" cy="268" rx="28" ry="18" transform="rotate(-25 190 268)" fill="#ffd9f2"/></g>` },
  { id: 'butterfly', cat: 'wings', name: 'Butterfly wings', cost: 6, draw: () => `<path d="M150 230 Q80 140 56 200 Q50 250 150 250 Q60 270 84 320 Q120 340 150 250 Z" fill="#ff9f43"/><path d="M150 230 Q220 140 244 200 Q250 250 150 250 Q240 270 216 320 Q180 340 150 250 Z" fill="#ff9f43"/><circle cx="90" cy="206" r="10" fill="#fff"/><circle cx="210" cy="206" r="10" fill="#fff"/><circle cx="104" cy="296" r="7" fill="#4da6ff"/><circle cx="196" cy="296" r="7" fill="#4da6ff"/>` },
  { id: 'angel', cat: 'wings', name: 'Angel wings', cost: 8, draw: () => [-1, 1].map(s => `<g transform="translate(150 230) scale(${s} 1)">${[0, 1, 2, 3].map(i => `<ellipse cx="${-40 - i * 16}" cy="${-10 + i * 18}" rx="${34 - i * 4}" ry="12" transform="rotate(${-30 + i * 18} ${-40 - i * 16} ${-10 + i * 18})" fill="#fff" stroke="#e2e8f2"/>`).join('')}</g>`).join('') },

  // things to hold (right hand at 205,296; left hand at 95,296)
  { id: 'icecream', cat: 'acc', name: 'Ice cream', cost: 2, draw: () => `<path d="M198 290 L212 290 L205 318 Z" fill="#e8b46b"/><circle cx="205" cy="282" r="10" fill="#ffb3d9"/><circle cx="205" cy="270" r="8" fill="#9ff0e6"/>` },
  { id: 'balloon', cat: 'acc', name: 'Balloon', cost: 3, draw: () => `<path d="M205 296 Q224 220 238 150" fill="none" stroke="#666" stroke-width="1.5"/><path d="M238 152 C210 132 214 100 238 112 C262 100 266 132 238 152Z" fill="#ff4d7d"/>` },
  { id: 'handbag', cat: 'acc', name: 'Handbag', cost: 3, draw: () => `<path d="M80 300 Q95 270 110 300" fill="none" stroke="#b07cff" stroke-width="3"/><rect x="76" y="298" width="38" height="28" rx="6" fill="#b07cff"/><circle cx="95" cy="310" r="3" fill="#ffe14d"/>` },
  { id: 'wand', cat: 'acc', name: 'Magic wand', cost: 4, draw: () => `<path d="M205 300 L240 236" stroke="#5a3a2a" stroke-width="4" stroke-linecap="round"/>${sparkles([[242, 232, 6]], '#ffe14d')}${sparkles([[226, 220, 2], [256, 246, 2]])}` },
  { id: 'teddy', cat: 'acc', name: 'Teddy bear', cost: 5, draw: () => `<g fill="#b07a4e"><circle cx="84" cy="300" r="16"/><circle cx="84" cy="276" r="12"/><circle cx="74" cy="266" r="5"/><circle cx="94" cy="266" r="5"/></g><circle cx="80" cy="274" r="1.6" fill="#222"/><circle cx="88" cy="274" r="1.6" fill="#222"/><ellipse cx="84" cy="280" rx="4" ry="3" fill="#e8c8a8"/>` },

  // make-up (wear several at once)
  { id: 'blush', cat: 'makeup', name: 'Rosy cheeks', cost: 1, mk: true },
  { id: 'lip-pink', cat: 'makeup', name: 'Pink lipstick', cost: 2, mk: true, group: 'lips', color: '#ff5c9a' },
  { id: 'lip-red', cat: 'makeup', name: 'Red lipstick', cost: 2, mk: true, group: 'lips', color: '#e8304a' },
  { id: 'lip-purple', cat: 'makeup', name: 'Purple lipstick', cost: 3, mk: true, group: 'lips', color: '#9b3bd1' },
  { id: 'eye-blue', cat: 'makeup', name: 'Blue eyeshadow', cost: 2, mk: true, group: 'eyes', color: '#5aa8ff' },
  { id: 'eye-purple', cat: 'makeup', name: 'Purple eyeshadow', cost: 2, mk: true, group: 'eyes', color: '#b07cff' },
  { id: 'eye-gold', cat: 'makeup', name: 'Gold sparkle eyes', cost: 4, mk: true, group: 'eyes', color: '#ffcf4d' },
  { id: 'freckles', cat: 'makeup', name: 'Glitter freckles', cost: 3, mk: true },
  { id: 'star', cat: 'makeup', name: 'Star face paint', cost: 3, mk: true, group: 'paint' },
  { id: 'whiskers', cat: 'makeup', name: 'Cat whiskers', cost: 3, mk: true, group: 'paint' },

  // eye colours (big sparkly manga eyes)
  { id: 'ey-brown', cat: 'eyes', name: 'Brown eyes', cost: 0, color: '#8a5a34' },
  { id: 'ey-blue', cat: 'eyes', name: 'Blue eyes', cost: 0, color: '#3d8bff' },
  { id: 'ey-green', cat: 'eyes', name: 'Green eyes', cost: 0, color: '#2fae6a' },
  { id: 'ey-violet', cat: 'eyes', name: 'Violet eyes', cost: 3, color: '#9b5cff' },
  { id: 'ey-pink', cat: 'eyes', name: 'Pink eyes', cost: 3, color: '#ff4f9a' },
  { id: 'ey-star', cat: 'eyes', name: 'Starry eyes', cost: 5, color: '#ffb800', star: true },

  // skin tones
  { id: 'sk1', cat: 'skin', name: 'Skin 1', cost: 0, color: '#ffe0c7' },
  { id: 'sk2', cat: 'skin', name: 'Skin 2', cost: 0, color: '#f2c39b' },
  { id: 'sk3', cat: 'skin', name: 'Skin 3', cost: 0, color: '#c98e62' },
  { id: 'sk4', cat: 'skin', name: 'Skin 4', cost: 0, color: '#8d5a3b' },

  // places
  { id: 'bedroom', cat: 'bg', name: 'Bedroom', cost: 0, draw: () => `<rect width="300" height="500" fill="#ffe4f0"/><rect y="390" width="300" height="110" fill="#e8b98f"/><rect x="190" y="60" width="80" height="90" rx="6" fill="#bfe6ff" stroke="#fff" stroke-width="6"/><path d="M230 60 V150 M190 105 H270" stroke="#fff" stroke-width="4"/><ellipse cx="150" cy="452" rx="120" ry="22" fill="#ff9fc8" opacity=".6"/>${sparkles([[40, 60, 3], [80, 110, 2], [30, 180, 2.5]], '#ffb3d9')}` },
  { id: 'castle', cat: 'bg', name: 'Castle', cost: 5, draw: () => `<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9e2ff"/><stop offset="1" stop-color="#ffe9f5"/></linearGradient></defs><rect width="300" height="500" fill="url(#sk)"/><g fill="#f5c4e0"><rect x="20" y="170" width="50" height="230"/><rect x="230" y="170" width="50" height="230"/><rect x="60" y="240" width="180" height="160"/></g><g fill="#c98fd8"><path d="M14 172 L45 110 L76 172Z"/><path d="M224 172 L255 110 L286 172Z"/></g><path d="M130 400 V340 Q150 316 170 340 V400Z" fill="#a46bc0"/><rect y="400" width="300" height="100" fill="#8fd98a"/>` },
  { id: 'beach', cat: 'bg', name: 'Beach', cost: 5, draw: () => `<rect width="300" height="500" fill="#9fdcff"/><circle cx="240" cy="80" r="34" fill="#ffe14d"/><rect y="330" width="300" height="80" fill="#3fb6e8"/><path d="M0 340 Q40 330 80 340 T160 340 T240 340 T320 340" fill="none" stroke="#fff" stroke-width="3"/><rect y="400" width="300" height="100" fill="#f5dca0"/><path d="M40 410 Q50 330 70 260" stroke="#8a5a34" stroke-width="8" fill="none"/><path d="M70 260 q-40 -10 -60 10 M70 260 q-20 -30 -50 -30 M70 260 q30 -30 60 -20 M70 260 q40 0 50 30" stroke="#3fae5a" stroke-width="9" fill="none" stroke-linecap="round"/>` },
  { id: 'forest', cat: 'bg', name: 'Fairy forest', cost: 6, draw: () => `<rect width="300" height="500" fill="#d8f5d0"/>${[[30, 380, 70], [110, 360, 60], [250, 390, 80], [190, 350, 50]].map(([x, y, h]) => `<rect x="${x - 6}" y="${y - h * .3}" width="12" height="${h * .8}" fill="#8a5a34"/><circle cx="${x}" cy="${y - h * .6}" r="${h * .5}" fill="#4cbf6a"/>`).join('')}<rect y="410" width="300" height="90" fill="#7bd36b"/>${[[60, 430], [230, 440]].map(([x, y]) => `<rect x="${x - 4}" y="${y - 12}" width="8" height="14" fill="#fff"/><path d="M${x - 14} ${y - 10} Q${x} ${y - 30} ${x + 14} ${y - 10}Z" fill="#ff4d4d"/><circle cx="${x - 4}" cy="${y - 17}" r="2.5" fill="#fff"/>`).join('')}${sparkles([[60, 120, 2.5], [150, 80, 2], [240, 140, 2.5], [200, 220, 2]], '#fffbcc')}` },
  { id: 'stage', cat: 'bg', name: 'Ballet stage', cost: 5, draw: () => `<rect width="300" height="500" fill="#2a1030"/><path d="M150 0 L60 420 L240 420Z" fill="#fff6c4" opacity=".25"/><path d="M0 0 H70 Q50 200 80 420 H0Z M300 0 H230 Q250 200 220 420 H300Z" fill="#c8304a"/><rect y="0" width="300" height="34" fill="#a8203a"/><rect y="410" width="300" height="90" fill="#8a5a34"/>` },
  { id: 'space', cat: 'bg', name: 'Outer space', cost: 6, draw: () => `<rect width="300" height="500" fill="#14102e"/>${Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 73) % 300}" cy="${(i * 131) % 420}" r="${1 + (i % 3) * .6}" fill="#fff" opacity=".8"/>`).join('')}<circle cx="235" cy="95" r="32" fill="#ff9f43"/><ellipse cx="235" cy="95" rx="52" ry="12" fill="none" stroke="#ffd9a8" stroke-width="4"/><circle cx="50" cy="160" r="14" fill="#9ff0e6"/><rect y="420" width="300" height="80" fill="#5a4a7a"/>` },
];
export const BY_ID = Object.fromEntries(ITEMS.map(i => [i.id, i]));

// ---------- hair ----------
function hairBack(style, c) {
  const d = shade(c, .82);
  if (style === 'long') return `<path d="M84 122 Q80 38 150 40 Q220 38 216 122 L224 272 Q150 292 76 272 Z" fill="${c}"/>`;
  if (style === 'bob') return `<path d="M82 128 Q80 40 150 42 Q220 40 218 128 L216 188 Q150 202 84 188 Z" fill="${c}"/>`;
  if (style === 'pigtails') return `<circle cx="74" cy="150" r="26" fill="${c}"/><circle cx="226" cy="150" r="26" fill="${c}"/><circle cx="68" cy="190" r="20" fill="${c}"/><circle cx="232" cy="190" r="20" fill="${c}"/><path d="M86 120 Q84 44 150 44 Q216 44 214 120Z" fill="${c}"/><circle cx="90" cy="132" r="6" fill="#ff4d7d"/><circle cx="210" cy="132" r="6" fill="#ff4d7d"/>`;
  if (style === 'bun') return `<circle cx="150" cy="44" r="28" fill="${c}"/><path d="M150 18 Q170 30 166 54" fill="none" stroke="${d}" stroke-width="3"/><path d="M86 120 Q84 44 150 44 Q216 44 214 120Z" fill="${c}"/>`;
  if (style === 'ponytail') return `<path d="M200 70 Q258 110 236 240 Q224 260 214 230 Q232 140 190 96Z" fill="${c}"/><path d="M86 120 Q84 44 150 44 Q216 44 214 120Z" fill="${c}"/><circle cx="204" cy="78" r="7" fill="#4da6ff"/>`;
  if (style === 'spacebuns') return `<circle cx="104" cy="58" r="24" fill="${c}"/><circle cx="196" cy="58" r="24" fill="${c}"/><path d="M90 52 Q104 40 118 50 M182 50 Q196 40 210 52" fill="none" stroke="${d}" stroke-width="3"/><path d="M86 120 Q84 44 150 44 Q216 44 214 120Z" fill="${c}"/>`;
  if (style === 'twintails') return `<path d="M96 70 Q40 120 58 250 Q66 300 50 330 Q90 300 86 240 Q78 150 112 84Z M204 70 Q260 120 242 250 Q234 300 250 330 Q210 300 214 240 Q222 150 188 84Z" fill="${c}"/><path d="M86 120 Q84 44 150 44 Q216 44 214 120Z" fill="${c}"/><ellipse cx="87" cy="72" rx="9" ry="6" fill="#ff4d7d"/><ellipse cx="105" cy="72" rx="9" ry="6" fill="#ff4d7d"/><circle cx="96" cy="72" r="4.5" fill="#e83565"/><ellipse cx="195" cy="72" rx="9" ry="6" fill="#ff4d7d"/><ellipse cx="213" cy="72" rx="9" ry="6" fill="#ff4d7d"/><circle cx="204" cy="72" r="4.5" fill="#e83565"/>`;
  if (style === 'curly') return Array.from({ length: 18 }, (_, i) => { const a = (Math.PI * (0.92 + i * 0.065)); return `<circle cx="${150 + Math.cos(a) * 68}" cy="${118 + Math.sin(a) * 70}" r="22" fill="${c}"/>`; }).join('') + [[80, 190], [220, 190], [76, 226], [224, 226]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="20" fill="${c}"/>`).join('');
  return '';
}
function hairFront(style, c) {
  if (style === 'bob') return `<path d="M88 112 Q92 50 150 50 Q208 50 212 112 Q182 88 150 90 Q118 88 88 112Z" fill="${c}"/>`;
  if (style === 'curly') return Array.from({ length: 7 }, (_, i) => `<circle cx="${100 + i * 16.6}" cy="${64 + Math.abs(3 - i) * 4}" r="15" fill="${c}"/>`).join('');
  const fringe = `<path d="M88 112 Q92 48 150 48 Q208 48 212 112 Q190 80 162 86 Q150 72 132 88 Q108 82 88 112Z" fill="${c}"/>`;
  if (style === 'long') return fringe + `<path d="M88 108 Q78 170 92 214 L104 208 Q96 160 100 116Z M212 108 Q222 170 208 214 L196 208 Q204 160 200 116Z" fill="${c}"/>`;
  return fringe;
}

// ---------- the face ----------
function face(skin, mk, eyeId) {
  const lips = mk.find(m => BY_ID[m] && BY_ID[m].group === 'lips');
  const eyes = mk.find(m => BY_ID[m] && BY_ID[m].group === 'eyes');
  let s = '';
  if (eyes) s += [127, 173].map(x => `<ellipse cx="${x}" cy="112" rx="16" ry="10" fill="${BY_ID[eyes].color}" opacity=".6"/>`).join('') + (eyes === 'eye-gold' ? sparkles([[116, 108, 1.5], [184, 108, 1.5]]) : '');
  const eye = BY_ID[eyeId] || BY_ID['ey-brown'];
  const ic = eye.color, gid = 'ir' + ic.slice(1);
  s += `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(ic, .45)}"/><stop offset=".55" stop-color="${ic}"/><stop offset="1" stop-color="${shade(ic, 1.45)}"/></linearGradient></defs>`;
  s += [127, 173].map((x, k) => {
    const o = k ? 1 : -1;   // outer side
    return `<ellipse cx="${x}" cy="126" rx="13.5" ry="16" fill="#fff"/>
      <ellipse cx="${x}" cy="128" rx="11" ry="14" fill="url(#${gid})"/>
      <ellipse cx="${x}" cy="129" rx="5.5" ry="7.5" fill="#1d1226"/>
      ${eye.star ? sparkles([[x + 3, 122, 2.6]]) : `<ellipse cx="${x + 4}" cy="121" rx="4.2" ry="5" fill="#fff"/>`}
      <circle cx="${x - 4}" cy="134" r="2.2" fill="#fff" opacity=".9"/>
      <path d="M${x - 15} ${118} Q${x} ${104} ${x + 15} ${118}" fill="none" stroke="#2b1d2e" stroke-width="4" stroke-linecap="round"/>
      <path d="M${x + o * 14} ${117} l${o * 6} -5 M${x + o * 11} ${112} l${o * 4} -6" stroke="#2b1d2e" stroke-width="2.4" stroke-linecap="round"/>`;
  }).join('');
  s += `<path d="M117 99 Q127 94 137 98 M163 98 Q173 94 183 99" fill="none" stroke="#6b4a3a" stroke-width="2.5" stroke-linecap="round"/>`;
  s += `<path d="M147 139 Q150 142 153 139" fill="none" stroke="${shade(skin, .75)}" stroke-width="2.5" stroke-linecap="round"/>`;
  if (mk.includes('blush')) s += `<circle cx="112" cy="146" r="11" fill="#ff7aa8" opacity=".4"/><circle cx="188" cy="146" r="11" fill="#ff7aa8" opacity=".4"/>`;
  if (mk.includes('freckles')) s += [[108, 140], [116, 146], [104, 148], [192, 140], [184, 146], [196, 148]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="#ffd34d"/>`).join('');
  if (mk.includes('star')) s += sparkles([[192, 112, 4]], '#ff4dd2');
  if (mk.includes('whiskers')) s += `<path d="M104 146 L84 142 M104 152 L84 154 M196 146 L216 142 M196 152 L216 154" stroke="#3a3040" stroke-width="2" stroke-linecap="round"/><circle cx="150" cy="140" r="3" fill="#3a3040"/>`;
  s += lips
    ? `<path d="M138 151 Q150 166 162 151 Q150 156 138 151Z" fill="${BY_ID[lips].color}"/>`
    : `<path d="M139 152 Q150 162 161 152" fill="none" stroke="#c0505f" stroke-width="3" stroke-linecap="round"/>`;
  return s;
}

// ---------- the whole doll ----------
// look = { bg, skin, hair, hairColor, top, bottom, dress, shoes, hat, wings, acc, makeup: [] }
export function dollSVG(look, { viewBox = '0 0 300 500', only = null, cls = '' } = {}) {
  const skin = (BY_ID[look.skin] || BY_ID.sk1).color;
  const hc = (BY_ID[look.hairColor] || BY_ID['hc-brown']).color;
  const style = look.hair || 'long';
  const draw = id => (id && BY_ID[id] && BY_ID[id].draw ? BY_ID[id].draw() : '');
  const L = {
    bg: draw(look.bg),
    wings: draw(look.wings),
    hairBack: hairBack(style, hc),
    body: `<rect x="131" y="300" width="16" height="142" rx="8" fill="${skin}"/><rect x="153" y="300" width="16" height="142" rx="8" fill="${skin}"/>
      <path d="M118 208 L96 292 M182 208 L204 292" stroke="${skin}" stroke-width="17" stroke-linecap="round"/>
      <circle cx="95" cy="296" r="10" fill="${skin}"/><circle cx="205" cy="296" r="10" fill="${skin}"/>
      <path d="M122 200 Q150 190 178 200 L176 302 L124 302Z" fill="${skin}"/>
      <rect x="141" y="166" width="18" height="36" rx="6" fill="${shade(skin, .9)}"/>
      <circle cx="89" cy="128" r="11" fill="${skin}"/><circle cx="211" cy="128" r="11" fill="${skin}"/>
      <ellipse cx="150" cy="118" rx="62" ry="64" fill="${skin}"/>`,
    shoes: draw(look.shoes),
    bottom: look.dress ? '' : draw(look.bottom),
    top: look.dress ? '' : draw(look.top),
    dress: draw(look.dress),
    face: face(skin, look.makeup || [], look.eyes),
    hairFront: hairFront(style, hc),
    hat: draw(look.hat),
    acc: draw(look.acc),
  };
  const order = ['bg', 'wings', 'hairBack', 'body', 'shoes', 'bottom', 'top', 'dress', 'face', 'hairFront', 'hat', 'acc'];
  const parts = only ? order.filter(k => only.includes(k)) : order;
  return `<svg class="${cls}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">${parts.map(k => `<g class="L-${k}">${L[k]}</g>`).join('')}</svg>`;
}

// thumbnails: show the item on a faint doll, cropped to where it sits
const CROPS = {
  top: '86 180 128 135', bottom: '86 280 128 175', dress: '56 180 188 285', shoes: '108 392 84 66',
  hair: '50 0 200 300', hairColor: '50 0 200 300', hat: '62 -30 176 130', wings: '40 120 220 220',
  acc: '56 100 210 240', makeup: '84 86 132 84', eyes: '96 98 108 52', skin: '50 40 200 200', bg: '0 0 300 500',
};
export function thumbSVG(item, look) {
  const base = { ...look, bg: null, wings: null, hat: null, acc: null, dress: null, top: 'tee', bottom: 'shorts', shoes: null, makeup: [] };
  let l = base;
  if (item.cat === 'makeup') l = { ...base, makeup: [item.id] };
  else if (item.cat === 'hairColor') l = { ...base, hairColor: item.id };
  else if (item.cat === 'eyes') l = { ...base, eyes: item.id };
  else if (item.cat === 'skin') l = { ...base, skin: item.id };
  else l = { ...base, [item.cat]: item.id };
  if (item.cat === 'dress') l.top = l.bottom = null;
  return dollSVG(l, { viewBox: CROPS[item.cat] });
}
