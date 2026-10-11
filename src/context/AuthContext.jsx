
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

import api from "../services/api";

// Create authentication context
const AuthContext = createContext(null);

// Authentication provider
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    // Restore the user's session from the backend
    const checkAuth = useCallback(async () => {
        try {
            const response = await api.get("/auth/me");

            const authenticatedUser =
                response.data?.user ??
                response.data?.data?.user ??
                null;

            setUser(authenticatedUser);

            return authenticatedUser;
        } catch (error) {
            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {
                setUser(null);
            }

            return null;
        } finally {
            setAuthLoading(false);
        }
    }, []);

    // Check authentication when the app starts
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Register a new account
    const register = async (userData) => {
        const response = await api.post(
            "/auth/register",
            userData
        );

        const authenticatedUser =
            response.data?.user ??
            response.data?.data?.user ??
            null;

        if (authenticatedUser) {
            setUser(authenticatedUser);
        } else {
            await checkAuth();
        }

        return response.data;
    };

    // Log in an existing account
    const login = async (credentials) => {
        const response = await api.post(
            "/auth/login",
            credentials
        );

        const authenticatedUser =
            response.data?.user ??
            response.data?.data?.user ??
            null;

        if (authenticatedUser) {
            setUser(authenticatedUser);
        } else {
            await checkAuth();
        }

        return response.data;
    };

    // Log out the current account
    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } finally {
            setUser(null);
        }
    };

    // Share authentication data with child components
    const value = {
        user,
        setUser,
        authLoading,
        checkAuth,
        register,
        login,
        logout,
        isAuthenticated: Boolean(user),
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for authentication
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === null) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};

export default AuthContext;
