import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
    baseURL: process.env.BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const userInfoCookies = Cookies.get("userInfo");
        if (userInfoCookies){
            const userInfo = JSON.parse(userInfoCookies);
            const token = userInfo.token;

            if(token){
                config.headers.Authorization = `Bearer ${token}`;
            
            }
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
        if (error.response.status === 401) {
            Cookies.remove("userInfo");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);
export default api;