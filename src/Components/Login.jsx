import React from "react";
import sharevideo from "../assets/share.mp4";
import { AiFillCamera, AiOutlineGoogle, AiOutlineUser } from "react-icons/ai";
import "../css/Login.css";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setNewUser, getUserById, getUserByEmail } from "../api/api.js";
import { useEffect } from "react";
import client from "../sanityClient.js";

const Login = () => {
  // const [user, setUser] = useState(null);

  const navigate = useNavigate();


  useEffect( ()=>{

     const userInfo = localStorage.getItem("user");
     if (userInfo) {
       
      navigate("/");
     } 
  },[])

  const signInWithGoogle = async () => {
    try {
      //chck if the user exist

      
      const userInfo = localStorage.getItem("user");
      if (userInfo) {
    
      
        navigate("/");

      } else {
        const result = await signInWithPopup(auth, provider);
        const userObj = result.user.providerData[0];
        

        //Now I want to store the newly logined user into the backend of the sanitydatabase

        const tempUser = await getUserByEmail(userObj.email);

        if( tempUser === null || tempUser===undefined ){

          console.log("User Not exist , So creating New User")
          await setNewUser(
            userObj.uid,
            userObj.displayName,
            userObj.email,
            userObj.photoURL
          );

        }else{
          console.log("User Already Exist ");
        }

        
        console.log("User Stored Successflully ");        

       
        const storedUser = await getUserById(userObj.uid);

         localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(storedUser));

        navigate("/");

        ///Also save the user in the backend, sanity , from where it would get liked to the other images
      }

      //storing user data in the local storage , if the user is already logined.
    } catch (error) {
      console.log("Error signing in With Google: ", error);
    }
  };


  const temporaraySignIn = async() => {


    const tempuserquery = '*[_type=="user"&&name=="Karan"]' ;
    const tempUser = await client.fetch(tempuserquery).then((data) => {
      return data[0];
    });

    localStorage.setItem("user", JSON.stringify(tempUser));
    navigate("/");
  };

  return (
    <div className="loginContainer">
      <video
        src={sharevideo}
        typeof='"video/mp4'
        loop
        controls={false}
        muted
        autoPlay
        className="logoVideo"
      />

      <div className="loginBox">
        <div className="loginInfo">
          <AiFillCamera className="camera" />
          <p className="appname"> ShotZ</p>
        </div>

        <button className="loginGoogle" onClick={signInWithGoogle}>
          <AiOutlineGoogle className="googleIcon" />

          <p>Sign In With Google</p>
        </button>
        <button className="loginGoogle tempuser" onClick={temporaraySignIn}>
          <AiOutlineUser className="googleIcon" />

          <p>Temporary User</p>
        </button>
      </div>
    </div>
  );
};

export default Login;
