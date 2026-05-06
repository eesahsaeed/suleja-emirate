const TITLE_OVERRIDES_BY_SLUG = {
  builders: 'Builders',
  cabolo: 'Cobblers',
  carf: 'Carpenters',
  craf: 'Craftsmen and Artisans',
  event: 'Event Planners',
  farmr: 'Farmers',
  tailo: 'Tailoring Services',
  tra: 'Traders',
  trad: 'Traditional Structure and Districts',
  tradd: 'Trade Directory',
  typography: 'Council Leadership Directory',
  components: 'Sight and Sound Hub',
  contact: 'Contact Council',
  had: 'Daily Hadith',
  sr: 'Friday Sermon',
  srrmorn: 'Friday Sermon (Morning)',
  v: '25th Anniversary Videos'
};

const GENERIC_TITLES = new Set(['suleja emirate council', 'sueja emirate council']);

function cleanText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function humanizeFileName(fileName) {
  return cleanText(fileName)
    .replace(/\.html?$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function extractSummaryTitle(summary) {
  const text = cleanText(summary).replace(/\.\.\.$/, '');
  if (!text) {
    return '';
  }

  const firstSentence = cleanText(text.split(/[.!?]/)[0]);
  let candidate = firstSentence || text;

  candidate = candidate.replace(/\s+page$/i, '').trim();

  if (candidate.length > 72) {
    candidate = candidate
      .split(/\s+/)
      .slice(0, 9)
      .join(' ')
      .trim();
  }

  return candidate.length >= 3 ? candidate : '';
}

export function getLegacyDisplayTitle(page) {
  const slug = cleanText(page?.slug).toLowerCase();
  const customTitle = TITLE_OVERRIDES_BY_SLUG[slug];
  if (customTitle) {
    return customTitle;
  }

  const title = cleanText(page?.title);
  if (title && !GENERIC_TITLES.has(title.toLowerCase())) {
    return title;
  }

  const summaryTitle = extractSummaryTitle(page?.summary);
  if (summaryTitle && !GENERIC_TITLES.has(summaryTitle.toLowerCase())) {
    return summaryTitle;
  }

  return humanizeFileName(page?.fileName || slug || 'Legacy Page');
}
