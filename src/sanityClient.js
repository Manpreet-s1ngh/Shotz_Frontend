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
  token: "skC5xXJw0H6wO9KYhpccyAvHdBA5rFGEoE8E6oAVeJxUSUi5xu8ObSdDHG1BWBHwf6KdksOBgNtCqePZtjoRMyCwjD3zfwXl2imzRkjLklwlUY6vgdAau2TWer7A8fAv2zeS9Gg1Nt9pm6lKoEnCeyKk5vMeOAhbetSFlKKZy8YVQ5o7hjhx",
});

// Initialize image URL builder
const builder = imageUrlBuilder(client);

export function urlFor(source) {
  return builder.image(source);
}

export default client;



//! Next target is to set the sanity commands to set and get the data , means perform the crud application features.
//! Then I would work on the Ui system , and the overall react frontend work
