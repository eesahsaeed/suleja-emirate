import {Heading, Text} from '@adobe/react-spectrum';
import {Link} from 'react-router-dom';
import {
  buildDemoImageUrl,
  buildDemoVideoUrl,
  getImageFallbackProps,
  isLocalMediaPath
} from '../lib/mediaFallback';

function isInternalLegacyRoute(href) {
  return href.startsWith('/pages/');
}

function renderLink(href, className, children) {
  if (isInternalLegacyRoute(href)) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function slugifyText(value) {
  return (value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

function buildSections(blocks) {
  const sections = [];
  let currentSection = {title: 'Overview', id: 'overview', blocks: []};
  let headingCount = 0;

  blocks.forEach((block, index) => {
    if (block.type === 'heading') {
      const headingText = block.text || `Section ${headingCount + 1}`;
      if (currentSection.blocks.length > 0 || sections.length === 0) {
        sections.push(currentSection);
      }

      headingCount += 1;
      currentSection = {
        title: headingText,
        id: slugifyText(headingText) || `section-${headingCount}-${index}`,
        blocks: []
      };
      return;
    }

    currentSection.blocks.push(block);
  });

  if (currentSection.blocks.length > 0 || sections.length === 0) {
    sections.push(currentSection);
  }

  return sections.filter((section) => section.blocks.length > 0 || section.title === 'Overview');
}

function renderBlock(block, index) {
  if (block.type === 'paragraph') {
    return (
      <article key={`paragraph-${index}`} className="legacy-modern-card reveal">
        <Text>{block.text}</Text>
      </article>
    );
  }

  if (block.type === 'image') {
    const imageFallbackProps = getImageFallbackProps(block.src, block.src || `legacy-image-${index}`);

    return (
      <figure key={`image-${index}`} className="legacy-modern-media reveal">
        <img src={block.src} alt={block.alt || 'Legacy media'} loading="lazy" {...imageFallbackProps} />
        {block.alt ? <figcaption>{block.alt}</figcaption> : null}
      </figure>
    );
  }

  if (block.type === 'embed') {
    return (
      <div key={`embed-${index}`} className="legacy-modern-embed reveal">
        <iframe
          title={`legacy-embed-${index}`}
          src={block.src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    );
  }

  if (block.type === 'video') {
    const sourceSeed = block.sources.map((source) => source.src).join('|') || `legacy-video-${index}`;
    const hasLocalSource = block.sources.some((source) => isLocalMediaPath(source.src));
    const videoSources = hasLocalSource
      ? [...block.sources, {src: buildDemoVideoUrl(sourceSeed), type: 'video/mp4'}]
      : block.sources;

    return (
      <figure key={`video-${index}`} className="legacy-modern-video reveal">
        <video controls preload="metadata" poster={buildDemoImageUrl(`${sourceSeed}-poster`)}>
          {videoSources.map((source, sourceIndex) => (
            <source key={`video-source-${index}-${sourceIndex}`} src={source.src} type={source.type || undefined} />
          ))}
          Your browser does not support the video tag.
        </video>
        {block.title ? <figcaption>{block.title}</figcaption> : null}
      </figure>
    );
  }

  if (block.type === 'list') {
    const ListTag = block.ordered ? 'ol' : 'ul';
    return (
      <article key={`list-${index}`} className="legacy-modern-card reveal">
        <ListTag className="legacy-modern-list">
          {block.items.map((item, itemIndex) => (
            <li key={`li-${index}-${itemIndex}`}>{item}</li>
          ))}
        </ListTag>
      </article>
    );
  }

  if (block.type === 'table') {
    return (
      <div key={`table-${index}`} className="legacy-modern-table reveal">
        <table>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={`row-${index}-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`cell-${index}-${rowIndex}-${cellIndex}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (block.type === 'gallery') {
    return (
      <div key={`gallery-${index}`} className="legacy-modern-gallery">
        {block.items.map((item) => {
          const imageFallbackProps = getImageFallbackProps(item.src, item.src || item.id);
          const cardContent = (
            <>
              {item.src ? (
                <img
                  src={item.src}
                  alt={item.caption || 'Legacy gallery media'}
                  loading="lazy"
                  {...imageFallbackProps}
                />
              ) : null}
              {item.caption ? <p>{item.caption}</p> : null}
            </>
          );

          if (!item.href || item.href === '#') {
            return (
              <article key={item.id} className="legacy-gallery-card reveal">
                {cardContent}
              </article>
            );
          }

          return (
            <span key={item.id} className="legacy-gallery-link-wrap">
              {renderLink(item.href, 'legacy-gallery-card reveal legacy-gallery-link', cardContent)}
            </span>
          );
        })}
      </div>
    );
  }

  return null;
}

export default function LegacyBlockRenderer({blocks}) {
  if (!blocks.length) {
    return (
      <article className="legacy-modern-card reveal">
        <Text>No content was extracted from this legacy page.</Text>
      </article>
    );
  }

  const sections = buildSections(blocks);

  return (
    <div className="legacy-modern-stack">
      {sections.map((section, sectionIndex) => {
        const sectionNodes = [];
        let linkBucket = [];

        const flushLinkBucket = () => {
          if (!linkBucket.length) {
            return;
          }

          const uniqueLinks = [];
          const seenLinks = new Set();

          linkBucket.forEach((linkBlock) => {
            const identity = `${linkBlock.href}-${linkBlock.text}`;
            if (!seenLinks.has(identity)) {
              seenLinks.add(identity);
              uniqueLinks.push(linkBlock);
            }
          });

          sectionNodes.push(
            <div key={`links-${section.id}-${sectionNodes.length}`} className="legacy-link-chip-grid reveal">
              {uniqueLinks.map((linkBlock, linkIndex) => (
                <span key={`link-${section.id}-${linkIndex}`} className="legacy-link-chip-wrap">
                  {renderLink(linkBlock.href, 'legacy-link-chip reveal', linkBlock.text)}
                </span>
              ))}
            </div>
          );
          linkBucket = [];
        };

        section.blocks.forEach((block, blockIndex) => {
          if (block.type === 'link') {
            linkBucket.push(block);
            return;
          }

          flushLinkBucket();
          const node = renderBlock(block, blockIndex);
          if (node) {
            sectionNodes.push(node);
          }
        });

        flushLinkBucket();

        if (sectionNodes.length === 0) {
          return null;
        }

        return (
          <section key={`section-${section.id}-${sectionIndex}`} id={section.id} className="legacy-content-section">
            <div className="legacy-modern-heading">
              <Heading level={3}>{section.title}</Heading>
            </div>
            <div className="legacy-section-flow">{sectionNodes}</div>
          </section>
        );
      })}
    </div>
  );
}
