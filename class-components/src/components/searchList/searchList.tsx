import { Component } from 'react';
import { Person } from '../../services/api.ts';
import SearchItem from '../searchItem/searchItem.tsx';
import Loader from '../UI/loader/loader.tsx';
import style from './searchList.module.css';

interface SearchListProps {
  results: Person[];
  loading: boolean;
  errorMessage: string;
  error: boolean;
  throwError: boolean;
}

class SearchList extends Component<SearchListProps> {
  render() {
    const { results, loading, error, errorMessage, throwError } = this.props;

    if (throwError) {
      throw new Error('Test error from ErrorBoundary');
    }

    if (loading) {
      return <Loader />;
    }

    if (error) {
      return <p className={style.error}>{errorMessage}</p>;
    }

    if (results.length === 0) {
      return <p>No results found</p>;
    }

    return (
      <ul className={style.list}>
        {results.map((person) => (
          <SearchItem key={person.name} person={person} />
        ))}
      </ul>
    );
  }
}

export default SearchList;
