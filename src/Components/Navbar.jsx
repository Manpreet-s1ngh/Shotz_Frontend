import React from "react";
import { AiFillPlusSquare, AiOutlineSearch, AiOutlineUser } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import '../css/navbar.css'
import client from "../sanityClient";

const Navbar = ({ searchItem, setSearchItem, user, searchedPins ,setSearchedPins,loading,setLoading}) => {
  //This pins would get updated on the search Item change


  const navigate = useNavigate();


  const setNewPins = async (searchValue) => {
    setLoading(true);

    if (searchValue.trim().length === 0) {
      setSearchedPins([]);
      setLoading(false);
      return;
    }

    setSearchedPins([]);
    // console.log(searchValue.trim().toLowerCase());
    const searchQuery = `*[_type == "post" && title match "*${searchValue
      .trim()
      .toLowerCase()}*"]{
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
  } `;

    const newData = await client.fetch(searchQuery).then((data) => {
      return data;
    });

    if (newData != null || newData != undefined) {
      setSearchedPins(newData);
    }

    setLoading(false);
  };

  

  const handleSearchItem = (e) => {
    setSearchItem(e.target.value);
setNewPins(e.target.value);
  };








  return (
    <div className="navbar">
      <div className="searchContainer">
        <AiOutlineSearch className="searchIcon" />
        <input
          type="text"
          placeholder="search"
          onChange={(e) => handleSearchItem(e)}
          value={searchItem}
          onFocus={() => navigate("/search")}
          className="searchInput"
        ></input>

        <Link to={`/profile/${user._id}`}>
          <img className="tapuser" src={user.profilePhoto} />
        </Link>

        <Link to={`/createPost`}>
          <AiFillPlusSquare className="plusIcon" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
