import axios from "axios";

const api = axios.create({ baseURL: "" });

export async function signin(credentials) {
  const response = await api.post("/auth/signin", credentials);
  if (response.data?.token) {
    localStorage.setItem("token", response.data.token);
  }
  if (response.data?.CurrentUser) {
    localStorage.setItem("currentUser", JSON.stringify(response.data.CurrentUser));
  }
  return response.data;
}

export async function createUser(userData) {
  const response = await api.post("/users/add_user/", {
    first_name: userData.first_name,
    last_name: userData.last_name,
    email: userData.email,
    phone_number: userData.phone_number ?? userData.phone,
    password: userData.password,
  });
  return response.data;
}

export async function signout() {
  const token = localStorage.getItem("token");
  try {
    if (token) {
      await api.post("/auth/logout", null, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
  }
}
