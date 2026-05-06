import {useEffect, useState} from 'react';
import {
  Badge,
  Button,
  ButtonGroup,
  Divider,
  Form,
  Grid,
  Heading,
  Item,
  StatusLight,
  TabList,
  TabPanels,
  Tabs,
  Text,
  TextArea,
  TextField,
  Well
} from '@adobe/react-spectrum';
import {useNavigate} from 'react-router-dom';
import LegacySiteHeader from '../components/LegacySiteHeader';
import {buildDemoImageUrl, getImageFallbackProps, isLocalMediaPath} from '../lib/mediaFallback';
import {
  businessSectors,
  councilLeaders,
  heritageHighlights,
  heroSlides,
  socialInfrastructure
} from '../data/siteContent';

function scrollToSection(id) {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({behavior: 'smooth', block: 'start'});
  }
}

export default function HomePage() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [resolvedHeroSrc, setResolvedHeroSrc] = useState(heroSlides[0]?.src || '');
  const navigate = useNavigate();

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setSlideIndex((current) => (current + 1) % heroSlides.length);
    }, 5500);

    return () => window.clearInterval(timerId);
  }, []);

  const activeSlide = heroSlides[slideIndex];

  useEffect(() => {
    const nextSource = activeSlide?.src || '';

    if (!isLocalMediaPath(nextSource)) {
      setResolvedHeroSrc(nextSource);
      return undefined;
    }

    let isMounted = true;
    const probe = new window.Image();
    probe.onload = () => {
      if (isMounted) {
        setResolvedHeroSrc(nextSource);
      }
    };
    probe.onerror = () => {
      if (isMounted) {
        setResolvedHeroSrc(buildDemoImageUrl(nextSource));
      }
    };
    probe.src = nextSource;

    return () => {
      isMounted = false;
    };
  }, [activeSlide?.src]);

  return (
    <>
      <header
        className="hero"
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(8, 34, 64, 0.86), rgba(22, 68, 112, 0.64)), url(${resolvedHeroSrc})`
        }}
      >
        <div className="hero-grain" />
        <div className="hero-inner">
          <LegacySiteHeader inHero />

          <div className="hero-copy reveal">
            <Badge variant="informative">Official Portal</Badge>
            <Heading level={1}>Suleja Emirate Council</Heading>
            <Text UNSAFE_className="slide-caption">
              {activeSlide.title}: {activeSlide.caption}
            </Text>
            <ButtonGroup>
              <Button UNSAFE_className="hero-cta-button" variant="accent" onPress={() => scrollToSection('heritage')}>
                Heritage Brief
              </Button>
              <Button
                UNSAFE_className="hero-cta-button hero-cta-outline"
                variant="primary"
                onPress={() => scrollToSection('contact')}
              >
                Contact Council
              </Button>
              <Button UNSAFE_className="hero-cta-button" variant="secondary" onPress={() => navigate('/pages')}>
                Legacy Archive
              </Button>
            </ButtonGroup>
          </div>

          <Grid
            UNSAFE_className="hero-stats"
            columns={{
              base: 'repeat(1, minmax(0, 1fr))',
              M: 'repeat(3, minmax(0, 1fr))'
            }}
            gap="size-150"
          >
            <article className="stat-card reveal">
              <p className="stat-value">1804-1807</p>
              <p className="stat-label">Migration period highlighted in the legacy archive</p>
            </article>
            <article className="stat-card reveal">
              <p className="stat-value">5 domains</p>
              <p className="stat-label">Social infrastructure service areas presented clearly</p>
            </article>
          </Grid>

          <div className="gallery-strip">
            {heroSlides.map((slide) => (
              <article key={slide.title} className="gallery-item reveal">
                <img src={slide.src} alt={slide.title} {...getImageFallbackProps(slide.src, slide.title)} />
                <p>{slide.title}</p>
              </article>
            ))}
          </div>
        </div>
      </header>

      <main className="main-shell">
        <section className="section-space legacy-highlights-section">
          <div className="legacy-highlights-grid">
            <article className="legacy-highlight-card legacy-highlight-media reveal">
              <img
                src="/legacy-assets/img/IMG_9459.jpg"
                alt="Sight and Sound"
                {...getImageFallbackProps('/legacy-assets/img/IMG_9459.jpg', 'Sight and Sound')}
              />
              <div className="legacy-highlight-content">
                <h3>Sight &amp; Sound</h3>
                <p>Curated media highlights, heritage moments, and visual records from the emirate archive.</p>
              </div>
            </article>

            <article className="legacy-highlight-card legacy-highlight-media reveal">
              <img
                src="/legacy-assets/img/IMG_9488.jpg"
                alt="Events and Festivities"
                {...getImageFallbackProps('/legacy-assets/img/IMG_9488.jpg', 'Events and Festivities')}
              />
              <div className="legacy-highlight-content">
                <h3>Events and Festivities</h3>
                <p>Community celebrations and civic ceremonies documented across the old and modern platform.</p>
              </div>
            </article>

            <article className="legacy-highlight-card legacy-classic-strip reveal">
              <div className="legacy-classic-panel legacy-hadith-feature">
                <h3>Sahih Bukhari Volume 001,</h3>
                <p className="legacy-hadith-meta">
                  Book 001.
                  <br />
                  Hadith Number 001.
                </p>
                <p className="legacy-hadith-body">
                  Narrated By &apos;Umar bin Al-Khattab:
                  <br />
                  I heard Allah&apos;s Apostle صلى الله عليه وآله وسلم‎
                  <br />
                  saying, &quot;The reward of deeds depends
                  <br />
                  upon the intentions and every person
                  <br />
                  will get the reward according to what
                  <br />
                  he has intended. So whoever emigrated
                  <br />
                  for worldly benefits or for a woman
                  <br />
                  to marry, his emigration was for what
                  <br />
                  he emigrated for.&quot;
                </p>
                <Button
                  variant="primary"
                  UNSAFE_className="legacy-hadith-button"
                  onPress={() => navigate('/pages/had')}
                >
                  Daily Hadith
                </Button>
              </div>

              <div className="legacy-classic-panel legacy-classic-media">
                <img
                  className="legacy-friday-image"
                  src="/legacy-assets/img/13.jpg"
                  alt="Friday Khuthbah"
                  width="200"
                  height="300"
                  {...getImageFallbackProps('/legacy-assets/img/13.jpg', 'Friday Khuthbah')}
                />
                <div className="legacy-highlight-content">
                  <h3>Friday Khuthbah</h3>
                </div>
              </div>

              <div className="legacy-classic-panel legacy-classic-map">
                <div className="legacy-highlight-content">
                  <h3>Emirate Location Map</h3>
                  <p>Reference map of the Emir&apos;s Palace area as presented in the legacy site layout.</p>
                </div>
                <iframe
                  title="Legacy emirate location map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3395.1367834967905!2d7.176757114335122!3d9.175291993419469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104dd427f5734735%3A0x1c212b9e0df3079a!2sEmir%27s+Palace%2C+Kwamba!5e1!3m2!1sen!2sng!4v1533891033375"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </article>
          </div>
        </section>

        <section id="heritage" className="section-space">
          <Heading level={2}>Council Overview</Heading>
          <Text>
            Legacy content has been preserved and reorganized into a structured, professional, mobile-ready experience
            using React and React Spectrum.
          </Text>
        </section>

        <section className="section-space tabs-wrap">
          <Tabs aria-label="Suleja emirate modern portal tabs">
            <TabList>
              <Item key="heritage-tab">Heritage</Item>
              <Item key="governance-tab">Governance</Item>
              <Item key="economy-tab">Economy</Item>
              <Item key="infrastructure-tab">Infrastructure</Item>
              <Item key="contact-tab">Contact</Item>
            </TabList>
            <TabPanels>
              <Item key="heritage-tab">
                <div className="panel-grid two-column">
                  <Well>
                    <Heading level={3}>Historical Summary</Heading>
                    <Text>
                      Historical materials in the legacy pages discuss the origin of the Habe people, Bayajida
                      traditions, the movement from Zazzau to Zuba, and the shaping of the Abuja land area.
                    </Text>
                    <Divider size="S" marginY="size-200" />
                    <Text>
                      This redesign makes those materials easier to scan and extend while preserving the original
                      narrative direction.
                    </Text>
                  </Well>
                  <div className="card-grid">
                    {heritageHighlights.map((highlight) => (
                      <article key={highlight.title} className="mini-card reveal">
                        <h3>{highlight.title}</h3>
                        <p>{highlight.summary}</p>
                      </article>
                    ))}
                  </div>
                </div>
              </Item>

              <Item key="governance-tab">
                <div id="governance" className="panel-grid two-column">
                  <article className="profile-card reveal">
                    <img
                      src="/assets/mai zazzau1.jpg"
                      alt="HRH Emir of Zazzau Suleja"
                      {...getImageFallbackProps('/assets/mai zazzau1.jpg', 'HRH Emir of Zazzau Suleja')}
                    />
                    <div>
                      <h3>HRH Malam Muhammad Awwal Ibrahim</h3>
                      <p>Emir of Zazzau Suleja and Chairman.</p>
                      <StatusLight variant="positive">Council leadership profile</StatusLight>
                    </div>
                  </article>
                  <article className="profile-card reveal">
                    <img
                      src="/assets/naibi.jpg"
                      alt="Acting Secretary"
                      {...getImageFallbackProps('/assets/naibi.jpg', 'Acting Secretary')}
                    />
                    <div>
                      <h3>Alhaji N. Saidu</h3>
                      <p>Acting Secretary.</p>
                      <StatusLight variant="info">Council administration profile</StatusLight>
                    </div>
                  </article>
                </div>
                <div className="member-list">
                  {councilLeaders.map((leader) => (
                    <article key={leader} className="member-pill reveal">
                      <p>{leader}</p>
                    </article>
                  ))}
                </div>
              </Item>

              <Item key="economy-tab">
                <div className="card-grid wide">
                  {businessSectors.map((sector) => (
                    <article key={sector.name} className="mini-card reveal">
                      <h3>{sector.name}</h3>
                      <p>{sector.detail}</p>
                    </article>
                  ))}
                </div>
              </Item>

              <Item key="infrastructure-tab">
                <div className="panel-grid two-column">
                  <Well>
                    <Heading level={3}>Social Infrastructure Priorities</Heading>
                    <div className="member-list">
                      {socialInfrastructure.map((service) => (
                        <article key={service} className="member-pill reveal">
                          <p>{service}</p>
                        </article>
                      ))}
                    </div>
                  </Well>
                  <article className="mini-card big-card reveal">
                    <h3>Sight and Sound</h3>
                    <p>
                      Landmark media from the old platform has been retained and showcased in a rotating hero and
                      gallery strip to support tourism and cultural education.
                    </p>
                    <img src="/assets/zuma-rock.JPG" alt="Zuma Rock" {...getImageFallbackProps('/assets/zuma-rock.JPG', 'Zuma Rock')} />
                  </article>
                </div>
              </Item>

              <Item key="contact-tab">
                <div id="contact" className="panel-grid two-column">
                  <Well>
                    <Heading level={3}>Council Contact Information</Heading>
                    <p className="contact-line">Suleja Emirate Council, Abuja Road, Niger State</p>
                    <p className="contact-line">
                      <img src="/assets/d2.jpg" alt="phone icon" {...getImageFallbackProps('/assets/d2.jpg', 'phone icon 1')} />
                      +234 909 995 5501
                    </p>
                    <p className="contact-line">
                      <img src="/assets/d1.jpg" alt="phone icon" {...getImageFallbackProps('/assets/d1.jpg', 'phone icon 2')} />
                      +234 909 995 5502
                    </p>
                    <p className="contact-line">
                      <img src="/assets/d3.jpg" alt="phone icon" {...getImageFallbackProps('/assets/d3.jpg', 'phone icon 3')} />
                      +234 909 995 5503
                    </p>
                    <p className="contact-line">Email: sulejaemiratecouncil@gmail.com</p>
                  </Well>
                  <Well>
                    <Form maxWidth="size-4600">
                      <TextField label="Full name" placeholder="Enter your full name" />
                      <TextField label="Email" type="email" placeholder="Enter your email address" />
                      <TextField label="Subject" placeholder="Subject" />
                      <TextArea label="Message" placeholder="Your message..." minHeight="size-2000" />
                      <Button variant="accent">Send Message</Button>
                    </Form>
                  </Well>
                </div>
                <div className="map-wrap reveal">
                  <iframe
                    title="Suleja Emirate location map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3395.1367834967905!2d7.176757114335122!3d9.175291993419469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104dd427f5734735%3A0x1c212b9e0df3079a!2sEmir%27s+Palace%2C+Kwamba!5e1!3m2!1sen!2sng!4v1533891033375"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </Item>
            </TabPanels>
          </Tabs>
        </section>
      </main>
    </>
  );
}

