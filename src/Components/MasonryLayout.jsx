import React, { useEffect } from "react";
import Masonry from "react-masonry-css";
import Pin from "./Pin";
import '../css/masonry.css'

const breakpointColumnsObj = {
  default: 4,
  3000: 4,
  2200: 3,
  1700: 2,
  1400: 2,
  800: 1,
};


 


const MasonryLayout = ({
  pins,
  user,
  userChoice,

}) => (

 
 
  <Masonry
    className="masonry" // Use CSS class for Masonry
    breakpointCols={breakpointColumnsObj}
    columnClassName="masonry-item" // Ensure items follow this class
  >

  {
     // Adding window listeners after DOM is loaded
    window.addEventListener('DOMContentLoaded', (event) => {
      // Save scroll position before unloading
      window.addEventListener('beforeunload', () => {
        History.replaceState({ scrollPosition: window.scrollY }, '');
      });

      // Restore scroll position on popstate (back/forward)
      window.addEventListener('popstate', (event) => {
        if (event.state && event.state.scrollPosition !== undefined) {
          window.scrollTo(0, event.state.scrollPosition);
        }
      });
    })
  }
    {userChoice === "userSaved"
      ? pins?.map((pin) => {
          const currentPost = pin.post;
          console.log(currentPost.title);
          return (
            <Pin
             
              pin={currentPost}
              className=""
              currentUser={user}
              
              userChoice={userChoice}

            />
          );
        })
      : pins?.map((pin) => (
          <Pin
            pin={pin}
            className=""
            currentUser={user}
            userChoice={userChoice}
      
          />
        ))}

    {/*
      pins?.map((pin) => (
      <Pin key={pin._id} pin={pin} className="" currentUser={user} />
    ))
  */}
  </Masonry>
);

export default MasonryLayout;
