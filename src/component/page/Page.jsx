import { useEffect } from "react";
import { useGlobalContext } from "../../Helpers/context";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Download from "./Download";

const Page = () => {
  const search = useLocation().search;
  const query = new URLSearchParams(search).get("Key");

  // Get API data from context
  const { getSingleProjects, Smovies } = useGlobalContext();

  useEffect(() => {
    getSingleProjects(query);
  }, [query, getSingleProjects]);

  const {
    Title,
    Desc,
    Poster,
    Subtitles,
    Screenshots1,
    Screenshots2,
    Screenshots3,
    Screenshots4,
    Language,
    Quality,
    Movie_story,
    Format,
    Size,
    Name,
    Key,
    Release,
    Genres,
    IMDB,
    Country,
  } = Smovies;

  document.title = Name;

  return (
    <>
      <section id="Movies-container" className="movie-section">
        <section className="movie-section" key={Key}>
          {/* <!-- Top Section --> */}
          <div className="top-section">
            <h1 className="heading">{Title}</h1>
            <p className="desc">{Desc}</p>
          </div>

          {/* <!-- Movie Card --> */}
          <div className="movie-card">
            <figure>
              <img src={Poster} alt="Movie Poster" />
            </figure>
            <div className="card-content">
              <p className="title">{Name}</p>
              <p className="card-text">{Release}</p>
              <p className="card-text">{Genres}</p>
              <p className="card-text">{IMDB} / 10</p>
              <p className="card-text">{Country}</p>
            </div>
          </div>

          {/* <!-- Bottom Section --> */}
          <div className="Bottom-section">
            <div className="MovieInfo_cont">
              <table className="MovieInfo">
                <thead>
                  <tr>
                    <th>
                      <h2 className="subheading">Movie Info:</h2>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="data">Movie Name &nbsp;:-) &nbsp;</th>
                    <td className="data">{Name}</td>
                  </tr>
                  <tr>
                    <th className="data">Language &nbsp;:-) &nbsp;</th>
                    <td className="data">{Language}</td>
                  </tr>
                  <tr>
                    <th className="data">Released &nbsp;:-) &nbsp;</th>
                    <td className="data">{Release}</td>
                  </tr>
                  <tr>
                    <th className="data">Subtitle &nbsp;:-) &nbsp;</th>
                    <td className="data">{Subtitles}</td>
                  </tr>
                  <tr>
                    <th className="data">Size &nbsp;:-) &nbsp;</th>
                    <td className="data">{Size}</td>
                  </tr>
                  <tr>
                    <th className="data">Quality &nbsp;:-) &nbsp;</th>
                    <td className="data">{Quality}</td>
                  </tr>
                  <tr>
                    <th className="data">Format &nbsp;:-) &nbsp;</th>
                    <td className="data">{Format}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="center-subheading">Movie-SYNOPSIS/PLOT:</h3>
            <p className="Movie-story">{Movie_story}</p>

            <h3 className="center-subheading">
              Screenshots: (Must See Before Downloading)
            </h3>

            <div className="Screenshots">
              <figure>
                <img
                  src={Screenshots1}
                  className="img_screenshot"
                  alt="Screenshot 1"
                />
                <img
                  src={Screenshots2}
                  className="img_screenshot"
                  alt="Screenshot 2"
                />
                <img
                  src={Screenshots3}
                  className="img_screenshot"
                  alt="Screenshot 3"
                />
                <img
                  src={Screenshots4}
                  className="img_screenshot"
                  alt="Screenshot 4"
                />
              </figure>

              {/* Download Component */}
              <Download />
            </div>
          </div>

          {/* Back Button */}
          <div className="left-cont">
            <NavLink to="/" className="download-btn">
              Back
            </NavLink>
          </div>
        </section>
      </section>
    </>
  );
};

export default Page;
