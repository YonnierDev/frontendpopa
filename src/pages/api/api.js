import axios from "axios";

export const api = axios.create({
  //baseURL: "https://popnocturna-git-main-yonnierdevs-projects.vercel.app/api/",
  //baseURL: "http://localhost:7000/api/", 
  baseURL: "https://popnocturna-git-main-yonnierdevs-projects.vercel.app/api", 
  headers: {
    "Content-Type": "application/json",
  },
});
