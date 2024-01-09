import axios from "axios";
import { setupCache } from "axios-cache-interceptor";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
const cachedClient = setupCache(instance, {
  methods: ["post", "get"],
  interpretHeader: true,
});

export { cachedClient };
