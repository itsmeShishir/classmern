import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
    baseURL: process.env.BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
    },
});

api.interceptors.request.use(
    (config) => {
        let token: string | undefined;

        const userInfoCookies = Cookies.get("userInfo");
        if (userInfoCookies) {
            try {
                token = JSON.parse(userInfoCookies)?.token;
            } catch {}
        }

        if (!token && typeof window !== "undefined") {
            try {
                const stored = localStorage.getItem("userInfo");
                token = stored ? JSON.parse(stored)?.token : undefined;
            } catch {}
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
        }
);

// stop 
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error?.response?.status === 401) {
            Cookies.remove("userInfo");
            if (typeof window !== "undefined") {
                localStorage.removeItem("userInfo");
                const redirect = encodeURIComponent(window.location.pathname + window.location.search);
                window.location.href = `/login?redirect=${redirect}`;
            }
        }
        return Promise.reject(error);
    }
);
export default api;
