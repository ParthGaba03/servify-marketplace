import axios from 'axios';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';

const baseURL = 'https://servify-backend.onrender.com/api';

const useAxios = () => {
    const { authTokens, setAuthTokens, logoutUser } = useContext(AuthContext);

    const axiosInstance = axios.create({
        baseURL,
        headers: { Authorization: `Bearer ${authTokens?.access}` }
    });

    axiosInstance.interceptors.request.use(async req => {
        if (!authTokens) {
            return req;
        }

        const user = jwtDecode(authTokens.access);
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 5; // Check if token is about to expire

        if (!isExpired) return req;

        try {
            const response = await axios.post(`${baseURL}/users/token/refresh/`, {
                refresh: authTokens.refresh
            });
            localStorage.setItem('authTokens', JSON.stringify(response.data));
            setAuthTokens(response.data);
            req.headers.Authorization = `Bearer ${response.data.access}`;
            return req;
        } catch (error) {
            // If the refresh token is also invalid, log the user out.
            logoutUser();
        }
    });

    return axiosInstance;
};

export default useAxios;