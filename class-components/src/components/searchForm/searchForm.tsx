import { ChangeEvent, Component } from 'react';
import style from './searchForm.module.css';

interface SearchFormProps {
  onSearch: () => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onErrorTest: () => void;
  searchQuery: string;
}

class SearchForm extends Component<SearchFormProps> {
  render() {
    const { onSearch, onChange, searchQuery, onErrorTest } = this.props;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSearch();
    };

    return (
      <form className={style.searchBox} onSubmit={handleSubmit}>
        <input className={style.input} type='text' value={searchQuery} onChange={onChange} />
        <button className={style.button} type='submit'>
          Search
        </button>
        <button className={style.button} type='button' onClick={onErrorTest}>
          Test error
        </button>
      </form>
    );
  }
}

export default SearchForm;
