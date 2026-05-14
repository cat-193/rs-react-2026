import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, userEvent } from './utils/test-utils';
import App from '../App';
import * as api from '../services/api';
import { mockPersons } from './utils/test-utils';

vi.mock('../services/api');

describe('App', () => {
  const mockGetData = vi.mocked(api.getData);
  const mockSearchPerson = vi.mocked(api.searchPerson);

  const mockGetDataResponse = {
    results: mockPersons.slice(0, 2),
    loading: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockGetData.mockResolvedValue(mockGetDataResponse);
    mockSearchPerson.mockResolvedValue([]);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should render app title', () => {
    render(<App />);

    expect(screen.getByText('Star Wars characters')).toBeInTheDocument();
  });

  it('should render search form', () => {
    render(<App />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('should fetch all data on mount when no localStorage query exists', async () => {
    render(<App />);

    await waitFor(() => {
      expect(mockGetData).toHaveBeenCalledTimes(1);
    });
  });

  it('should display loading state initially', () => {
    render(<App />);

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('should display results after successful fetch', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Leia Organa/i)).toBeInTheDocument();
  });

  it('should handle search query input', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
    });

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Darth');

    expect(input).toHaveValue('Darth');
  });

  it('should search for person when search button is clicked', async () => {
    const user = userEvent.setup();
    const searchResults = [{ name: 'Darth Vader', birth_year: '41.9BBY', gender: 'male' }];
    mockSearchPerson.mockResolvedValue(searchResults);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
    });

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Darth');

    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    await waitFor(() => {
      expect(mockSearchPerson).toHaveBeenCalledWith('Darth');
    });

    await waitFor(() => {
      expect(screen.getByText(/Darth Vader/i)).toBeInTheDocument();
    });
  });

  it('should save search query to localStorage', async () => {
    const user = userEvent.setup();
    mockSearchPerson.mockResolvedValue([
      { name: 'Darth Vader', birth_year: '41.9BBY', gender: 'male' },
    ]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
    });

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Vader');

    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    await waitFor(() => {
      expect(localStorage.getItem('searchQuery')).toBe('Vader');
    });
  });

  it('should remove search query from localStorage when searching empty string', async () => {
    const user = userEvent.setup();
    localStorage.setItem('searchQuery', 'Luke');
    mockSearchPerson.mockResolvedValue([
      { name: 'Luke Skywalker', birth_year: '19BBY', gender: 'male' },
    ]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
    });

    const input = screen.getByRole('textbox');
    await user.clear(input);

    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    await waitFor(() => {
      expect(localStorage.getItem('searchQuery')).toBeNull();
    });
  });

  it('should load search query from localStorage on mount', async () => {
    localStorage.setItem('searchQuery', 'Yoda');
    mockSearchPerson.mockResolvedValue([{ name: 'Yoda', birth_year: '896BBY', gender: 'male' }]);

    render(<App />);

    await waitFor(() => {
      expect(mockSearchPerson).toHaveBeenCalledWith('Yoda');
    });

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('Yoda');
  });

  it('should not search again if query is the same', async () => {
    const user = userEvent.setup();
    mockSearchPerson.mockResolvedValue([
      { name: 'Luke Skywalker', birth_year: '19BBY', gender: 'male' },
    ]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
    });

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Luke');

    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    await waitFor(() => {
      expect(mockSearchPerson).toHaveBeenCalledWith('Luke');
    });

    mockSearchPerson.mockClear();

    await user.click(searchButton);

    expect(mockSearchPerson).not.toHaveBeenCalled();
  });

  it('should trim search query before searching', async () => {
    const user = userEvent.setup();
    mockSearchPerson.mockResolvedValue([
      { name: 'Luke Skywalker', birth_year: '19BBY', gender: 'male' },
    ]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
    });

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, '  Luke  ');

    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    await waitFor(() => {
      expect(mockSearchPerson).toHaveBeenCalledWith('Luke');
    });

    expect(localStorage.getItem('searchQuery')).toBe('Luke');
  });

  it('should display error message when fetch fails', async () => {
    mockGetData.mockRejectedValue(new Error('Network error'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });

  it('should display generic error message for non-Error objects', async () => {
    mockGetData.mockRejectedValue('Unknown error');

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch data. Please try again./i)).toBeInTheDocument();
    });
  });

  it('should handle search error', async () => {
    const user = userEvent.setup();
    mockSearchPerson.mockRejectedValue(new Error('Search failed'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
    });

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Invalid');

    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/Search failed/i)).toBeInTheDocument();
    });
  });

  it('should trigger error boundary when test error button is clicked', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
    });

    const errorButton = screen.getByRole('button', { name: /test error/i });
    await user.click(errorButton);

    await waitFor(() => {
      expect(
        screen.getByText(/May the force be with you with test error! Refresh page/i)
      ).toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });

  it('should display "No results found" when search returns empty array', async () => {
    const user = userEvent.setup();
    mockSearchPerson.mockResolvedValue([]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
    });

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'NonExistent');

    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });
  });

  it('should show loading state during search', async () => {
    const user = userEvent.setup();
    let resolveSearch: (value: api.Person[]) => void;
    const searchPromise = new Promise<api.Person[]>((resolve) => {
      resolveSearch = resolve;
    });
    mockSearchPerson.mockReturnValue(searchPromise);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
    });

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Yoda');

    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    expect(screen.getByText('Loading')).toBeInTheDocument();

    resolveSearch!([{ name: 'Yoda', birth_year: '896BBY', gender: 'male' }]);

    await waitFor(() => {
      expect(screen.getByText(/Yoda/i)).toBeInTheDocument();
    });
  });

  it('should handle localStorage with existing query correctly', async () => {
    localStorage.setItem('searchQuery', 'Leia');
    mockSearchPerson.mockResolvedValue([
      { name: 'Leia Organa', birth_year: '19BBY', gender: 'female' },
    ]);

    render(<App />);

    await waitFor(() => {
      expect(mockSearchPerson).toHaveBeenCalledWith('Leia');
    });

    await waitFor(() => {
      expect(screen.getByText(/Leia Organa/i)).toBeInTheDocument();
    });

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('Leia');
  });
});
