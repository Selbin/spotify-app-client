// LoginForm.js
import React, { useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";

import showErrorPopup from "../utils/triggerToast";

const Home = () => {
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [userPlaylists, setUserPlaylists] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false)
  const getData = async () => {
    try {
      setIsLoading(true);
      const playlistsResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}spotify/playlists/${userId}`
      );
      const profileResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}spotify/user/${userId}`
      );
      setUserPlaylists(playlistsResponse.data);
      setUserProfile(profileResponse.data);
      setIsEmpty(!profileResponse.data)
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      showErrorPopup(error.msg);
    }
  };
  return (
    <>
      <ToastContainer />
      <div className="search-container">
        <input
          className="inputBox"
          type="text"
          placeholder="Spotify ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button className="button" disabled={isLoading} onClick={getData}>
          {isLoading ? "Loading..." : "Search"}
        </button>
      </div>
      {isEmpty? <h2 style={{textAlign: "center"}}> Nothing found</h2>:' '}
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
                <a href={userProfile.external_urls.spotify}>
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
            {userPlaylists.items.map((item, i) => (
              <>
                <div>
                  {item.images[0] ? (
                    <img  width="300" height="200" src={item.images[0].url} alt="Display" />
                  ) : (
                    ""
                  )}
                </div>
                <div>
                  <p>
                    <b>Name:</b> {item.name}
                  </p>
                </div>
                <div style={{ width: "40vw" }}>
                  <p>
                    <b>Description:</b> {item.description}
                  </p>
                </div>
                <div>
                  <p>
                    <b>Playlist link:</b>{" "}
                    <a href={item.external_urls.spotify}>
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
              </>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
