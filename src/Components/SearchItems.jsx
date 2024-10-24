import React, { useContext, useEffect, useState } from 'react';
import Spinner from "./Spinner";
import client from '../sanityClient';
import MasonryLayout from './MasonryLayout';
import { useLocation } from 'react-router-dom';
import { UserContext } from '../userContext';

const SearchItems = ({
  user,
  searchItem,
  setSearchItem,
  searchedPins,
  loading,
  scrollPos,
  setScrollPos,
}) => {
  const { scrollPrevious, setScrollPrevious } = useContext(UserContext);

  useEffect(() => {
   

     
    setTimeout(() => {
 
     window.scrollTo(0, scrollPos);
    }, 1); // Delay for next event loop tick

    const handleScroll = () => {
    ;
      setScrollPos(window.scrollY);
      console.log(scrollPos);
    };

    // // Adding scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup function to remove the event listener
    return () => {
      
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Effect to restore scroll position on component mount
  useEffect(() => {
    // Scroll to the saved position

   
    
  }, [scrollPos]);

  if (loading) {
    return <Spinner message="Searching.." />;
  }
  return (
    <div>
      {searchedPins.length > 0 ? (
        <MasonryLayout
          pins={searchedPins}
          user={user}
          type="feed"
          userChoice="nothing"
        />
      ) : (
        <p>No Match related to : " {searchItem}"</p>
      )}
    </div>
  );
};

export default SearchItems