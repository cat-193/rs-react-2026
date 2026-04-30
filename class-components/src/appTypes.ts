import { Person } from './services/api';

export interface AppState {
  results: Person[];
  searchQuery: string;
  loading: boolean;
  error: boolean;
  errorMessage: string;
  throwError: boolean;
}
