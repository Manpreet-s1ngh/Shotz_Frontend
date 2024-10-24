import React, { useContext, useEffect } from "react";
import "../css/pins.css";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Feed from "./Feed";
import Navbar from "./Navbar";
import CreatePost from "./CreatePost";
import { feedQuery } from "../api/api";
import client from "../sanityClient";
import PinDetail from "./PinDetail";
import SavedPosts from "./SavedPosts";
import { ToastContainer } from "react-toastify";
import SearchItems from "./SearchItems";
import { UserContext } from "../userContext";

const Pins = ({ user }) => {
  const [searchItem, setSearchItem] = useState("");
  const [pins, setPins] = useState([]);
  const [searchedPins, setSearchedPins] = useState([]);
  const [loading , setLoading] = useState(false); 
  const [scrollPos , setScrollPos] = useState(0);


  const fetchAllPosts = async () => {
    try {
      const data = await client.fetch(feedQuery).then((data) => {
        return data;
      });

      setPins(data); // Update the pins state with fetched data
      
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
    }
  };

    


  return (
    <div className="pin">
      <ToastContainer />
      <div className="navigation">
        <Navbar
          searchItem={searchItem}
          setSearchItem={setSearchItem}
          user={user}
          searchedPins={searchedPins}
          setSearchedPins={setSearchedPins}
          setLoading={setLoading}
        />
      </div>

      <div className="feedBody">
        <Routes>
          <Route
            path="/search"
            element={
              <SearchItems
                user={user}
                searchItem={searchItem}
                setSearchItem={setSearchItem}
                searchedPins={searchedPins}
                setSearchedPins={setSearchedPins}
                loading={loading}
                setLoading={setLoading}
                scrollPos={scrollPos}
                setScrollPos={setScrollPos}
              />
            }
          />

          <Route
            path="/"
            element={
              <Feed
                user={user}
                pins={pins}
                setPins={setPins}
                fetchAllPosts={fetchAllPosts}
                setSearchItem={setSearchItem}
                setSearchedPins={setSearchedPins}
              />
            }
          />
          <Route
            path="/category/:categoryId"
            element={
              <Feed
                user={user}
                pins={pins}
                setPins={setPins}
                fetchAllPosts={fetchAllPosts}
                setSearchItem={setSearchItem}
                setSearchedPins={setSearchedPins}
              />
            }
          />
          <Route
            path="/createPost"
            element={
              <CreatePost
                user={user}
                fetchAllPosts={fetchAllPosts}
                setSearchItem={setSearchItem}
                setSearchedPins={setSearchedPins}
              />
            }
          />

          <Route path="/pinDetail" element={<PinDetail user={user} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Pins;
