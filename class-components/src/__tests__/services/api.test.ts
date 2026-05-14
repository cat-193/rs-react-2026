import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getData, searchPerson } from '../../services/api';
import { API_URL, API_PERSON } from '../../services/apiUrl';
import {
  mockPersons,
  mockApiResponseWithPagination,
  setupFetchMock,
  setupFetchError,
} from '../utils/test-utils';

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getData', () => {
    it('should fetch all data from single page', async () => {
      const mockData = {
        results: mockPersons.slice(0, 2),
        next: null,
      };

      globalThis.fetch = setupFetchMock(mockData);

      const result = await getData();

      expect(globalThis.fetch).toHaveBeenCalledWith(API_URL, { method: 'GET' });
      expect(result.results).toEqual(mockData.results);
      expect(result.loading).toBe(true);
    });

    it('should fetch all data from multiple pages', async () => {
      const { page1, page2 } = mockApiResponseWithPagination;

      globalThis.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => page1,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => page2,
        });

      const result = await getData();

      expect(globalThis.fetch).toHaveBeenCalledTimes(2);
      expect(result.results).toHaveLength(2);
      expect(result.results[0].name).toBe('Luke Skywalker');
      expect(result.results[1].name).toBe('Leia Organa');
    });

    it('should throw error when fetch fails', async () => {
      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(getData()).rejects.toThrow('Failed to fetch data: 404 Not Found');
    });

    it('should throw error on network failure', async () => {
      globalThis.fetch = setupFetchError('Network error');

      await expect(getData()).rejects.toThrow('Network error');
    });
  });

  describe('searchPerson', () => {
    it('should search for a person successfully', async () => {
      const mockData = {
        results: [mockPersons[0]],
      };

      globalThis.fetch = setupFetchMock(mockData);

      const result = await searchPerson('Luke');

      expect(globalThis.fetch).toHaveBeenCalledWith(`${API_PERSON}Luke`, { method: 'GET' });
      expect(result).toEqual(mockData.results);
    });

    it('should return empty results when no match found', async () => {
      const mockData = {
        results: [],
      };

      globalThis.fetch = setupFetchMock(mockData);

      const result = await searchPerson('NonExistent');

      expect(result).toEqual([]);
    });

    it('should throw error when search fails', async () => {
      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(searchPerson('Luke')).rejects.toThrow(
        'Failed to search: 500 Internal Server Error'
      );
    });

    it('should handle special characters in search query', async () => {
      const mockData = {
        results: [{ name: 'C-3PO', birth_year: '112BBY', gender: 'n/a' }],
      };

      globalThis.fetch = setupFetchMock(mockData);

      const result = await searchPerson('C-3PO');

      expect(globalThis.fetch).toHaveBeenCalledWith(`${API_PERSON}C-3PO`, { method: 'GET' });
      expect(result).toEqual(mockData.results);
    });
  });
});
