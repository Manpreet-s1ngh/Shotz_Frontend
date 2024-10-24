import React, { createContext, useState } from "react";

// Create the context
export const UserContext = createContext();

// Create a provider component to wrap the children that need access to the context
export const UserProvider = ({ children }) => {
  const [refresh, setRefresh] = useState(false);
    const [currentPin, setCurrentPin] = useState([]);
    const [postSaved, setPostSaved] = useState(false);
    const [scrollPrevious , setScrollPrevious] = useState(false);

  return (
    <UserContext.Provider value={{ refresh, setRefresh , currentPin , setCurrentPin , postSaved,setPostSaved ,scrollPrevious, setScrollPrevious}}>
      {children}
    </UserContext.Provider>
  );
};
