import apiClient from "@/lib/apiClient";

export async function login(payload) {
  const { data } = await apiClient.post("/auth/login", payload);
  return data;
}

export async function register(payload) {
  const { data } = await apiClient.post("/auth/register", payload);
  return data;
}

export async function fetchCurrentUser() {
  const { data } = await apiClient.get("/auth/me");
  return data;
}

export async function logout() {
  await apiClient.post("/auth/logout");
}

export async function uploadProfileImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await apiClient.post("/upload/profile-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function updateProfile(payload) {
  const { data } = await apiClient.patch("/users/update", payload);
  return data;
}
