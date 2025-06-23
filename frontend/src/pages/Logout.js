import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear user session (adjust as needed)
        localStorage.removeItem('token');
        // Validate if user is logged in before removing
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token || user) {
            localStorage.removeItem('user');
            // Show success notification
            import('react-toastify').then(({ toast }) => {
            toast.success('Logged out successfully!');
            });
        } else {
            // Show info notification
            import('react-toastify').then(({ toast }) => {
            toast.info('You are already logged out.');
            });
        }
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