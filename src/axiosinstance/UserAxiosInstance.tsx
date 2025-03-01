import axios from "axios";
import { useNavigate } from "react-router-dom";
import SERVERURL from "../SERVERURL";

const API_BASE_URL = SERVERURL;

const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" }
});

// Add Authorization header to requests
instance.interceptors.request.use(
    (config) => {
        const user_access_token = localStorage.getItem("user_access_token");
        if (user_access_token) {
            config.headers["Authorization"] = `Bearer ${user_access_token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle token refresh on 401
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            const user_refresh_token = localStorage.getItem("user_refresh_token");

            if (user_refresh_token) {
                try {
                    const refreshResponse = await axios.post(`${API_BASE_URL}/refresh`, {
                        refresh: user_refresh_token
                    });

                    if (refreshResponse.status === 200) {
                        const new_access_token = refreshResponse.data.access;
                        localStorage.setItem("user_access_token", new_access_token);
                        error.config.headers["Authorization"] = `Bearer ${new_access_token}`;
                        return axios(error.config);
                    }
                } catch (refreshError) {
                    console.error("Token refresh failed:", refreshError);
                }
            }

            // Redirect to "/" if everything fails
            window.location.href = "/?msg=2"; // Use window.location instead of navigate
        }

        return Promise.reject(error);
    }
);

export default instance;
