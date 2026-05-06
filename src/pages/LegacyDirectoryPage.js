import {useMemo, useState} from 'react';
import {
  ActionButton,
  Badge,
  Button,
  ButtonGroup,
  Content,
  Dialog,
  DialogTrigger,
  Divider,
  Heading,
  Item,
  Picker,
  SearchField,
  Text
} from '@adobe/react-spectrum';
import {Link} from 'react-router-dom';
import LegacyBlockRenderer from '../components/LegacyBlockRenderer';
import legacyPages from '../data/legacyPages';
import {parseLegacyBlocks} from '../lib/legacyParser';
import {getLegacyDisplayTitle} from '../lib/legacyPageTitles';
import {getCategoryLabel, getPageCategory, pageCategories} from '../lib/pageMeta';

const sortedLegacyPages = [...legacyPages]
  .map((page) => ({
    ...page,
    displayTitle: getLegacyDisplayTitle(page)
  }))
  .sort((left, right) => left.displayTitle.localeCompare(right.displayTitle));

export default function LegacyDirectoryPage() {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const pagesWithMeta = useMemo(() => {
    return sortedLegacyPages.map((page) => {
      const categoryId = getPageCategory(page);
      return {
        ...page,
        categoryId,
        categoryLabel: getCategoryLabel(categoryId),
        blocks: parseLegacyBlocks(page.contentHtml || '')
      };
    });
  }, []);

  const filteredPages = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();

    return pagesWithMeta.filter((page) => {
      const candidate = `${page.displayTitle} ${page.title} ${page.fileName} ${page.summary}`.toLowerCase();
      const matchesQuery = normalizedQuery ? candidate.includes(normalizedQuery) : true;
      const matchesCategory = categoryFilter === 'all' ? true : page.categoryId === categoryFilter;
      return matchesQuery && matchesCategory;
    });
  }, [categoryFilter, pagesWithMeta, query]);

  return (
    <main className="main-shell legacy-shell">
      <section className="section-space">
        <Heading level={1}>All Legacy Pages</Heading>
        <Text>
          Every page scanned from the original site is available below. Select any page to view it inside the modern
          React Spectrum experience.
        </Text>
      </section>

      <section className="legacy-toolbar">
        <SearchField
          aria-label="Search legacy pages"
          label="Search pages"
          value={query}
          onChange={setQuery}
          width="100%"
          maxWidth="size-4600"
          placeholder="Type page name, file, or keyword"
        />
        <Picker
          aria-label="Filter pages by category"
          label="Category"
          selectedKey={categoryFilter}
          onSelectionChange={(key) => setCategoryFilter(String(key))}
          width="size-2400"
        >
          <Item key="all">All categories</Item>
          {pageCategories.map((category) => (
            <Item key={category.id}>{category.label}</Item>
          ))}
        </Picker>
        <Badge variant="positive">{filteredPages.length} pages</Badge>
      </section>

      <section className="legacy-grid">
        {filteredPages.map((page) => (
          <article key={page.slug} className="legacy-card reveal">
            <div className="legacy-card-head">
              <h2>{page.displayTitle}</h2>
              <Badge variant="informative">{page.categoryLabel}</Badge>
            </div>
            <p className="legacy-file">{page.fileName}</p>
            <p>{page.summary || 'No summary extracted from source page.'}</p>
            <div className="legacy-card-actions">
              <DialogTrigger type="fullscreenTakeover">
                <ActionButton>Open Modal</ActionButton>
                {(close) => (
                  <Dialog size="L">
                    <Heading>{page.displayTitle}</Heading>
                    <Divider />
                    <Content>
                      <div className="legacy-modal-meta">
                        <Badge variant="informative">{page.categoryLabel}</Badge>
                        <Badge variant="neutral">{page.fileName}</Badge>
                      </div>
                      <div className="legacy-modal-content">
                        <LegacyBlockRenderer blocks={page.blocks} />
                      </div>
                    </Content>
                    <ButtonGroup>
                      <Button variant="secondary" onPress={close}>
                        Close
                      </Button>
                    </ButtonGroup>
                  </Dialog>
                )}
              </DialogTrigger>
              <Link to={`/pages/${page.slug}`} className="legacy-link">
                Open Page
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
