import { useAuth } from "@clerk/expo";
import axios from "axios";
import { useEffect } from "react";

const api = axios.create({
  baseURL: "http://localhost:5050/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// On every "single REQ", we would have an authToken so that our backend knows that "auth USER".

export function useApi() {
  const { getToken } = useAuth();

  useEffect(() => {
    const interceptor = api.interceptors.request.use(async (config) => {
      const token = await getToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, [getToken]);

  return api;
}
