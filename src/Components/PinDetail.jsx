import React, { useContext, useEffect } from "react";
import { AiOutlineDownload } from "react-icons/ai";
import client, { urlFor } from "../sanityClient";
import { MdDownloadForOffline } from "react-icons/md";
import { useState } from "react";
import { feedQuery, searchQuery } from "../api/api";
import Spinner from "./Spinner";
import MasonryLayout from "./MasonryLayout";
import CommentComponent from "./CommentComponent";
import { v4 as uuidv4 } from "uuid";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../css/pinDetails.css'
import { UserContext } from "../userContext";

function PinDetail({ user, previousPin }) {
  const {
    refresh,
    setRefresh,
    currentPin,
    setCurrentPin,
    postSaved,
    setPostSaved,
    scrollPrevious,
    setScrollPrevious,
  } = useContext(UserContext);

  const [allComments, setAllComments] = useState([]);
  const [currentComment, setCurrentComment] = useState("");

  const [loading, setLoading] = useState(false);
  const [allCommentsLoading, setAllCommentLoading] = useState(false);
  const [postCommentLoading, setPostCommentLoading] = useState(false);

  const [showAll, setShowAll] = useState(false); // State to track whether to show all comments

  const [pins, setPins] = useState([]);

  const fetchAllPosts = async () => {
    try {
      const data = await client.fetch(feedQuery).then((data) => {
        return data;
      });

      setPins(data); // Update the pins state with fetched data
      console.log("Fetched pins:", data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
    }
  };

  const toggleShowAll = () => {
    setShowAll((prev) => !prev); // Toggle between showing all and limited comments
  };

  const categoryId = false;
  useEffect(() => {
    // setSearchItem("");
    // setSearchedPins([]);
    setScrollPrevious(!scrollPrevious);

    updateComments();

    /**Here I want to fetch all the posts with the same category */
    setLoading(true);
    if (categoryId) {
      const query = searchQuery(categoryId);
      client.fetch(query).then((data) => {
        // setPins(data);
        console.log(data);
        setLoading(false);
      });
    } else {
      console.log("In feed");
      fetchAllPosts();

      setLoading(false);
    }
  }, [currentPin._id]);

  const updateComments = async () => {
    setAllCommentLoading(true);

    const postId = currentPin._id; // Replace with the actual post ID

    const getCommentsQuery = `
  *[_type == "comment" && post._ref == $postId]{
    _id,
    commentId,
    content,
    user -> {
      _id,
      name,
      profilePhoto
    },
    createdAt
  }
`;

    // Example of using the query with a fetch call
    await client
      .fetch(getCommentsQuery, { postId })
      .then((fetchedComments) => {
        setAllComments(fetchedComments);
        console.log(fetchedComments);
        setAllCommentLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
        setAllCommentLoading(false);
      });
  };

  const maxLength = 30; // Define the maximum number of characters to display

  // Function to truncate the link
  const truncateLink = (url) => {
    if (url === null || url === "") {
      return "www.google.com";
    }
    return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  };

  const postComment = async () => {
    if (currentComment === null || currentComment.length <= 0) {
      window.alert("Please enter any text before posting comment ");

      return;
    }

    setPostCommentLoading(true);
    const commentData = {
      _type: "comment",
      commentId: uuidv4(),
      post: {
        _type: "reference",
        _ref: currentPin._id,
      },
      user: {
        _type: "reference",
        _ref: user._id,
      },
      content: currentComment,
      createdAt: new Date().toISOString(),
    };

    try {
      // Save the comment in Sanity
      const result = await client.create(commentData);
      // Show success toast
      toast.success("Comment posted successfully!", {
        autoClose: 3000, // Auto close after 3 seconds
        hideProgressBar: false, // Show the progress bar
        closeOnClick: true, // Close on click
        pauseOnHover: true, // Pause on hover
      });

      console.log("Comment Added Successfully");
      setCurrentComment("");
      setPostCommentLoading(false);
    } catch (error) {
      // Show error toast
      toast.error("Error posting comment. Please try again.", {
        autoClose: 3000,
      });
      console.error("Error posting comment:", error);
      setPostCommentLoading(false);
    }
  };

  if (loading) {

    return <Spinner message=" Fetching data.... " />;
  }

  return (
    <div className="pinDetailMainContainer">
      {console.log(currentPin)}
      {console.log(currentPin.postedbBy)}

      <div className="pinDetailPart">
        <div className="pinImageBackground">
          <div className="pinImage1">
            <img
              className="detailpinImage"
              src={urlFor(currentPin.post).width(400).url()}
              alt="user-post"
            />
          </div>
          <div className="pinInfo">
            <button className="savePinButton">
              {postSaved ? "Unsave" : "Save"}
            </button>
            <a
              href={`${currentPin?.asset?.url}?dl=`}
              downlaod
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="downloadButton"
            >
              Download
            </a>

            <a href={currentPin.destination} className="destination">
              {truncateLink(currentPin.destination)}
            </a>
          </div>
        </div>

        <div className="pinDetailAll">
          <h1 className="pinDetailTitle">{currentPin.title}</h1>
          <p className="pinDetailDescription">{currentPin.description}</p>
          <p className="pinDetailCategory">
            Category: " {currentPin.category.categoryName} "
          </p>

          <div className="pinDetailUserDiv">
            <img
              className="pinDetailUserProfileImage"
              src={currentPin.postedbBy.profilePhoto}
            />
            <h3 className="pinDetailUserName"> {currentPin.postedbBy.name}</h3>
          </div>
        </div>
      </div>

      <div className="commentSection">
        {allCommentsLoading ? (
          <Spinner message=" Fetching data.... " />
        ) : allComments.length > 0 ? (
          <div>
            <div className="commentSectionControl">
              <h2>Comments</h2>
              {allComments.length > 5 && (
                <button
                  onClick={toggleShowAll}
                  className="commentSectionButton"
                >
                  {showAll ? "Show Less Comments" : "Show All Comments"}
                </button>
              )}
            </div>

            <div
              className={`commentsContainer ${showAll ? "full" : "limited"}`}
            >
              {allComments.map((comment) => (
                <CommentComponent
                  key={comment.commentId}
                  currentComment={comment}
                />
              ))}
            </div>
          </div>
        ) : (
          <p> No Comments..</p>
        )}

        {postCommentLoading ? (
          <Spinner message=" Posting Comment... " />
        ) : (
          <div className="postComment">
            <img src={user.profilePhoto} alt="User" className="userPhoto" />
            <input
              placeholder="Add a comment"
              onChange={(e) => setCurrentComment(e.target.value)}
              value={currentComment}
              className="commentInput"
            />
            <button onClick={postComment} className="postCommentButton">
              Post
            </button>
            <ToastContainer /> {/* Include ToastContainer here */}
          </div>
        )}
      </div>
      <ToastContainer />
      <div className="moreLikeThisPart">
        <h2 className="moreLikeThis"> More Like This </h2>
        {pins.length > 0 ? (
          <MasonryLayout
            pins={previousPin}
            user={user}
            type="feed"
            setCurrentPin={setCurrentPin}
            setPostSaved={setPostSaved}
          />
        ) : (
          <p>No Same Posts Like This </p>
        )}
      </div>
    </div>
  );
}

export default PinDetail;
