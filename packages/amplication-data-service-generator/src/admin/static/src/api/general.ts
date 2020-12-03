import { api } from "./api";
import { Credentials } from "../auth";

export async function login(credentials: Credentials) {
  const response = await api.post("/login", credentials);
  return response.data;
}
