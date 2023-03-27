import http from "http";
import https from "https";
import axios from "axios";
import { logger } from "../logging";

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

const httpClient = axios.create({
  httpAgent,
  httpsAgent,
});

axios.interceptors.request.use((request) => {
  logger.info("Starting Request", { request });
  return request;
});

axios.interceptors.response.use((response) => {
  logger.info("Response:", { response });
  return response;
});

export { httpClient };
