import { useState } from "react";

export const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:8000";

  const publicEndpoints = [
    '/api/v1/auth/register',
    '/api/v1/auth/login',
    '/api/v1/auth/mfa/setup',
    '/api/v1/auth/mfa/verify'
  ];

  const request = async (url, options) => {
    setIsLoading(true);
    try {
      console.log('Requesting:', url, options);
      if (!API_URL) {
        throw new Error(
          "API URL is not defined. Please set REACT_APP_API_URL in .env"
        );
      }

      const isPublic = publicEndpoints.some(endpoint => url.includes(endpoint));
      const headers = {
        "Content-Type": "application/json",
        ...options?.headers,
      };

      if (!isPublic) {
        const token = localStorage.getItem("token");
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
      }

      const response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error ${response.status}`);
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { request, isLoading, error };
};