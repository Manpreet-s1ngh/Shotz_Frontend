// src/sanityClient.js
import sanityClient from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// const currentTokn = process.env.REACT_APP_SANITY_TOKEN;
// Initialize Sanity client
const client = sanityClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID, // Replace with your actual project ID
  dataset: "production", // Replace with your dataset name
  apiVersion: "2022-03-07", // Use the current date for API version
  useCdn: false, // Set to false if you need fresh data
  token: process.env.REACT_APP_SANITY_TOKEN,
});

// Initialize image URL builder
const builder = imageUrlBuilder(client);

export function urlFor(source) {
  return builder.image(source);
}

export default client;



//! Next target is to set the sanity commands to set and get the data , means perform the crud application features.
//! Then I would work on the Ui system , and the overall react frontend work
