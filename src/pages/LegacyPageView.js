import {useMemo} from 'react';
import {Heading, Text} from '@adobe/react-spectrum';
import {Link, Navigate, useParams} from 'react-router-dom';
import LegacyBlockRenderer from '../components/LegacyBlockRenderer';
import legacyPages from '../data/legacyPages';
import {parseLegacyBlocks} from '../lib/legacyParser';
import {getLegacyDisplayTitle} from '../lib/legacyPageTitles';
import {getImageFallbackProps} from '../lib/mediaFallback';

const legacyPageBySlug = new Map(legacyPages.map((page) => [page.slug, page]));
const sortedLegacyPages = [...legacyPages]
  .map((item) => ({
    ...item,
    displayTitle: getLegacyDisplayTitle(item)
  }))
  .sort((left, right) => left.displayTitle.localeCompare(right.displayTitle));

function findCoverImage(blocks) {
  for (const block of blocks) {
    if (block.type === 'image' && block.src) {
      return block.src;
    }

    if (block.type === 'gallery') {
      const firstImage = block.items.find((item) => item.src);
      if (firstImage?.src) {
        return firstImage.src;
      }
    }
  }

  return '';
}

export default function LegacyPageView() {
  const {slug} = useParams();
  const page = slug ? legacyPageBySlug.get(slug) : null;
  const pageTitle = getLegacyDisplayTitle(page);

  const pageBlocks = useMemo(() => parseLegacyBlocks(page?.contentHtml || ''), [page?.contentHtml]);

  const pageStats = useMemo(() => {
    const sectionCount = pageBlocks.filter((block) => block.type === 'heading').length || 1;
    const mediaCount = pageBlocks.reduce((count, block) => {
      if (block.type === 'image') {
        return count + 1;
      }
      if (block.type === 'video') {
        return count + 1;
      }
      if (block.type === 'gallery') {
        return count + block.items.length;
      }
      return count;
    }, 0);

    const linkCount = pageBlocks.reduce((count, block) => {
      if (block.type === 'link') {
        return count + 1;
      }
      if (block.type === 'gallery') {
        return count + block.items.filter((item) => item.href).length;
      }
      return count;
    }, 0);

    return {
      sectionCount,
      mediaCount,
      linkCount
    };
  }, [pageBlocks]);

  const coverImage = useMemo(() => findCoverImage(pageBlocks), [pageBlocks]);

  if (!page) {
    return <Navigate to="/pages" replace />;
  }

  return (
    <main className="main-shell legacy-shell">
      <section className="legacy-page-hero">
        <div className="legacy-page-hero-copy">
          <div className="legacy-page-actions legacy-page-actions-top">
            <Link to="/pages" className="legacy-link ghost back-link-btn">
              Back to all pages
            </Link>
          </div>
          <Heading level={1}>{pageTitle}</Heading>
          <Text>{page.summary || 'Legacy content modernized for readability and navigation.'}</Text>
          <div className="legacy-page-stat-grid">
            <article className="legacy-page-stat">
              <p>{pageStats.sectionCount}</p>
              <span>Sections</span>
            </article>
            <article className="legacy-page-stat">
              <p>{pageStats.mediaCount}</p>
              <span>Media items</span>
            </article>
            <article className="legacy-page-stat">
              <p>{pageStats.linkCount}</p>
              <span>Links</span>
            </article>
          </div>
        </div>
        {coverImage ? (
          <div className="legacy-page-hero-media">
            <img src={coverImage} alt={pageTitle} {...getImageFallbackProps(coverImage, pageTitle)} />
          </div>
        ) : null}
      </section>

      <section className="legacy-split-layout">
        <article className="legacy-modern-wrapper">
          <LegacyBlockRenderer blocks={pageBlocks} />
        </article>

        <aside className="legacy-side-rail">
          <div className="legacy-side-scroll">
            <Heading level={3}>Other Pages</Heading>
            <Text>Jump directly to any other page from the old site in the same modern layout.</Text>
            <div className="legacy-side-links">
              {sortedLegacyPages.map((item) => (
                <Link
                  key={item.slug}
                  to={`/pages/${item.slug}`}
                  className={`legacy-side-link${item.slug === page.slug ? ' active' : ''}`}
                >
                  {item.displayTitle}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
