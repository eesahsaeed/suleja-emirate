import {Provider, Text, View, defaultTheme} from '@adobe/react-spectrum';
import {BrowserRouter, Link, Navigate, Route, Routes} from 'react-router-dom';
import Building from '@spectrum-icons/workflow/Building';
import DevicePhone from '@spectrum-icons/workflow/DevicePhone';
import Email from '@spectrum-icons/workflow/Email';
import Event from '@spectrum-icons/workflow/Event';
import Globe from '@spectrum-icons/workflow/Globe';
import News from '@spectrum-icons/workflow/News';
import Play from '@spectrum-icons/workflow/Play';
import ViewGrid from '@spectrum-icons/workflow/ViewGrid';
import './App.css';
import AppFrame from './layout/AppFrame';
import HomePage from './pages/HomePage';
import LegacyDirectoryPage from './pages/LegacyDirectoryPage';
import LegacyPageView from './pages/LegacyPageView';

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AppFrame showNav={false}>
            <HomePage />
          </AppFrame>
        }
      />
      <Route
        path="/pages"
        element={
          <AppFrame>
            <LegacyDirectoryPage />
          </AppFrame>
        }
      />
      <Route
        path="/pages/:slug"
        element={
          <AppFrame>
            <LegacyPageView />
          </AppFrame>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Provider theme={defaultTheme} colorScheme="light" locale="en-US">
      <BrowserRouter future={{v7_startTransition: true, v7_relativeSplatPath: true}}>
        <View UNSAFE_className="site-shell">
          <AppRoutes />
          <footer className="site-footer legacy-footer">
            <div className="legacy-footer-shell">
              <section className="legacy-footer-card">
                <div className="legacy-footer-title-row">
                  <Building size="S" />
                  <h3>Suleja Emirate</h3>
                </div>
                <p className="legacy-footer-subtitle">Suleja Emirate Council</p>
                <div className="legacy-contact-list">
                  <a href="tel:+2349099955501" className="legacy-footer-inline-link">
                    <DevicePhone size="S" />
                    +2349099955501
                  </a>
                  <a href="tel:+2349099955502" className="legacy-footer-inline-link">
                    <DevicePhone size="S" />
                    +2349099955502
                  </a>
                  <a href="tel:+2349099955503" className="legacy-footer-inline-link">
                    <DevicePhone size="S" />
                    +2349099955503
                  </a>
                  <a href="mailto:sulejaemirate@gmail.com" className="legacy-footer-inline-link">
                    <Email size="S" />
                    sulejaemirate@gmail.com
                  </a>
                </div>
              </section>

              <section className="legacy-footer-card">
                <div className="legacy-footer-title-row">
                  <ViewGrid size="S" />
                  <h3>Browse pages</h3>
                </div>
                <div className="legacy-footer-links">
                  <Link to="/pages/business-catelog" className="legacy-footer-inline-link">
                    <Building size="S" />
                    Business Catelog
                  </Link>
                  <Link to="/pages/v" className="legacy-footer-inline-link">
                    <Play size="S" />
                    Sight &amp; Sound
                  </Link>
                  <Link to="/pages/pic" className="legacy-footer-inline-link">
                    <Event size="S" />
                    Event &amp; Festival
                  </Link>
                  <Link to="/pages/tra" className="legacy-footer-inline-link">
                    <News size="S" />
                    Politics
                  </Link>
                </div>
              </section>

              <section className="legacy-footer-card">
                <div className="legacy-footer-title-row">
                  <Globe size="S" />
                  <h3>Suleja Emirate</h3>
                </div>
                <p className="legacy-footer-subtitle">Preserving heritage, leadership, and community identity.</p>
                <Link to="/" className="legacy-footer-inline-link">
                  <Building size="S" />
                  Suleja Emirate
                </Link>
              </section>
            </div>
            <Text UNSAFE_className="legacy-footer-copy">(c) {new Date().getFullYear()} Suleja Emirate . All right reserved.</Text>
          </footer>
        </View>
      </BrowserRouter>
    </Provider>
  );
}
