import axios from "axios";

const tmdb = axios.create({
  baseURL: import.meta.env.VITE_TMDB_API_BASE_URL,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
  },
});

export default tmdb;
