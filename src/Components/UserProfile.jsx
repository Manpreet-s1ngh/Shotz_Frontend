import React from "react";
import "../css/userProfile.css";
import { useState } from "react";
import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import UserUploads from "./UserUploads";
import SavedPosts from "./SavedPosts";
import { ToastContainer } from "react-toastify";
import Spinner from "./Spinner";
import client from "../sanityClient";
import MasonryLayout from "./MasonryLayout";
import { userSavedPosts } from "../api/api";
import { useContext } from "react";
import { UserContext } from "../userContext";


const UserProfile = ({ user }) => {

  
    const {
      refresh,
      setRefresh,
      currentPin,
      setCurrentPin,
      postSaved,
      setPostSaved,
    } = useContext(UserContext);



  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState("userSaved");
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentTab === "userSaved") {
      fetchUserSavedImages();
    } else if (currentTab === "userPosted") {
      fetchUserPostedPosts(user._id);
      console.log(pins);
    }
  }, [currentTab, refresh]);

  const fetchUserSavedImages = async () => {
    setLoading(true);

    console.log("In the saved Posts section");
    console.log(user);

    const savedPostQuery = userSavedPosts(user._id);

    const result = await client.fetch(savedPostQuery);
    //  console.log("Showing the Saved Pins ");
    setPins(result);
    console.log(result);
    console.log(pins);
    setLoading(false);
  };

  const fetchUserPostedPosts = async (userId) => {
    setLoading(true);
    try {
      const query = `*[_type == "post" && postedbBy._ref == "${userId}"]{
    _id,
    postId,
    title,
    description,
    postedDate,
    category-> {
      _id,
      categoryName
    },
    destination,
    post {
      asset-> {
        _id,
        url
      }
    },
    postedbBy-> {
    
      _id,
      name,
      email,
      profilePhoto
    }
  }`;

      const posts = await client.fetch(query);
      console.log(`Posts by user ${userId}:`, posts);
      setPins(posts);

      console.log(pins);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts by user:", error);
      setLoading(false);
    }
  };

  const toggleTab = () => {
    console.clear();
    if (currentTab === "userSaved") {
      setPins([]);
      setCurrentTab("userPosted");

      console.log("setting it userPosted");
      console.log(currentTab);
    } else {
      setPins([]);
      setCurrentTab("userSaved");
      console.log("setting it userSaved ");
      console.log(currentTab);
    }
  };

  return (
    <div class="userProfileContainer">
      <ToastContainer />;
      <div className="userProfile">
        <img className="backgroundImage" src="https://picsum.photos/1600/900" />

        <div className="userBlock">
          <img className="userProfileImage" src={user.profilePhoto} />
          <h1 className="displayName"> {user.name}</h1>
        </div>
      </div>
      <div className="category">
        <div>
          {" "}
          <p
            className={currentTab === "userSaved" ? "selectedTab" : ""}
            onClick={toggleTab}
          >
            {" "}
            Saved Images
          </p>
        </div>

        <div>
          {" "}
          <p
            className={currentTab === "userPosted" ? "selectedTab" : ""}
            onClick={toggleTab}
          >
            {" "}
            Posted Images
          </p>
        </div>
      </div>
      {loading ? (
        <Spinner message="we are adding new Pins to your feed " />
      ) : (
        <div>
          <MasonryLayout pins={pins} user={user} userChoice={currentTab} />
        </div>
      )}
    </div>
  );
};

export default UserProfile;
