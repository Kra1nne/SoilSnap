import { useModal } from "./useModal";
import { useAuth } from "../context/AuthContext"
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";
import axios from "axios";


export function useUpgradeCard() {
    const { isOpen, openModal, closeModal } = useModal();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    type UpgradeData = {
        firstname: string;
        middlename: string;
        lastname: string;
        email: string;
        image: File | null;
        description: string;
        type: string;
    };

    const data: UpgradeData = {
        firstname: user?.firstname || '',
        middlename: user?.middlename || '',
        lastname: user?.lastname || '',
        email: user?.email || '',
        image: null,
        description: '',
        type: '',
    };


    const [ upgradeData, setUpgradeData ] = useState(data);

    type ErrorState = {
        firstname: string;
        lastname: string;
        email: string;
        image: string;
        description: string;
        type: string;
    };
    const [error, setError] = useState<ErrorState>({
        firstname: '',
        lastname: '',
        email: '',
        image: '',
        description: '',
        type: '',
    });

    const options = [
        { value: "CV", label: "CV" },
        { value: "Resume", label: "Resume" }
    ];
    const validateField = (name: string, value: string | File | null) => {
        switch (name) {
            case 'firstname':
                return typeof value === 'string' && value.trim() === '' ? 'First name is required' : '';
            case 'lastname':
                return typeof value === 'string' && value.trim() === '' ? 'Last name is required' : '';
            case 'email': {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return typeof value === 'string' && emailRegex.test(value) ? '' : 'Invalid email address';
            }
            case 'image':
                return value === null ? 'Image is required' : '';
            case 'description':
                return typeof value === 'string' && value.trim() === '' ? 'Description is required' : '';
            case 'type':
                return typeof value === 'string' && value.trim() === '' ? 'Document type is required' : '';
            default:
                return '';
        }
    };

    const handleSave = async () => {
        
        const validationErrors: ErrorState = {
            firstname: validateField('firstname', upgradeData.firstname),
            lastname: validateField('lastname', upgradeData.lastname),
            email: validateField('email', upgradeData.email),
            image: validateField('image', upgradeData.image),
            description: validateField('description', upgradeData.description),
            type: validateField('type', upgradeData.type),
        };

        setError(validationErrors);
        if (Object.values(validationErrors).some((error) => error !== '')) {
            event?.preventDefault();
            return;
        }

        closeModal();
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("firstname", upgradeData.firstname);
            formData.append("middlename", upgradeData.middlename);
            formData.append("lastname", upgradeData.lastname);
            formData.append("email", upgradeData.email);
            if (upgradeData.image) formData.append("image", upgradeData.image);
            formData.append("description", upgradeData.description);
            formData.append("type", upgradeData.type);

            await api.post('/api/request/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success("Request successfully sent.");
            console.log("Saving changes...");

        } catch (error: unknown) {
            console.log(error);
            if(axios.isAxiosError(error) && error.response?.data?.message) {
                toast.warning(error.response.data.message);
            }
            else{
                toast.error("An unexpected error occurred. Please try again.");
            }
        }
        finally{
            upgradeData.image = null;
            upgradeData.description = '';
            upgradeData.type = '';
            upgradeData.middlename = '';
            setIsLoading(false);
        }
    };

    return{
        isOpen,
        openModal,
        closeModal,
        options,
        user,
        handleSave,
        upgradeData,
        setUpgradeData,
        isLoading,
        error
    }
}