import React from 'react';

import { useEffect , useState } from 'react';
import { feedQuery, userSavedPosts } from "../api/api";
import Spinner from './Spinner';
import client from '../sanityClient';
import MasonryLayout from "./MasonryLayout";

const SavedPosts = ({ user , userChoice }) => {
  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshSavedPage, setRefreshSavedPage] = useState(false);


  const fetchUserSavedImages = async()=>{

     setLoading(true);

     console.log("In the saved Posts section");
     console.log(user);

     const savedPostQuery = userSavedPosts(user._id);

     client.fetch(savedPostQuery).then((data) => {
       console.log("Showing the Saved Pins ");
       setPins(data);
       console.log(data);
       setLoading(false);
     });

  }

  


   const fetchUserPostedImages = async (userId) => {
     try {
       const query = `*[_type == "post" && postedBy._ref == "${userId}"]{
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
       return posts;
     } catch (error) {
       console.error("Error fetching posts by user:", error);
     }
   };

  

  useEffect(() => {
    // setPins(null);
    console.log("------------------------", userChoice);
    if (userChoice === "userSaved") {
      fetchUserSavedImages();
    } else if (userChoice === "userPosted") {
      // fetchUserSavedImages();
      // fetchUserPostedImages(user._id);

      setPins(null);
    }
  }, [userChoice]);

  //HERE SHOULD BE A QUERY THAT WOULD RESULT IN THE VALUE OF CHANGE OF THE REFRESH

  if (loading) {
    return <Spinner message="we are adding new Pins to your feed " />;
  }

  return (
    <div>{ (pins==null || pins==undefined)? <p>No Posts</p> :<MasonryLayout pins={pins} user={user} userChoice={userChoice}  />}</div>
  );
};

export default SavedPosts;