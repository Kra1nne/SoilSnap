import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router';
import api from '../utils/api';

export function useOTP() {
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isValidToken, setIsValidToken] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    useEffect(() => {
        const validateAccess = async () => {
            const resetToken = sessionStorage.getItem('resetToken');
            
            if (!resetToken || !email) {
                toast.error('Unauthorized access. Please start the password reset process again.');
                navigate('/reset-password');
                return;
            }

            try {
                const response = await api.post('/api/auth/validate-reset-token', { 
                    token: resetToken 
                });
                
                if (response.data.success && response.data.email === email) {
                    setIsValidToken(true);
                } else {
                    throw new Error('Invalid token');
                }
            } catch {
                toast.error('Session expired. Please start the password reset process again.');
                sessionStorage.removeItem('resetToken');
                navigate('/reset-password');
            } finally {
                setIsLoading(false);
            }
        };
        
        validateAccess();
    }, [email, navigate]);

    const handleSubmit = async (event?: React.FormEvent) => {
        event?.preventDefault();

        if (!isValidToken) {
            toast.error('Invalid session. Please start again.');
            navigate('/reset-password');
            return;
        }

        if (otp.length !== 6) {
            toast.error("OTP must be 6 digits.");
            return;
        }

        try {
            const response = await api.post('/api/auth/verify-reset-otp', {
                email, 
                otp
            });
            
            if (response.data.success && response.data.newPasswordToken) {
                // Store new password token and clear reset token
                sessionStorage.removeItem('resetToken');
                sessionStorage.setItem('newPasswordToken', response.data.newPasswordToken);
                navigate('/new-password', { state: { email } });
            }
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            if (axiosError?.response?.data?.message) {
                toast.error(axiosError.response.data.message);
            } else {
                toast.error("An unexpected error occurred. Please try again.");
            }
        }
    };

    return {
        otp,
        setOtp,
        handleSubmit,
        isLoading,
        isValidToken
    }
}