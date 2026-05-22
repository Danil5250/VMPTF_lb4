import {createContext, JSX, useContext, useEffect, useState} from "react";
import {fetchUser, logoutUser} from "../../client-main/api/clientMainApi.ts";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

interface User {
    id: number;
    login: string;
}

export const AuthProvider = ({ children }: {children: JSX.Element}) => {
    const [user, setUser] = useState<User|null>(null);
    const [loading, setLoading] = useState(true);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const getUser = async () => {
        try {
            const result = await fetchUser();
            const userData = {id: result?.id, login: result?.login};
            setUser(userData);
            return userData;
        }
        catch (err) {
            setUser(null)
            return null;
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    const logout = async () => {
        await logoutUser();
        setUser(null);
    };

    // useEffect(() => {
    //     console.log("USER UPDATED:", user);
    // }, [user]);

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            loading,
            showLoginModal,
            setShowLoginModal,
            getUser,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};
