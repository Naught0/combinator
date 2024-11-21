import axios from "axios";
import { setupCache } from "axios-cache-interceptor";

const instance = axios.create();
const cachedClient = setupCache(instance, {
  methods: ["post", "get"],
  interpretHeader: true,
  ttl: 1 * 60 * 1000, // 1 min cache
});

export { cachedClient };
