import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
  timeout: 10000,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    const enrichedError = new Error(message);
    if (error.response) {
      enrichedError.status = error.response.status;
      enrichedError.data = error.response.data;
    }
    return Promise.reject(enrichedError);
  }
);

export default apiClient;
