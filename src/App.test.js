import { render, screen } from '@testing-library/react';
import config from './config';
import App from './App';

console.log("=== config ===", config)

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
