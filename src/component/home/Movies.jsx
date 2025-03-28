import React from "react";
import { useGlobalContext } from "../../Helpers/context";
import { NavLink } from "react-router-dom";

const Movies = () => {
  document.title = "iMovieArea"
  const { Amovies } = useGlobalContext();
  return Amovies.map((i) => {
    const { Poster, Name, Key } = i;
    const movieName = Name.substring(0, 15);
    const shortName = movieName.length > 13 ? `${movieName}...` : movieName;
    const Query = "/Page?Key=" + Key;
    return (
      <NavLink to={Query} className="card_con" key={Key}>
        <div className="card">
          <div className="card-info">
            <h2 className="Name">{shortName}</h2>
            <img src={Poster} alt="#" />
          </div>
        </div>
      </NavLink>
    );
  });
};

export default Movies;
