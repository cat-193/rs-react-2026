import { Component } from 'react';
import { Person } from '../../services/api';
import style from './searchItem.module.css';

class SearchItem extends Component<{ person: Person }> {
  render() {
    const { person } = this.props;

    return (
      <li className={style.item}>
        <strong>Name: {person.name}</strong>
        <p>Gender: {person.gender}</p>
        <p>Birth: {person.birth_year}</p>
      </li>
    );
  }
}

export default SearchItem;
