export function normalizeLegacyText(value) {
  let text = String(value || '');

  const replacements = [
    ['\u00e2\u20ac\u2122', "'"],
    ['\u00e2\u20ac\u02dc', "'"],
    ['\u00e2\u20ac\u0153', '"'],
    ['\u00e2\u20ac\u009d', '"'],
    ['\u00e2\u20ac\u201c', '-'],
    ['\u00e2\u20ac\u201d', '-'],
    ['\u00e2\u20ac\u00a6', '...'],
    ['\u00c3\u00a2\u00e2\u201a\u00ac\u00e2\u201e\u00a2', "'"],
    ['\u00c3\u00a2\u00e2\u201a\u00ac\u00cb\u0153', "'"],
    ['\u00c3\u00a2\u00e2\u201a\u00ac\u00c5\u201c', '"'],
    ['\u00c3\u00a2\u00e2\u201a\u00ac\u00c2\u009d', '"'],
    ['\u00c3\u00a2\u00e2\u201a\u00ac\u00e2\u20ac\u0153', '-'],
    ['\u00c3\u00a2\u00e2\u201a\u00ac\u00e2\u20ac\u009d', '-'],
    ['\u00c3\u00a2\u00e2\u201a\u00ac\u00c2\u00a6', '...'],
    ['\u00c3\u201a\u00c2\u00a9', '©']
  ];

  replacements.forEach(([from, to]) => {
    text = text.split(from).join(to);
  });

  return text
    .replace(/\u00c2/g, '')
    .replace(/\u00c3/g, '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractGalleryItemsFromTable(tableElement) {
  const items = [];
  const cells = Array.from(tableElement.querySelectorAll('td, th'));

  cells.forEach((cell, index) => {
    const imageElement = cell.querySelector('img');
    const linkElement = cell.querySelector('a[href]');
    const src = imageElement?.getAttribute('src') || '';
    const caption = normalizeLegacyText(cell.textContent);
    const href = linkElement?.getAttribute('href') || '';

    if (!src && !caption) {
      return;
    }

    items.push({
      id: `${index}-${src || caption}`,
      src,
      caption,
      href: href && href !== '#' ? href : ''
    });
  });

  return items;
}

function inferVideoType(sourcePath) {
  const value = String(sourcePath || '').toLowerCase();
  if (value.endsWith('.mp4') || value.endsWith('.m4v')) return 'video/mp4';
  if (value.endsWith('.webm')) return 'video/webm';
  if (value.endsWith('.ogg')) return 'video/ogg';
  if (value.endsWith('.mov')) return 'video/quicktime';
  if (value.endsWith('.avi')) return 'video/x-msvideo';
  if (value.endsWith('.wmv')) return 'video/x-ms-wmv';
  if (value.endsWith('.flv')) return 'video/x-flv';
  if (value.endsWith('.mkv')) return 'video/x-matroska';
  if (value.endsWith('.3gp')) return 'video/3gpp';
  return '';
}

export function parseLegacyBlocks(contentHtml) {
  if (!contentHtml || typeof window === 'undefined') {
    return [];
  }

  const parser = new window.DOMParser();
  const documentNode = parser.parseFromString(`<div id="legacy-root">${contentHtml}</div>`, 'text/html');
  const root = documentNode.querySelector('#legacy-root');

  if (!root) {
    return [];
  }

  const blocks = [];
  const dedupe = new Set();

  function pushBlock(block) {
    const key = JSON.stringify(block);
    if (!dedupe.has(key)) {
      dedupe.add(key);
      blocks.push(block);
    }
  }

  function walk(node) {
    if (node.nodeType === window.Node.TEXT_NODE) {
      const text = normalizeLegacyText(node.textContent);
      if (text.length >= 3) {
        pushBlock({type: 'paragraph', text});
      }
      return;
    }

    if (node.nodeType !== window.Node.ELEMENT_NODE) {
      return;
    }

    const element = node;
    const tagName = element.tagName.toLowerCase();

    if (['script', 'style', 'link', 'meta', 'noscript'].includes(tagName)) {
      return;
    }

    if (tagName === 'br') {
      return;
    }

    if (/^h[1-6]$/.test(tagName)) {
      const text = normalizeLegacyText(element.textContent);
      if (text) {
        pushBlock({type: 'heading', level: Number(tagName[1]), text});
      }
      return;
    }

    if (tagName === 'iframe') {
      const src = element.getAttribute('src') || '';
      if (src) {
        pushBlock({type: 'embed', src});
      }
      return;
    }

    if (tagName === 'video') {
      const sources = [];
      const seenSources = new Set();
      const pushSource = (srcValue, typeValue = '') => {
        const src = String(srcValue || '').trim();
        if (!src) {
          return;
        }

        if (seenSources.has(src)) {
          return;
        }

        seenSources.add(src);
        sources.push({src, type: typeValue || inferVideoType(src)});
      };

      pushSource(element.getAttribute('src') || '', element.getAttribute('type') || '');
      Array.from(element.querySelectorAll(':scope > source[src]')).forEach((sourceElement) => {
        pushSource(sourceElement.getAttribute('src') || '', sourceElement.getAttribute('type') || '');
      });

      if (sources.length > 0) {
        const title = normalizeLegacyText(
          element.getAttribute('title') ||
            element.getAttribute('aria-label') ||
            element.getAttribute('data-title') ||
            ''
        );
        pushBlock({type: 'video', sources, title});
      }
      return;
    }

    if (tagName === 'img') {
      const src = element.getAttribute('src') || '';
      const alt = normalizeLegacyText(element.getAttribute('alt') || '');
      if (src) {
        pushBlock({type: 'image', src, alt});
      }
      return;
    }

    if (tagName === 'table') {
      const galleryItems = extractGalleryItemsFromTable(element);
      if (galleryItems.length > 0) {
        pushBlock({type: 'gallery', items: galleryItems});
      } else {
        const rows = Array.from(element.querySelectorAll('tr'))
          .map((row) =>
            Array.from(row.querySelectorAll('th, td'))
              .map((cell) => normalizeLegacyText(cell.textContent))
              .filter(Boolean)
          )
          .filter((row) => row.length > 0);

        if (rows.length > 0) {
          pushBlock({type: 'table', rows});
        }
      }
      return;
    }

    if (tagName === 'ul' || tagName === 'ol') {
      const items = Array.from(element.querySelectorAll(':scope > li'))
        .map((item) => normalizeLegacyText(item.textContent))
        .filter(Boolean);

      if (items.length > 0) {
        pushBlock({type: 'list', ordered: tagName === 'ol', items});
      }
      return;
    }

    if (tagName === 'a') {
      const href = element.getAttribute('href') || '';
      const text = normalizeLegacyText(element.textContent);
      if (href && href !== '#' && text) {
        pushBlock({type: 'link', href, text});
      }
      return;
    }

    const containsStructuralChild = Boolean(
      element.querySelector('img, iframe, video, table, ul, ol, h1, h2, h3, h4, h5, h6, a')
    );

    if (!containsStructuralChild) {
      const text = normalizeLegacyText(element.textContent);
      if (text.length >= 25 || ['p', 'blockquote', 'center'].includes(tagName)) {
        pushBlock({type: 'paragraph', text});
        return;
      }
    }

    Array.from(element.childNodes).forEach(walk);
  }

  Array.from(root.childNodes).forEach(walk);
  return blocks;
}
