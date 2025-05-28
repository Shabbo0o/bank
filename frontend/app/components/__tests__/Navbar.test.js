import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from '../Navbar';

// ✅ Mock next/link to avoid context errors
jest.mock('next/link', () => {
  return ({ children }) => {
    return <div>{children}</div>;
  };
});

describe('Navbar component', () => {
  it('renders navigation links', () => {
    render(<Navbar />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/account/i)).toBeInTheDocument();

  });
});
