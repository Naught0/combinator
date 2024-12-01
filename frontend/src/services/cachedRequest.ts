import axios from "axios";
// NOTE: caching now takes place in react-query
export const cachedClient = axios.create();
