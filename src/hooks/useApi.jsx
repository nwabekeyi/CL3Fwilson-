import { useState, useCallback } from 'react';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async ({ url, method = 'GET', data = null, headers = {} }) => {
    setLoading(true);
    setError(null);

    try {
      const config = {
        method,
        headers: {
          // Only set Content-Type to application/json if data is not FormData
          ...(data instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
          ...headers,
        },
        // Only stringify body if data is not FormData
        ...(data && { body: data instanceof FormData ? data : JSON.stringify(data) }),
      };

      const response = await fetch(url, config);

      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      const result = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        throw new Error(result?.error || result || 'API request failed');
      }

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array ensures `request` reference stays stable

  return { request, loading, error };
};

export default useApi;