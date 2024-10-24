import client from "../sanityClient";

const slugify = require("slugify");

export const getUserById = async (userId) => {
  console.log(userId);
  const query = `*[_type == "user" && userId == "${userId}"]{
  _id,userId, name , email , profilePhoto
  }
  `;
  const userresult = await client.fetch(query).then((data) => {
    console.log("Here i am GEt User by Id ");
    console.log(data[0]);
    return data[0];
  });

  return userresult;
};


export const getUserByEmail = async (userId) => {
  console.log(userId);
  const query = `*[_type == "user" && email == "${userId}"]{
  _id,userId, name , email , profilePhoto
  }
  `;
  const userresult = await client.fetch(query).then((data) => {
    console.log("Here i am GEt User by Id ");
    console.log(data);
    return data;
  });

  return userresult;
};

export const getUser = async () => {
  let query = '*[_type == "user"]';
  const userresult = await client.fetch(query).then((data) => {
    console.log("Here i am GET USER");
    console.log(data);
    return data;
  });

  return userresult;
};

// saving the user information into the backend

export const setNewUser = async (
  currentUserId,
  userName,
  userEmail,
  profilePhoto
) => {
  try {
    const newslug = slugify(userName, { lower: true });
    const newUser = {
      _type: "user",
      userId: currentUserId,
      name: userName,
      email: userEmail,
      profilePhoto: profilePhoto,
      slug: {
        _type: "slug",
        current: newslug,
      },
    };

    const result = await client.create(newUser);
    console.log("User Created : ", result);
  } catch (error) {
    console.log("Got Error : ", error);
  }
  return;
};

export const feedQuery = `
  *[_type == "post"] {
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
  }
`;

export const searchQuery =()=>{
  return null;
};



//checking wheter the post is already saved or not

export const isPostAlreadySaved = async (postId, userId) => {
  
  const timestamp = new Date().getTime(); // Generate a unique parameter
  const query = `*[_type == "savedPosts" &&  post._ref == "${postId}" && user._ref == "${userId}" ]{
  _id 
  }` ;


  return await client
    .fetch(query, {
      cache: "no-cache", // Disable caching
    })
    .then((data) => {
      return data;
    });
};



export const userSavedPosts =  ( userId )=>{


  console.log( " This user is getting his saved Posts ");
  console.log( userId);
  const savedPostQuery = `*[_type == "savedPosts" && user._ref == "${userId}"]{
  
  post->{
   _id,
    postId,
    title,
    description,
    postedDate,
    destination,
    category-> {
      _id,
      categoryName
    },
    post {
      asset-> {
        _id,
        url
      }
    },
    postedbBy-> {
      _id,
      name,
      email
    }
  },

  }
  `;

return savedPostQuery;

}