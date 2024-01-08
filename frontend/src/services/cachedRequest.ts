import axios from "axios";
import { setupCache } from "axios-cache-adapter";

const cache = setupCache({
  maxAge: 5 * 60 * 1000,
  exclude: { query: false, methods: ["put", "patch", "delete"] },
});

const cachedClient = axios.create({
  adapter: cache.adapter,
});

export { cachedClient };
