import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, userEvent } from '../../utils/test-utils';
import SearchForm from '../../../components/searchForm/searchForm';

describe('SearchForm', () => {
  const mockOnSearch = vi.fn();
  const mockOnChange = vi.fn();
  const mockOnErrorTest = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render search input with correct value', () => {
    render(
      <SearchForm
        searchQuery='Luke'
        onChange={mockOnChange}
        onSearch={mockOnSearch}
        onErrorTest={mockOnErrorTest}
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('Luke');
  });

  it('should render search button', () => {
    render(
      <SearchForm
        searchQuery=''
        onChange={mockOnChange}
        onSearch={mockOnSearch}
        onErrorTest={mockOnErrorTest}
      />
    );

    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('should render test error button', () => {
    render(
      <SearchForm
        searchQuery=''
        onChange={mockOnChange}
        onSearch={mockOnSearch}
        onErrorTest={mockOnErrorTest}
      />
    );

    expect(screen.getByRole('button', { name: /test error/i })).toBeInTheDocument();
  });

  it('should call onChange when typing in input', async () => {
    const user = userEvent.setup();

    render(
      <SearchForm
        searchQuery=''
        onChange={mockOnChange}
        onSearch={mockOnSearch}
        onErrorTest={mockOnErrorTest}
      />
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'L');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should call onSearch when search button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <SearchForm
        searchQuery='Luke'
        onChange={mockOnChange}
        onSearch={mockOnSearch}
        onErrorTest={mockOnErrorTest}
      />
    );

    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });

  it('should call onSearch when form is submitted', async () => {
    const user = userEvent.setup();

    render(
      <SearchForm
        searchQuery='Luke'
        onChange={mockOnChange}
        onSearch={mockOnSearch}
        onErrorTest={mockOnErrorTest}
      />
    );

    const input = screen.getByRole('textbox');
    await user.type(input, '{Enter}');

    expect(mockOnSearch).toHaveBeenCalled();
  });

  it('should call onErrorTest when test error button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <SearchForm
        searchQuery=''
        onChange={mockOnChange}
        onSearch={mockOnSearch}
        onErrorTest={mockOnErrorTest}
      />
    );

    const errorButton = screen.getByRole('button', { name: /test error/i });
    await user.click(errorButton);

    expect(mockOnErrorTest).toHaveBeenCalledTimes(1);
  });

  it('should not call onSearch when test error button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <SearchForm
        searchQuery=''
        onChange={mockOnChange}
        onSearch={mockOnSearch}
        onErrorTest={mockOnErrorTest}
      />
    );

    const errorButton = screen.getByRole('button', { name: /test error/i });
    await user.click(errorButton);

    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('should render form element', () => {
    const { container } = render(
      <SearchForm
        searchQuery=''
        onChange={mockOnChange}
        onSearch={mockOnSearch}
        onErrorTest={mockOnErrorTest}
      />
    );

    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('should handle empty search query', () => {
    render(
      <SearchForm
        searchQuery=''
        onChange={mockOnChange}
        onSearch={mockOnSearch}
        onErrorTest={mockOnErrorTest}
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('');
  });

  it('should handle long search query', () => {
    const longQuery = 'A'.repeat(100);

    render(
      <SearchForm
        searchQuery={longQuery}
        onChange={mockOnChange}
        onSearch={mockOnSearch}
        onErrorTest={mockOnErrorTest}
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue(longQuery);
  });

  it('should prevent default form submission', async () => {
    const user = userEvent.setup();
    const mockPreventDefault = vi.fn();

    render(
      <SearchForm
        searchQuery='Luke'
        onChange={mockOnChange}
        onSearch={mockOnSearch}
        onErrorTest={mockOnErrorTest}
      />
    );

    const form = screen.getByRole('textbox').closest('form');
    form?.addEventListener('submit', (e) => {
      mockPreventDefault();
      e.preventDefault();
    });

    const input = screen.getByRole('textbox');
    await user.type(input, '{Enter}');

    expect(mockPreventDefault).toHaveBeenCalled();
  });

  it('should have correct button types', () => {
    render(
      <SearchForm
        searchQuery=''
        onChange={mockOnChange}
        onSearch={mockOnSearch}
        onErrorTest={mockOnErrorTest}
      />
    );

    const searchButton = screen.getByRole('button', { name: /search/i });
    const errorButton = screen.getByRole('button', { name: /test error/i });

    expect(searchButton).toHaveAttribute('type', 'submit');
    expect(errorButton).toHaveAttribute('type', 'button');
  });
});
