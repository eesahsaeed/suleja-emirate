import {Link} from 'react-router-dom';
import Calendar from '@spectrum-icons/workflow/Calendar';
import Camera from '@spectrum-icons/workflow/Camera';
import Globe from '@spectrum-icons/workflow/Globe';
import News from '@spectrum-icons/workflow/News';
import User from '@spectrum-icons/workflow/User';

const topLinks = [
  {label: 'Home', to: '/'},
  {label: 'Site Map', to: '/pages'},
  {label: 'Contact Us', to: '/pages/contact'},
  {label: 'Politics', to: '/pages/tra'},
  {label: 'Event', to: '/pages/pic'}
];

const navGroups = [
  {
    label: 'About Us',
    items: [
      {label: 'History of the Emirate', to: '/pages/g'},
      {label: 'Traditional Structure and Districts', to: '/pages/trad'},
      {label: 'Suleja Emirate Council Members', to: '/pages/typography'},
      {label: 'Brief History of Emirs of the Emirate', to: '/pages/tile'}
    ]
  },
  {
    label: 'Sight & Sound',
    items: [
      {label: 'Photo Gallery', to: '/pages/gallery'},
      {label: 'Videos', to: '/pages/v'},
      {label: 'Short Documentary on Suleja Emirate', to: '/pages/short'}
    ]
  },
  {
    label: 'Business Catalog',
    items: [
      {label: 'Market Place', to: '/pages/busi'},
      {label: 'Industries/Factories', to: '/pages/indus'}
    ]
  },
  {
    label: 'Social Infrastructure',
    items: [
      {label: 'Education', to: '/pages/edu'},
      {label: 'Housing', to: '/pages/has'},
      {label: 'Civic and Utility', to: '/pages/civic'},
      {label: 'Transport', to: '/pages/trans'},
      {label: 'Corrections and Justice', to: '/pages/jus'}
    ]
  }
];

const socialIcons = [
  {label: 'Facebook', icon: Globe},
  {label: 'Twitter', icon: Calendar},
  {label: 'LinkedIn', icon: User},
  {label: 'Pinterest', icon: Camera},
  {label: 'Google Plus', icon: News}
];

function closeDropdown(event) {
  const parentDetails = event.currentTarget.closest('details');
  if (parentDetails) {
    parentDetails.removeAttribute('open');
  }
}

export default function LegacySiteHeader({inHero = false}) {
  return (
    <header className={`legacy-site-header${inHero ? ' in-hero' : ''}`}>
      <div className="legacy-topbar">
        <div className="legacy-top-links">
          {topLinks.map((item) => (
            <Link key={item.label} to={item.to}>
              {item.label}
            </Link>
          ))}
        </div>
        <div className="legacy-social-links" aria-label="Social links">
          {socialIcons.map((item) => (
            <span key={item.label} className="legacy-social-pill" title={item.label} aria-label={item.label}>
              <item.icon size="S" />
            </span>
          ))}
        </div>
      </div>

      <div className="legacy-mainbar">
        <Link to="/" className="legacy-logo-link" aria-label="Suleja Emirate Council">
          <img src="/assets/sc1.png" alt="Suleja Emirate emblem" />
        </Link>

        <nav className="legacy-main-nav" aria-label="Primary navigation">
          <Link to="/">Home</Link>

          {navGroups.map((group) => (
            <details key={group.label} className="legacy-nav-group">
              <summary>{group.label}</summary>
              <div className="legacy-nav-menu">
                {group.items.map((item) => (
                  <Link key={item.to} to={item.to} onClick={closeDropdown}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </details>
          ))}

          <Link to="/pages/soil">Soil Map</Link>
        </nav>
      </div>
    </header>
  );
}
