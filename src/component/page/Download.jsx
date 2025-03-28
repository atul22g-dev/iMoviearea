import React from "react";
import { useGlobalContext } from "../../Helpers/context";

const Download = () => {
  const { Sdownload } = useGlobalContext();

  // Remove duplicates by using a Set
  const uniqueDownloads = Array.from(
    new Map(Sdownload.map((item) => [item.Download, item])).values()
  );

  return (
    <>
      <div className="center-subheading" id="Downloads_container">
        {uniqueDownloads.map((curElem) => {
          const { Download, Download_title, Key } = curElem;
          return (
            <div className="downloadCon" key={Key}>
              <h3 className="center-subheading">{Download_title}</h3>
              <a href={Download} className="download-btn">
                Download
              </a>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Download;
