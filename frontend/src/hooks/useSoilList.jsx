import { useModal } from "./useModal";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import api from "../utils/api";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';


export function useSoilList() {
    const [data, setData] = useState([]);
    const {isOpen, openModal, closeModal} = useModal();
    const { user } = useAuth();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [action, setAction] = useState("add");
    const [searchTerm, setSearchTerm] = useState("");
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
    const MySwal = withReactContent(Swal);
    const [selectedSoil, setSelectedSoil] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState({
        name: "",
        description: "",
        image: ""
    });

    function toggleDropdown(index) {
        setOpenDropdownIndex(openDropdownIndex === index ? null : index);
    }

    function closeDropdown() {
        setOpenDropdownIndex(null);
    }
    const openDeleteButton = (soil) => {
        closeDropdown();
        MySwal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            scrollbarPadding: false, 
            heightAuto: false 
        }).then(async (result) => {
            if (result.isConfirmed) {
                setIsLoading(true);
                try {
                    await api.delete(`/api/soil/${soil._id}`);
                    setIsLoading(false);
                    toast.success('Soil deleted successfully');
                    setData(prev => prev.filter(s => s._id !== soil._id));
                } catch (error) {
                    setIsLoading(false);
                    toast.error('Something went wrong!! '+ error.message);
                }
            }
        })
    }
    const openEditModal = (soil) => {
        setAction("edit");
        setSelectedSoil(soil);
        setName(soil.name);
        setDescription(soil.description);
        setImage(null); 
        setImagePreview(soil.image); 
        openModal();
        console.log(soil.image);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        
        if (file) {
            // Create preview URL for the selected file
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    useEffect(() => {
        api.get('/api/soil')
            .then((res) => {
                setData((res.data.soil || []).reverse());
            })
            .catch((error) => {
                console.error('Error fetching soil data:', error);
            })
            .finally(() => setLoading(false));
    },[])

    function closingModal() {
        closeModal();
        setAction("Add");
        setName("");
        setDescription("");
        setImage(null);
        setImagePreview(null); // Reset preview
        setSelectedSoil(null);
        setError({});
        
        // Clean up object URL to prevent memory leaks
        if (imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }
    }
    const filtered = data.filter((u) =>
        `${u.name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    const validateFields = () => {
        const errors = {};
        if (!name.trim()) errors.name = "Name is required";
        if (!description.trim()) errors.description = "Description is required";
        if (action === "add" && !image) errors.image = "Image is required";
        return errors;
    };

    const handleSubmit = async (event) => {

        const errors = validateFields();
        setError(errors);
        if (Object.keys(errors).length > 0) {
            event?.preventDefault();
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        if (image) {
            formData.append("image", image);
        }

        try {
            setIsLoading(true);
            if(action === "add") {
                const response = await api.post('/api/soil/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setData(prev => [response.data.soil, ...prev]);
                closeModal();
                setIsLoading(false);
                toast.success("Soil data added successfully");
            }else{
                const response = await api.put(`/api/soil/${selectedSoil._id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });

                setData(prev =>
                    prev.map(soil =>
                        soil._id === selectedSoil._id
                            ? { ...soil, name, description, image: response.data.soil.image }
                            : soil
                    )
                );
                closeModal();
                setIsLoading(false);
                toast.success('Successfully update the soil');
            }
        }
        catch(error) {
            console.log(error)
            toast.error("Error");
            setIsLoading(false);
        }
        finally{
            setName("");
            setDescription("");
            setImage(null);
            setSelectedSoil(null)
            setAction("add");
        }
    }
    return {
        isOpen,
        openModal,
        closeModal,
        name,
        setName,
        description,
        setDescription,
        setImage,
        image,
        handleSubmit,
        user,
        searchTerm,
        setSearchTerm,
        filtered,
        openDropdownIndex,
        toggleDropdown,
        closeDropdown,
        openDeleteButton,
        openEditModal,
        action,
        isLoading,
        loading,
        setAction,
        closingModal,
        imagePreview, 
        handleImageChange,
        error,
    }
}