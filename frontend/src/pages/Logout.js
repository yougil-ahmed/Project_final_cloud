import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear user session (adjust as needed)
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login page
        navigate('/login');
    }, [navigate]);

    return (
        <div>
            <h2>Logging out...</h2>
        </div>
    );
};

export default Logout;