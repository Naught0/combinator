import axios from "axios";
import { setupCache } from "axios-cache-interceptor";

const instance = axios.create();
const cachedClient = setupCache(instance, {
  methods: ["post", "get"],
  interpretHeader: true,
});

export { cachedClient };
