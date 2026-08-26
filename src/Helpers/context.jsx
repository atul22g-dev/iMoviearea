import React, { useContext, useReducer, useEffect, useCallback, useRef, useMemo } from "react";
import reducer from "./reducer";

const AppContext = React.createContext();
const API = `https://apis-atual-dev.vercel.app/api/movies`;
const API_KEY = import.meta.env.VITE_X_API_KEY;

// Cache for movie data to avoid redundant fetches
let movieCache = null;
let singleCache = {};

const initialState = { Amovies: [], Smovies: {} };

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const abortRef = useRef(null);

  const getProjects = useCallback(async (url) => {
    // Return cached data if available
    if (movieCache) {
      dispatch({ type: "GET_PROJECTS", payload: movieCache });
      return;
    }

    // Abort previous request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(url, {
        headers: { "X-API-Key": API_KEY },
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      movieCache = data; // Cache the result
      dispatch({ type: "GET_PROJECTS", payload: data });
    } catch (error) {
      if (error.name !== "AbortError") {
        console.warn("Failed to fetch movies:", error.message);
      }
    }
  }, []);

  const getSingleProjects = useCallback(
    async (query) => {
      // Return cached single if available
      if (singleCache[query]) {
        const cached = singleCache[query];
        dispatch({ type: "GET_SINGLE_PROJECTS", payload: cached });
        return;
      }

      try {
        const res = await fetch(API, {
          headers: { "X-API-Key": API_KEY },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const single = data.find((item) => String(item.Key) === String(query));

        if (single) {
          singleCache[query] = single; // Cache single result
          dispatch({ type: "GET_SINGLE_PROJECTS", payload: single });
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching single project:", error.message);
        }
      }
    },
    []
  );

  // Fetch movie list on mount
  useEffect(() => {
    getProjects(API);
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [getProjects]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      Amovies: state.Amovies,
      Smovies: state.Smovies,
      getSingleProjects,
    }),
    [state.Amovies, state.Smovies, getSingleProjects]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

const useGlobalContext = () => useContext(AppContext);

export { AppProvider, useGlobalContext };
