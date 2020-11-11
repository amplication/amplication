export type Credentials = {
  username: string;
  password: string;
};

export function setCredentials(credentials: Credentials) {
  localStorage.setItem("credentials", JSON.stringify(credentials));
}

export function getCredentials(): Credentials | null {
  const raw = localStorage.getItem("credentials");
  if (raw === null) {
    return null;
  }
  return JSON.parse(raw);
}
