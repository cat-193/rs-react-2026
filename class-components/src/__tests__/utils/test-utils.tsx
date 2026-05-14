import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { vi } from 'vitest';

export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { ...options });
}

export const mockPerson = {
  name: 'Luke Skywalker',
  birth_year: '19BBY',
  gender: 'male',
};

export const mockPersons = [
  { name: 'Luke Skywalker', birth_year: '19BBY', gender: 'male' },
  { name: 'Leia Organa', birth_year: '19BBY', gender: 'female' },
  { name: 'Han Solo', birth_year: '29BBY', gender: 'male' },
];

export const mockApiResponse = {
  results: mockPersons,
  next: null,
};

export const mockApiResponseWithPagination = {
  page1: {
    results: [mockPersons[0]],
    next: 'https://swapi.py4e.com/api/people/?page=2',
  },
  page2: {
    results: [mockPersons[1]],
    next: null,
  },
};

export function setupFetchMock(mockData: unknown, ok = true, status = 200) {
  return vi.fn().mockResolvedValueOnce({
    ok,
    status,
    statusText: ok ? 'OK' : 'Error',
    json: async () => mockData,
  });
}

export function setupFetchError(errorMessage: string) {
  return vi.fn().mockRejectedValueOnce(new Error(errorMessage));
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
