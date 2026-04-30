import { API_PERSON, API_URL } from './apiUrl';

export interface Person {
  name: string;
  birth_year: string;
  gender: string;
}

export interface Persons {
  results: Person[];
  loading: boolean;
}

async function getAllData(url: string, allData: Persons): Promise<Persons> {
  const response = await fetch(url, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  allData.results = allData.results.concat(data.results);

  if (data.next) {
    return getAllData(data.next, allData);
  } else {
    return allData;
  }
}

export async function getData(): Promise<Persons> {
  const allData: Persons = {
    results: [],
    loading: true,
  };

  return getAllData(API_URL, allData);
}

export async function searchPerson(querySearch: string) {
  const response = await fetch(`${API_PERSON}${querySearch}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to search: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.results;
}
