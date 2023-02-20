import http from "http";
import https from "https";
import axios from "axios";
import { defaultLogger as logger } from "../server/logging";

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

const httpClient = axios.create({
  httpAgent,
  httpsAgent,
});

axios.interceptors.request.use((request) => {
  logger.info("Starting Request", JSON.stringify(request, null, 2));
  return request;
});

axios.interceptors.response.use((response) => {
  logger.info("Response:", JSON.stringify(response, null, 2));
  return response;
});

export { httpClient };
