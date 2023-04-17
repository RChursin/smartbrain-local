import { render, screen } from '@testing-library/react';
import App from './App';

test('SignOut button is shown on the page', () => {
  render(<App />);
  const linkElement = screen.getByText(/Sign Out/i);
  expect(linkElement).toBeInTheDocument();
});
