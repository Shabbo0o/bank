import React from 'react';
import { render, screen } from '@testing-library/react';
import Hello from '../Hello';

describe('Hello component', () => {
    it('renders greeting with name', () => {
        render(<Hello name="Shabboo" />);
        expect(screen.getByText(/Hello, Shabboo!/i)).toBeInTheDocument();
    });
});
