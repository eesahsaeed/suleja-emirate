const DEMO_VIDEO_SOURCES = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
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
  const normalizedSeed = encodeURIComponent(String(seed || 'suleja-emirate').slice(0, 120));
  return `https://picsum.photos/seed/${normalizedSeed}/1280/720`;
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
