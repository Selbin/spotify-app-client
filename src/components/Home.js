// LoginForm.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";

import showErrorPopup from "../utils/triggerToast";
import Loading from "./Loading";
import Pagination from "./Pagination";

const Home = () => {
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [userPlaylists, setUserPlaylists] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 3;
  const getPlaylistData = async () => {
    try {
      setIsLoading(true);
      const accessToken = JSON.parse(
        localStorage.getItem("tokens")
      ).accessToken;

      const options = {
        headers: {
          authorization: `bearer ${accessToken}`,
        },
      };

      const playlistsResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}spotify/playlists/${userId}?page=${currentPage}&limit=${itemsPerPage}`,
        options
      );

      setUserPlaylists(playlistsResponse.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      showErrorPopup(error.msg);
    }
  };

  const getProfileData = async () => {
    try {
      setIsLoading(true);
      const accessToken = JSON.parse(
        localStorage.getItem("tokens")
      ).accessToken;

      const options = {
        headers: {
          authorization: `bearer ${accessToken}`,
        },
      };

      const profileResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}spotify/user/${userId}`,
        options
      );

      setUserProfile(profileResponse.data);
      setIsEmpty(!profileResponse.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      showErrorPopup(error.msg);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (userId) {
        getProfileData();
        if (currentPage !== 1) {
          setCurrentPage(1);
        } else {
          getPlaylistData();
        }
      }
    }
  };

  // For making pagination work
  useEffect(() => {
    if (userId) {
      getPlaylistData();
    }
  }, [currentPage]);

  return (
    <>
      <ToastContainer />
      <div className="search-container">
        <input
          className="inputBox"
          type="text"
          placeholder="Spotify ID"
          value={userId}
          onKeyDown={handleKeyDown}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button
          className="button"
          disabled={isLoading}
          onClick={() => {
            if (userId) {
              getProfileData();
              if (currentPage !== 1) {
                setCurrentPage(1);
              } else {
                getPlaylistData();
              }
            }
          }}
        >
          {isLoading ? "Loading..." : "Search"}
        </button>
      </div>
      {isLoading ? <Loading /> : ""}
      {isEmpty ? <h2 style={{ textAlign: "center" }}> Nothing found</h2> : " "}
      {userProfile && userPlaylists && (
        <div className="content-container">
          <div className="content-sub-container">
            <h3 style={{ textAlign: "center" }}>Profile</h3>
            <div>
              {userProfile.images[0] ? (
                <img src={userProfile.images[0].url} alt="Display" />
              ) : (
                ""
              )}
            </div>
            <div>
              <p>
                <b>Name:</b> {userProfile.display_name}
              </p>
            </div>
            <div>
              <p>
                <b>Spotify Link: </b>
                <a
                  href={userProfile.external_urls.spotify}
                  rel="noreferrer"
                  target="_blank"
                >
                  {userProfile.external_urls.spotify}
                </a>
              </p>
            </div>
            <div>
              <p>
                <b>Total followers:</b> {userProfile.followers.total}
              </p>
            </div>
          </div>
          <div className="content-sub-container">
            <h3 style={{ textAlign: "center" }}>playlists</h3>
            {userPlaylists?.items.map((item, i) => (
              <div key={`item${i}`}>
                <div>
                  {item.images[0] ? (
                    <img
                      width="300"
                      height="200"
                      src={item.images[0].url}
                      alt="Display"
                    />
                  ) : (
                    ""
                  )}
                </div>
                <div>
                  <p>
                    <b> {item.name}</b>
                  </p>
                </div>
                <div style={{ width: "40vw" }}>
                  <p>{item.description}</p>
                </div>
                <div>
                  <p>
                    <b>Playlist link:</b>{" "}
                    <a
                      href={item.external_urls.spotify}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {item.external_urls.spotify}
                    </a>
                  </p>
                </div>
                <div>
                  <p>
                    <b>Owner:</b> {item.owner.display_name}
                  </p>
                </div>
                <hr />
              </div>
            ))}
            <Pagination
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={userPlaylists.total}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
