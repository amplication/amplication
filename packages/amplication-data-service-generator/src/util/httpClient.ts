import http from "http";
import https from "https";
import axios from "axios";

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

export const httpClient = axios.create({
  httpAgent,
  httpsAgent,
});
