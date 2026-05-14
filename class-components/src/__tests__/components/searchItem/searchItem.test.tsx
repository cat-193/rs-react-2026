import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../__tests__/utils/test-utils';
import SearchItem from '../../../components/searchItem/searchItem';
import { mockPerson, mockPersons } from '../../../__tests__/utils/test-utils';

describe('SearchItem', () => {
  it('should render person name', () => {
    render(<SearchItem person={mockPerson} />);

    expect(screen.getByText(/Name: Luke Skywalker/i)).toBeInTheDocument();
  });

  it('should render person gender', () => {
    render(<SearchItem person={mockPerson} />);

    expect(screen.getByText(/Gender: male/i)).toBeInTheDocument();
  });

  it('should render person birth year', () => {
    render(<SearchItem person={mockPerson} />);

    expect(screen.getByText(/Birth: 19BBY/i)).toBeInTheDocument();
  });

  it('should render as list item', () => {
    const { container } = render(<SearchItem person={mockPerson} />);

    const listItem = container.querySelector('li');
    expect(listItem).toBeInTheDocument();
  });

  it('should render female character correctly', () => {
    const femalePerson = mockPersons[1];

    render(<SearchItem person={femalePerson} />);

    expect(screen.getByText(/Name: Leia Organa/i)).toBeInTheDocument();
    expect(screen.getByText(/Gender: female/i)).toBeInTheDocument();
  });

  it('should render character with unknown birth year', () => {
    const unknownBirthPerson = {
      name: 'Yoda',
      birth_year: 'unknown',
      gender: 'male',
    };

    render(<SearchItem person={unknownBirthPerson} />);

    expect(screen.getByText(/Birth: unknown/i)).toBeInTheDocument();
  });

  it('should render character with n/a gender', () => {
    const droidPerson = {
      name: 'C-3PO',
      birth_year: '112BBY',
      gender: 'n/a',
    };

    render(<SearchItem person={droidPerson} />);

    expect(screen.getByText(/Gender: n\/a/i)).toBeInTheDocument();
  });

  it('should render all person properties together', () => {
    render(<SearchItem person={mockPerson} />);

    const listItem = screen.getByRole('listitem');
    expect(listItem).toHaveTextContent('Luke Skywalker');
    expect(listItem).toHaveTextContent('male');
    expect(listItem).toHaveTextContent('19BBY');
  });
});
