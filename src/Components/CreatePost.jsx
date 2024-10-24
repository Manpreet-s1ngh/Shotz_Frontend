import React, { useEffect, useState } from 'react'
import { AiOutlineCloudUpload, AiOutlineSend } from 'react-icons/ai';
import '../css/createPost.css';
import Spinner from './Spinner';
import client from '../sanityClient';
import { MdDelete } from 'react-icons/md';
import {

  useNavigate,
} from "react-router-dom";



const CreatePost = ({
  user,
  fetchAllPosts,
  setSearchItem,
  setSearchedPins,
}) => {
  const navigate = useNavigate();

  const [wrongImageType, setWrongImageType] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageAsset, setImageAsset] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    //Get Categories Value from the sanity

    setSearchItem("");
    setSearchedPins([]);

    const getCategoyQuery = `*[_type=='category']{
      _id,
      categoryName
      } `;



    client.fetch(getCategoyQuery).then((data) => {
      console.log(data);
      setCategoryList(data);
    });
  }, []);

  const changeTitleValue = (currentValue) => {
    setTitle(currentValue);
    
  };

  const changeDescriptionValue = (currentValue) => {
    setDescription(currentValue);
   
  };

  const changeCategoryValue = (currentValue) => {

    setCategoryId(currentValue);
   
  };

  const createNewPost = async () => {
    if (loading) {
      window.alert("Image Upload in Progress...");
      return;
    }

    const currentDatetime = new Date().toISOString();
    if (title && description && imageAsset?._id && categoryId) {
      const obj = {
        _type: "post",
        postId: imageAsset?._id,
        title,
        description,
        category: {
          _type: "reference",
          _ref: categoryId,
        },
        destination: imageAsset?.url,
        post: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset?._id,
          },
        },
        postedbBy: {
          _type: "reference",
          _ref: user._id,
        },
        postedDate: currentDatetime,
      };
      console.log(obj);
      await client.create(obj).then(() => {
        console.log("Object Saved");
      });

      setLoading(true);

      const timeoutId = setTimeout(() => {
        fetchAllPosts();
        navigate("/");

        setLoading(false);
      }, 3000);
    } else {
      console.log("All values are not present");
    }
  };

  const uploadImage = (e) => {
    setLoading(true);
    const selectedFile = e.target.files[0];

    //uploading asset to sanity

    if (
      selectedFile.type === "image/png" ||
      selectedFile.type === "image/svg" ||
      selectedFile.type === "image/jpeg" ||
      selectedFile.type === "image/jpeg" ||
      selectedFile.type === "image/gif" ||
      selectedFile.type === "image/tiff"
    ) {
      setWrongImageType(false);
      // setLoading(true );
      client.assets
        .upload("image", selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        })
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
          console.log("Image Uploadded Successfully ");
        })
        .catch((error) => {
          console.log("Upload Failed ", error.message);
          window.alert("upload Failed ", error.message);
        });
    } else {
      setLoading(false);
      setWrongImageType(true);
    }
  };

  return (
    <div className="createPostContainer">
      <div className="imageBox1">
        {loading ? (
          <Spinner message="Uploading ......" />
        ) : (
          <div className="imageBox2">
            {imageAsset === null ? (
              <label>
                <div className="imageUploadSection">
                  <div className="iconPart">
                    <AiOutlineCloudUpload className="cloudIcon" />

                    {wrongImageType ? (
                      <p>Wrong Image , Please Upload Again</p>
                    ) : (
                      <p className="clickToUpload"> Click to upload</p>
                    )}
                  </div>

                  <div className="recommendationWarning">
                    <p className="recomendation">
                      Recommendation:User high-quality JPG, JPEG, SVG, PNG, GIF
                      or TIFF less than 20MB
                    </p>
                  </div>
                </div>

                <input
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                  className="imageInput"
                />
              </label>
            ) : (
              <div className="displayImageSection">
                <img
                  src={imageAsset?.url}
                  alt="uploaded-pic"
                  className="uploadedImage"
                />

                <buton
                  type="button"
                  className="deleteButton"
                  onClick={() => {
                    setImageAsset(null);
                  }}
                >
                  <MdDelete className="deleteIcon" />
                </buton>
              </div>
            )}
          </div>
        )}
      </div>

      {/**For the INformation of the Image */}

      <div className="informationSection">
        <div className="userInfo">
          <img className="userProfileImage2" src={user.profilePhoto} />
          <h1 className="displayName2"> {user.name}</h1>
        </div>
        <div className="inputFields">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => changeTitleValue(e.target.value)}
            placeholder="For eg. Bird"
          />
        </div>

        <div className="inputFields">
          <label for="description">Description</label>
          <input
            id="description"
            type="text"
            required
            value={description}
            onChange={(e) => changeDescriptionValue(e.target.value)}
            placeholder="For eg. A beautiful red coloured bird flying under the shine of moon"
          />
        </div>

        <div className="inputFields">
          <label htmlFor="">Category</label>
          <select
            required
            onChange={(e) => changeCategoryValue(e.target.value)}
          >
            ''
            <option value="other">Select Category Option</option>
            {
              /**Fetching all the categories from the backend */
              categoryList.map((item) => {
                return <option value={item._id}> {item.categoryName}</option>;
              })
            }
          </select>

          <div className="postButtonS ection">
            <button className="postButton" onClick={createNewPost}>
              {" "}
              <AiOutlineSend />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost