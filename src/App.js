import logo from './logo.svg';
import './App.css';
import { getUser } from './api/api';
import { setNewUser } from './api/api';
import Home from './Components/Home';

import Login from './Components/Login';
import { BrowserRouter as Router , Routes , Route } from "react-router-dom";
import Feed from './Components/Feed';
import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';


function App() {
const navigate = useNavigate();
   useEffect(() => {

    // localStorage.clear();
    //  const User =
    //    localStorage.getItem("user") !== "undefined"
    //      ? JSON.parse(localStorage.getItem("user"))
    //      : localStorage.clear();



    //  if (!User)
      
      navigate("login");
   }, []);

   

  const printUsers = async ()=>{

    const result = await getUser();
    console.log( "I am fist");
    console.log(result);
    
  }

  const setUser = async()=>{

    setNewUser("567", "New Slug Sing", "slug@gmail.com ");
  }
  return (
   
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Home />} />
      </Routes>
   
  );
}

export default App;
