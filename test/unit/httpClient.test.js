import { describe, it, expect } from 'vitest';
import httpClient, { publicApi } from '../../src/shared/services/httpClient';
import api from '../../src/shared/services/api';
import { shouldSkipTokenRefresh } from '../../src/shared/utils/authRefresh';

describe('HttpClient & Token Refresh Contracts Suite', () => {
  it('httpClient and api instances are defined and configure defaults', () => {
    expect(httpClient).toBeDefined();
    expect(api).toBeDefined();
    expect(publicApi).toBeDefined();
    expect(httpClient.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('shouldSkipTokenRefresh correctly skips authentication endpoints to prevent loop', () => {
    expect(shouldSkipTokenRefresh('/auth/login')).toBe(true);
    expect(shouldSkipTokenRefresh('/auth/register')).toBe(true);
    expect(shouldSkipTokenRefresh('/auth/refresh')).toBe(true);
    expect(shouldSkipTokenRefresh('/auth/google')).toBe(true);
    expect(shouldSkipTokenRefresh('/auth/sso/callback')).toBe(true);
  });

  it('shouldSkipTokenRefresh does not skip protected domain endpoints', () => {
    expect(shouldSkipTokenRefresh('/projects')).toBe(false);
    expect(shouldSkipTokenRefresh('/articles/trending')).toBe(false);
    expect(shouldSkipTokenRefresh('/authors/orcid')).toBe(false);
    expect(shouldSkipTokenRefresh('/bookmarks')).toBe(false);
  });

  it('shouldSkipTokenRefresh safely handles empty and undefined inputs', () => {
    expect(shouldSkipTokenRefresh('')).toBe(false);
    expect(shouldSkipTokenRefresh(null)).toBe(false);
    expect(shouldSkipTokenRefresh(undefined)).toBe(false);
  });
});
