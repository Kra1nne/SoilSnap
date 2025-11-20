import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * Hook to clean up password reset tokens when user navigates away from the reset flow
 * This prevents tokens from being left in sessionStorage
 */
export function usePasswordResetCleanup() {
    const location = useLocation();

    useEffect(() => {
        const currentPath = location.pathname;
        
        // If user is not in the password reset flow, clean up tokens
        const isInResetFlow = ['/reset-password', '/otp', '/new-password'].includes(currentPath);
        
        if (!isInResetFlow) {
            sessionStorage.removeItem('resetToken');
            sessionStorage.removeItem('newPasswordToken');
        }
    }, [location.pathname]);
}
