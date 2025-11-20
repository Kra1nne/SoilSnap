import api from "../utils/api";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export function useResetForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
   

  const handleReset = async () => {
    if(email.trim() === '') {
      toast.error("Email is required");
      setIsLoading(false);
      event?.preventDefault();
      return;
    }

    if(email.trim() !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Invalid email address");
      setIsLoading(false);
      event?.preventDefault();
      return;
    }
    setIsLoading(true);

    try {
        const response = await api.post('/api/auth/reset-password', {email});
        if (response.data.success && response.data.resetToken) {
            // Store token temporarily and navigate with email
            sessionStorage.setItem('resetToken', response.data.resetToken);
            navigate('/otp', { state: { email } });
        }
    } catch (error: unknown) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError?.response?.data?.message) { 
            toast.error(axiosError.response.data.message);
        } else {
            toast.error("An error occurred. Please try again.");
        }
    } finally {
        setIsLoading(false);
    }
    
  };

  return { email, setEmail, isLoading, handleReset };
}