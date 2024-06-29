import axios from "axios";
import { setupCache } from "axios-cache-interceptor";

const instance = axios.create();
const cachedClient = setupCache(instance, {
  methods: ["post", "get"],
  interpretHeader: true,
  ttl: 3 * 60 * 1000, // 3 min cache
});

export { cachedClient };
