import React, { useContext } from 'react';

import { useParams } from 'react-router-dom';
import Spinner from './Spinner';
import { useState } from 'react';
import { useEffect } from 'react';
import  client from    "../sanityClient";
import {feedQuery , searchQuery} from '../api/api'
import MasonryLayout from './MasonryLayout';
import { UserContext } from '../userContext';


const Feed = ({
  user,
  pins,
  setPins,
  fetchAllPosts,
  setSearchItem,
  setSearchedPins,
}) => {
  //fetcing the url from the website
  const { categoryId } = useParams();
  const {
    refresh,
    setRefresh,
    currentPin,
    setCurrentPin,
    postSaved,
    setPostSaved,
  } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  // const [masonryKey, setMasonryKey] = useState(1); // Key for forcing re-render
  // Function to fetch all posts

  const getCategoryId = async (categoryName) => {
    const query = `*[_type == "category" && categoryName == "${categoryName}"][0]{
    _id , categoryName}`;
    const category = await client.fetch(query).then((data) => {
      return data;
    });
    // console.log("Here : ", category);

    if (!category) {
      console.log("This Category is Not Present , Category Name : ", category);
      return null;
    }

    return category._id; // Return the category _id
  };

  // Fetch posts (pins) by category _id
  const getPinsByCategoryId = async (categoryId) => {
    if (categoryId == null || categoryId == undefined) {
      return null;
    }
    const query = `*[_type == "post" && category._ref == "${categoryId}"]{
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

    const posts = await client.fetch(query).then((data) => {
      // console.log(data);
      return data;
    });

    console.log(posts.length);

    return posts; // Return the posts (pins) associated with the category
  };

  const setPinsByCategory = async (categoryName) => {
    setLoading(true);

    setPins([]); //setting the reference to new;

    const categoryId = await getCategoryId(categoryName);

    const categoryPins = await getPinsByCategoryId(categoryId);

    if (categoryPins == null || categoryPins == undefined) {
      setPins([]);
      setLoading(false);
      return;
    }

    setPins(categoryPins);

    //Fist I would get the category Id from the category backend table
    //Then i would use that id to get the same cateoory Pins drom the Posts
    //Then I would set the pins to that category..

    setLoading(false);
  };

  const setPinsToHome = async () => {
    setLoading(true);
    setPins([]);
    await fetchAllPosts();
    setLoading(false);
  };

  useEffect(() => {
    
    
    setSearchItem("");
    setSearchedPins([]);


    // console.log("Using Effect");

    if (categoryId) {
      console.log("Setting Category to : ", categoryId);
      setPinsByCategory(categoryId);
    } else {
      setPinsToHome();
    }
  }, [categoryId, postSaved]);

  if (loading) {
    setSearchItem("");
    return <Spinner message="we are adding new Pins to your feed " />;
  }

  return (
    <div>
      {pins.length > 0 ? (
        <MasonryLayout
          pins={pins}
          user={user}
          type="feed"
          userChoice="nothing"
        />
      ) : (
        <p>No Feed Right Now</p>
      )}
    </div>
  );
};

export default Feed