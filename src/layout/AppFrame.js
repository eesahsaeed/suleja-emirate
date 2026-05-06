import LegacySiteHeader from '../components/LegacySiteHeader';

export default function AppFrame({children, showNav = true}) {
  return (
    <>
      {showNav ? <LegacySiteHeader /> : null}
      {children}
    </>
  );
}
