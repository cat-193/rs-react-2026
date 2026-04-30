import { Component } from 'react';
import './App.css';
import SearchForm from './components/searchForm/searchForm.tsx';
import SearchList from './components/searchList/searchList.tsx';
import ErrorBoundary from './components/errorBoundary/errorBoundary.tsx';
import { getData, searchPerson } from './services/api';
import { AppState } from './appTypes.ts';

class App extends Component<object, AppState> {
  private previousSearchQuery: string = '';

  constructor(props: object) {
    super(props);
    this.state = {
      searchQuery: '',
      loading: true,
      results: [],
      error: false,
      errorMessage: '',
      throwError: false,
    };
  }

  componentDidMount() {
    const querySearch = localStorage.getItem('searchQuery');
    if (querySearch) {
      this.previousSearchQuery = querySearch;
      this.setState({ searchQuery: querySearch });
      this.getFetchData(querySearch);
    } else {
      this.getFetchData('');
    }
  }

  getFetchData = async (querySearch: string) => {
    try {
      if (querySearch) {
        const person = await searchPerson(querySearch);
        this.setState({ results: person, loading: false, error: false });
      } else {
        const data = await getData();
        this.setState({ results: data.results, loading: false, error: false });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch data. Please try again.';
      console.error('Error fetching data:', error);
      this.setState({
        loading: false,
        error: true,
        errorMessage,
      });
    }
  };

  handleSearch = () => {
    const trimmedQuery = this.state.searchQuery.trim();

    if (trimmedQuery === this.previousSearchQuery) {
      return;
    }

    this.previousSearchQuery = trimmedQuery;
    this.setState({ loading: true });

    if (trimmedQuery !== '') {
      localStorage.setItem('searchQuery', trimmedQuery);
      this.getFetchData(trimmedQuery);
    } else {
      localStorage.removeItem('searchQuery');
      this.getFetchData('');
    }
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchQuery: event.target.value });
  };

  getError = () => {
    this.setState({
      throwError: true,
    });
  };

  render() {
    const { results, loading, searchQuery, errorMessage, error, throwError } = this.state;

    return (
      <div className='container'>
        <h1 className='title'>Star Wars characters</h1>

        <SearchForm
          searchQuery={searchQuery}
          onChange={this.handleChange}
          onSearch={this.handleSearch}
          onErrorTest={this.getError}
        />
        <ErrorBoundary>
          <SearchList
            results={results}
            loading={loading}
            error={error}
            errorMessage={errorMessage}
            throwError={throwError}
          />
        </ErrorBoundary>
      </div>
    );
  }
}

export default App;
