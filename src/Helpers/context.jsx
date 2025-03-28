import React, { useContext, useReducer, useEffect } from "react";
import reducer from "./reducer";

const AppContext = React.createContext();
const API = `https://atualapis.pages.dev/Movies/index.json`;

const intialState = {
  Amovies: [],
  Smovies: [],
  Sdownload: [],
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, intialState);

  //  to get the api data
  const getProjects = async (url) => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      dispatch({ type: "GET_PROJECTS", payload: data });
    } catch (error) {
      // console.log(error);
    }
  };

  const getSingleProjects = async (query) => {
    try {
      const res = await fetch(API);
      const data = await res.json();
  
      // Find the movie with the matching Key
      const Single = data.find((item) => item.Key === query);
  
      if (Single) {
        dispatch({ type: "GET_SINGLE_PROJECTS", payload: Single });
        dispatch({ type: "GET_DOWNLOAD_PROJECTS", payload: Single.downloads || [] });
      } else {
        console.warn("Movie not found with Key:", query);
      }
    } catch (error) {
      console.error("Error fetching single project:", error);
    }
  };
  
  // Call API only once when the component mounts
  useEffect(() => {
    getProjects(API);
  }, []);  // Empty dependency array ensures it runs only once
  
  

  return (
    <AppContext.Provider value={{ ...state, getSingleProjects }}>
      {children}
    </AppContext.Provider>
  );
};

// gloabal custom hookz
const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppProvider, useGlobalContext };
