import { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
    const [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null);
    const [loading, setLoading] = useState(true);

    const logoutUser = useCallback(() => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
    }, []);

    const fetchUserDetails = useCallback(async (accessToken) => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/users/me/', {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            setUser(response.data);
        } catch (error) {
            console.error("Failed to fetch user details, logging out:", error);
            logoutUser();
        }
    }, [logoutUser]);


    const loginUser = async (username, password) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/users/token/', { username, password });
            const data = response.data;
            setAuthTokens(data);
            setUser(jwtDecode(data.access));
            localStorage.setItem('authTokens', JSON.stringify(data));
            await fetchUserDetails(data.access);
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            return false;
        }
    };

    useEffect(() => {
        const updateUser = async () => {
            if (authTokens) {
                await fetchUserDetails(authTokens.access);
            }
            setLoading(false);
        }
        updateUser()
    }, [authTokens, fetchUserDetails]);

    const contextData = {
        user,
        setUser,
        authTokens,
        setAuthTokens,
        loginUser,
        logoutUser,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? <p>Loading...</p> : children}
        </AuthContext.Provider>
    );
};
