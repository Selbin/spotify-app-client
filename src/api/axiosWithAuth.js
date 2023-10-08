import axios from "axios";

const axiosWithAuth = axios.create({baseURL: process.env.REACT_APP_API_URL});

// Add an interceptor for request
axiosWithAuth.interceptors.request.use(
  async (config) => {
    const tokens = JSON.parse(localStorage.getItem("tokens"));

    if (tokens.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add an interceptor for response
axiosWithAuth.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // Refresh token logic here (e.g., make a request to refresh endpoint)
      const tokens = JSON.parse(localStorage.getItem("tokens"));

      if (tokens.refreshToken) {
        // Perform a request to refresh the access token
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}user/refresh`,
            {
              email: tokens.email,
              refreshToken: tokens.refreshToken,
            }
          );

          const newAccessToken = response.data.accessToken;

          // Update the stored access token
          tokens.accessToken = newAccessToken
          localStorage.setItem("tokens", JSON.stringify(tokens));

          // Retry the original request with the new access token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          localStorage.clear()
          console.error("Refresh token failed:", refreshError);
          window.location.href='/login'
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosWithAuth;
