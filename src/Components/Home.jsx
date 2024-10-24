import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Pins from "./Pins";
import "../css/home.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import UserProfile from "./UserProfile";

import Spinner from "./Spinner";
import CreatePost from "./CreatePost";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [user, setUser] = useState(() => {
    const currentuser = localStorage.getItem("user");
    return currentuser ? JSON.parse(currentuser) : null;
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);


  const[userProfileRefresh , setuserProfileRefresh] = useState(false);
  useEffect(() => {
    const userobj = localStorage.getItem("user");

    if (userobj) {
      // console.log(user);
      setLoading(false);
    } else {
      window.alert("Please do login");

      navigate("/login");
    }
  }, []);

  if (loading) {
    return <Spinner message="we are adding new Pins to your feed " />;
  }

  return (
    <div className="home">
      <ToastContainer />;
      <Sidebar />
      <Routes>
        <Route
          path="/profile/:userId"
          element={
            <UserProfile
              user={user}
              userProfileRefresh={userProfileRefresh}
              setuserProfileRefresh={setuserProfileRefresh}
            />
          }
        />
        <Route
          path="/*"
          element={
            <Pins
              user={user}
              userProfileRefresh={userProfileRefresh}
              setuserProfileRefresh={setuserProfileRefresh}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default Home;
