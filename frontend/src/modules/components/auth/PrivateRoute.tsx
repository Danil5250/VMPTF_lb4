import {useAuth} from "./AuthContext.tsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { loading, setShowLoginModal, getUser } = useAuth();
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const userData = await getUser();

                if (userData && userData.id && userData.login) {
                    setShowLoginModal(false);
                    setIsChecking(false);
                } else {
                    navigate('/');
                    setShowLoginModal(true);
                    setIsChecking(false);
                }
            }
            catch (error) {
                navigate('/');
                setShowLoginModal(true);
                setIsChecking(false);
            }
        }
        checkUser()
    }, []);



    if (loading || isChecking) {
        return <div>Loading...</div>;
    }


    return children;
};

export default PrivateRoute;
