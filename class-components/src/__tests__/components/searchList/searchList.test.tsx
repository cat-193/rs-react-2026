import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../utils/test-utils';
import SearchList from '../../../components/searchList/searchList';
import { mockPersons } from '../../utils/test-utils';
import { Person } from '../../../services/api';

describe('SearchList', () => {
  const mockResults = mockPersons;

  it('should render loader when loading is true', () => {
    render(
      <SearchList results={[]} loading={true} error={false} errorMessage='' throwError={false} />
    );

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('should render error message when error is true', () => {
    const errorMsg = 'Failed to fetch data';

    render(
      <SearchList
        results={[]}
        loading={false}
        error={true}
        errorMessage={errorMsg}
        throwError={false}
      />
    );

    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  it('should render "No results found" when results array is empty', () => {
    render(
      <SearchList results={[]} loading={false} error={false} errorMessage='' throwError={false} />
    );

    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('should render list of results when data is available', () => {
    render(
      <SearchList
        results={mockResults}
        loading={false}
        error={false}
        errorMessage=''
        throwError={false}
      />
    );

    expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
    expect(screen.getByText(/Leia Organa/i)).toBeInTheDocument();
    expect(screen.getByText(/Han Solo/i)).toBeInTheDocument();
  });

  it('should render correct number of list items', () => {
    render(
      <SearchList
        results={mockResults}
        loading={false}
        error={false}
        errorMessage=''
        throwError={false}
      />
    );

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
  });

  it('should throw error when throwError is true', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() =>
      render(
        <SearchList
          results={mockResults}
          loading={false}
          error={false}
          errorMessage=''
          throwError={true}
        />
      )
    ).toThrow('Test error from ErrorBoundary');

    consoleErrorSpy.mockRestore();
  });

  it('should prioritize loading state over results', () => {
    render(
      <SearchList
        results={mockResults}
        loading={true}
        error={false}
        errorMessage=''
        throwError={false}
      />
    );

    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(screen.queryByText(/Luke Skywalker/i)).not.toBeInTheDocument();
  });

  it('should prioritize error state over results', () => {
    const errorMsg = 'Network error';

    render(
      <SearchList
        results={mockResults}
        loading={false}
        error={true}
        errorMessage={errorMsg}
        throwError={false}
      />
    );

    expect(screen.getByText(errorMsg)).toBeInTheDocument();
    expect(screen.queryByText(/Luke Skywalker/i)).not.toBeInTheDocument();
  });

  it('should render single result correctly', () => {
    const singleResult: Person[] = [{ name: 'Darth Vader', birth_year: '41.9BBY', gender: 'male' }];

    render(
      <SearchList
        results={singleResult}
        loading={false}
        error={false}
        errorMessage=''
        throwError={false}
      />
    );

    expect(screen.getByText(/Darth Vader/i)).toBeInTheDocument();
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(1);
  });

  it('should render list with ul element', () => {
    const { container } = render(
      <SearchList
        results={mockResults}
        loading={false}
        error={false}
        errorMessage=''
        throwError={false}
      />
    );

    const list = container.querySelector('ul');
    expect(list).toBeInTheDocument();
  });
});
