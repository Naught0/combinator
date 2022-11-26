import axios from "axios";
import { setupCache } from "axios-cache-adapter";

const cache = setupCache({ maxAge: 10 * 60 * 1000, exclude: { query: false } });

const cachedClient = axios.create({
  adapter: cache.adapter,
});

export { cachedClient };
