import api from "../utils/api";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";

export function useNewPassword() {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [password, setPassword] = useState('');
    const [isValidToken, setIsValidToken] = useState(false);

    useEffect(() => {
        const validateAccess = async () => {
            const newPasswordToken = sessionStorage.getItem('newPasswordToken');
            
            if (!newPasswordToken || !email) {
                toast.error('Unauthorized access. Please start the password reset process again.');
                navigate('/reset-password');
                return;
            }

            try {
                const response = await api.post('/api/auth/validate-new-password-token', { 
                    token: newPasswordToken 
                });
                
                if (response.data.success && response.data.email === email) {
                    setIsValidToken(true);
                } else {
                    throw new Error('Invalid token');
                }
            } catch {
                toast.error('Session expired. Please start the password reset process again.');
                sessionStorage.removeItem('newPasswordToken');
                navigate('/reset-password');
            } finally {
                setIsLoading(false);
            }
        };
        
        validateAccess();
    }, [email, navigate]);

    const handleNewPassword = async () => {
        if (!isValidToken) {
            toast.error('Invalid session. Please start again.');
            navigate('/reset-password');
            return;
        }

        if(!email || !password) {
            toast.error("Password is required.");
            return;
        }
        
        setIsLoading(true);
        let errorOccurred = false;
        
        try {
            await api.post('/api/auth/new-password', {
                email,
                password
            });
            // Clear the token after successful password update
            sessionStorage.removeItem('newPasswordToken');
        } catch (error) {
            console.error("Error updating password:", error);
            errorOccurred = true;
            toast.error("Failed to update password. Please try again.");
        } finally {
            setIsLoading(false);
            if(!errorOccurred){
                Swal.fire({
                    title: 'Password Updated',
                    text: 'Your password has been updated successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/signin';
                    }
                });
            }
        }
    }

    return{
        email,
        showPassword,
        setShowPassword,
        isLoading,
        password,
        setPassword,
        handleNewPassword,
        isValidToken
    }
}