const DEMO_VIDEO_SOURCES = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
];

const DEMO_IMAGE_PALETTES = [
  ['#e5edf7', '#bed3ea', '#1d4f7a'],
  ['#e7f4ed', '#c2e4d2', '#1f5b47'],
  ['#f5efe6', '#e5d4bb', '#6b4c2e'],
  ['#eef0f8', '#ccd2ea', '#3b4c8f'],
  ['#e8f3f8', '#b9dcea', '#1c5670']
];

function hashText(value) {
  const input = String(value || '');
  let hash = 0;

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) | 0;
  }

  return Math.abs(hash);
}

export function isLocalMediaPath(value) {
  const source = String(value || '').trim();
  return source.startsWith('/legacy-assets/') || source.startsWith('/assets/');
}

export function buildDemoImageUrl(seed) {
  const safeSeed = String(seed || 'suleja-emirate');
  const palette = DEMO_IMAGE_PALETTES[hashText(safeSeed) % DEMO_IMAGE_PALETTES.length];
  const [topColor, bottomColor, textColor] = palette;

  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1280 720' preserveAspectRatio='xMidYMid slice'>
      <defs>
        <linearGradient id='bg' x1='0' x2='0' y1='0' y2='1'>
          <stop offset='0%' stop-color='${topColor}' />
          <stop offset='100%' stop-color='${bottomColor}' />
        </linearGradient>
      </defs>
      <rect width='1280' height='720' fill='url(#bg)' />
      <rect y='560' width='1280' height='160' fill='${textColor}' opacity='0.14' />
      <text x='50%' y='49%' fill='${textColor}' font-family='Segoe UI, Arial, sans-serif' font-size='44' text-anchor='middle'>
        Suleja Emirate Media
      </text>
      <text x='50%' y='57%' fill='${textColor}' opacity='0.86' font-family='Segoe UI, Arial, sans-serif' font-size='22' text-anchor='middle'>
        Demo placeholder
      </text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}`;
}

export function buildDemoVideoUrl(seed) {
  const index = hashText(seed) % DEMO_VIDEO_SOURCES.length;
  return DEMO_VIDEO_SOURCES[index];
}

export function handleImageFallback(event) {
  const image = event.currentTarget;

  if (image.dataset.demoApplied === '1') {
    return;
  }

  image.dataset.demoApplied = '1';
  image.src = buildDemoImageUrl(image.dataset.demoSeed || image.alt || 'suleja-emirate');
}

export function getImageFallbackProps(src, seed = '') {
  if (!isLocalMediaPath(src)) {
    return {};
  }

  return {
    onError: handleImageFallback,
    'data-demo-seed': seed || src || 'suleja-emirate'
  };
}
