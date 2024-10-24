import React, { useContext } from "react";
import { Link, useNavigate, useNavigationType } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline, MDDownloadForOffline } from "react-icons/md";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AiFillDelete, AiOutlineUpload } from "react-icons/ai";

import "../css/pins.css";

import { urlFor } from "../sanityClient";
import client from "../sanityClient";
import { useState } from "react";
// import category from '../../../myshareme_backend/schemaTypes/category';
import "../css/singlePin.css";
import { useEffect } from "react";
import { isPostAlreadySaved } from "../api/api";
import PinDetail from "./PinDetail";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../userContext";

const Pin = ({ pin, currentUser, userChoice }) => {
  const {
    refresh,
    setRefresh,
    currentPin,
    setCurrentPin,
    postSaved,
    setPostSaved,
  } = useContext(UserContext);
  // console.log(pin);
  const [postHovered, setPostHovered] = useState(false);
  const navigate = useNavigate();

  const [alreadySaved, setAlreadySaved] = useState("notSaved");
  const [savedPostId, setSavedPostId] = useState(null);
  const [toggle, setToggle] = useState(0);

  useEffect(() => {
    savingPost();
  }, []);

  async function savingPost() {
    const result = await isPostAlreadySaved(pin._id, currentUser._id);

    if (result.length > 0) {
      setSavedPostId(result[0]._id);
      setAlreadySaved("saved");
    } else {
      setAlreadySaved("notSaved");
      setSavedPostId(null);
    }
  }

  const { title, post, postedDate, user, category, postedbBy } = pin;
  

  const savePost = async (e) => {
    e.stopPropagation();
    const toastId = toast.loading("Loading...");
    const currentLoggedUser = localStorage.getItem("user");
    const _id = JSON.parse(currentLoggedUser)._id;

    const currentDate = new Date().toISOString(); // Get current date and 

    try {
      const result = await client.create({
        _type: "savedPosts",
        savedPostId: uuidv4(), // Generating unique identifier
        post: {
          _type: "reference",
          _ref: pin._id, // Reference to the post to be saved
        },
        user: {
          _type: "reference",
          _ref: currentUser._id, // Reference to the user saving the post
        },
        savedAt: currentDate, // Timestamp of when the post was saved
      });

      console.log(result);

      setTimeout(() => {
        savingPost();

        toast.update(toastId, {
          render: "Post Saved Successfully in Your Account",
          type: "success",
          isLoading: false,
          autoClose: 3000, // Close after 3 seconds
          closeOnClick: true,
        });
        //  const newValue = toggle + 1;

        //  setToggle(newValue);
        // Any delayed action goes here
      }, 3000); // 2000ms = 2 seconds
    } catch (error) {
      console.error("Error saving post:", error);

      console.error("Error unsaving post:", error);
      toast.update(toastId, {
        render: "Operation failed!",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
      });
    }
  };

  const unsavePost = async (e) => {
    // window.alert("unsaving Post ", savedPostId);
    e.stopPropagation();
    const toastId = toast.loading("Loading...");

    try {
      await client.delete(savedPostId); // Delete the saved post document by its ID

      console.error("Post Deleted sucess");

      setTimeout(() => {
        savingPost();
        toast.update(toastId, {
          render: "Post Unsaved Successfully",
          type: "success",
          isLoading: false,
          autoClose: 3000, // Close after 3 seconds
          closeOnClick: true,
        });
        //  setuserProfileRefresh(!userProfileRefresh);
        setRefresh(!refresh);

        // Any delayed action goes here
      }, 3000); // 2000ms = 2 seconds
    } catch (error) {
      console.error("Error unsaving post:", error);
      toast.update(toastId, {
        render: "Operation failed!",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
      });
    }
  };

  const deleteCommentsForPost = async (postId) => {
    try {
      // Fetch all comment IDs associated with the post
      const query = `*[_type == "comment" && post._ref == "${postId}"]._id`;

      // Fetch the comment IDs
      const commentIds = await client.fetch(query);

      // If comments exist, delete them
      if (commentIds.length > 0) {
        await Promise.all(
          commentIds.map((commentId) => client.delete(commentId))
        );
        // console.log(`Deleted ${commentIds.length} comments for post ${postId}`);
      } else {
        console.log("No comments found for this post");
      }
    } catch (error) {
      console.error("Error deleting comments:", error);
    }
  };

  const deleteSavedPost = async (postId, userId) => {
    try {
      // Fetch the saved post document ID where the post ID and user ID match
      const query = `*[_type == "savedPosts" && post._ref == "${postId}" && user._ref == "${userId}"]._id`;

      // Fetch the saved post document IDs
      const savedPostIds = await client.fetch(query);

      // If saved posts exist, delete them
      if (savedPostIds.length > 0) {
        await Promise.all(
          savedPostIds.map((savedPostId) => client.delete(savedPostId))
        );
        console.log(
          `Deleted ${savedPostIds.length} saved posts for post ${postId} and user ${userId}`
        );
      } else {
        console.log("No saved posts found for this post and user");
      }
    } catch (error) {
      console.error("Error deleting saved posts:", error);
    }
  };

  //Delete Post
  const deletePost = async () => {
    const toastId = toast.loading("Loading...");

    try {
      // Delete the post document with the given postId
      deleteCommentsForPost(pin._id);
      deleteSavedPost(pin._id, currentUser._id);
      await client.delete(pin._id);
      console.log(`Post with ID ${pin._id} has been deleted successfully.`);

      setRefresh(!refresh);
      toast.update(toastId, {
        render: "Post Deleted Successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000, // Close after 3 seconds
        closeOnClick: true,
      });
    } catch (error) {
      console.error("Error deleting the post:", error);
      toast.update(toastId, {
        render: "Error deleting the post:",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
      });
    }
  };

  const gotoPinDetail = () => {
    setCurrentPin([]);
    setCurrentPin(pin);
    window.scrollTo(0, 0);

    console.log(alreadySaved);
    if (alreadySaved === "saved") {
      console.log("Setting post saved : True");
      setPostSaved(true);
    } else {
      console.log("Setting post saved : False");
      setPostSaved(false);
    }
    navigate("/pinDetail");
  };

  // Function to truncate the link
  const truncateLink = (url) => {
    const maxLength = 30; // Define the maximum number of characters to display

    if (url === null || url === "") {
      return "www.google.com";
    }
    return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  };

  return (
    <div
      className="PinContainer"
      onMouseEnter={() => setPostHovered(true)}
      onMouseLeave={() => setPostHovered(false)}
      onClick={() => gotoPinDetail()}
    >
      {post && (
        <img
          className="pinImage"
          src={urlFor(post).width(400).url()}
          alt="user-post"
        />
      )}

      <div className="PinUser">
        <img
          className="pinPostedUser"
          src={pin.postedbBy.profilePhoto}
        />
        {<h3>{postedbBy.name}</h3>}
      </div>

      {postHovered && (
        <div className="base">
          <div className="baseTop">
            <a
              href={`${post?.asset?.url}?dl=`}
              downlaod
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="downloadButton"
            >
              <MdDownloadForOffline className="downloadIcon" />
            </a>

            <button
              key={alreadySaved}
              className="saveButton"
              onClick={
                alreadySaved === "notSaved"
                  ? (e) => savePost(e)
                  : (e) => unsavePost(e)
              }
            >
              {alreadySaved === "notSaved" ? "Save" : "Unsave"}
            </button>
          </div>

          <div className="baseDown">
            <a href={pin.destination} className="destinationLink">
              {truncateLink(pin.destination)}
            </a>

            {userChoice === "userPosted" ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deletePost();
                }}
                className="deleteButton"
              >
                <AiFillDelete className="deleteIcon" />
              </button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default Pin;
