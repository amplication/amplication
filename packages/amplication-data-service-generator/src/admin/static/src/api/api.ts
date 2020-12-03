import axios from "axios";
import { getCredentials } from "../auth";
import { createBasicAuthorizationHeader } from "./http.util";

export const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const credentials = getCredentials();
  if (credentials) {
    config.headers["Authorization"] = createBasicAuthorizationHeader(
      credentials.username,
      credentials.password
    );
  }
  return config;
});
