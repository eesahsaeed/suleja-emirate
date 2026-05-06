const CATEGORY_DEFINITIONS = [
  {
    id: 'heritage',
    label: 'Heritage and History',
    matches: ['g', 'g1', 'g2', 'tile', 'trad', 'typography', 'had']
  },
  {
    id: 'media',
    label: 'Media and Gallery',
    matches: ['about', 'gallery', 'gallery-2', 'pic', 'v', 'short', 'sr', 'srrmorn', 'components', 'portfolio-2cols']
  },
  {
    id: 'business',
    label: 'Business and Trade',
    matches: ['busi', 'business-catelog', 'builders', 'craf', 'carf', 'cabolo', 'event', 'farmr', 'tailo', 'tradd', 'indus', 'tra']
  },
  {
    id: 'infrastructure',
    label: 'Social Infrastructure',
    matches: ['edu', 'has', 'civic', 'trans', 'jus', 'social', 'soil']
  },
  {
    id: 'contact',
    label: 'Contact and Council',
    matches: ['contact', 'index']
  }
];

export const pageCategories = CATEGORY_DEFINITIONS.map(({id, label}) => ({id, label}));

export function getPageCategory(page) {
  const slug = (page?.slug || '').toLowerCase();

  const matchedCategory = CATEGORY_DEFINITIONS.find((category) => category.matches.some((segment) => slug.includes(segment)));
  return matchedCategory?.id || 'general';
}

export function getCategoryLabel(categoryId) {
  return pageCategories.find((category) => category.id === categoryId)?.label || 'General';
}
