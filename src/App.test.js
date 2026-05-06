import { render, screen } from '@testing-library/react';
import App from './App';

test('renders suleja emirate heading', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { level: 1, name: /Suleja Emirate Council/i });
  expect(heading).toBeInTheDocument();
});
