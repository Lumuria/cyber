/* @vitest-environment jsdom */
import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import './i18n';
import App from './App';
import { routerFuture } from './routerFuture';

test('renders home navigation', () => {
  render(
    <BrowserRouter future={routerFuture}>
      <App />
    </BrowserRouter>
  );
  expect(screen.getByRole('link', { name: /^home$/i })).toBeTruthy();
});
