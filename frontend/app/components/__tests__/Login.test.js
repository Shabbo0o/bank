import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ✅ Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

import Login from '../../login/page';

it('renders login form', () => {
  render(<Login />);
  expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
});

it('allows user to type in inputs', async () => {
  render(<Login />);
  const usernameInput = screen.getByPlaceholderText(/username/i);
  const passwordInput = screen.getByPlaceholderText(/password/i);

  await userEvent.type(usernameInput, 'user');
  await userEvent.type(passwordInput, '123');

  expect(usernameInput).toHaveValue('user');
  expect(passwordInput).toHaveValue('123');
});
