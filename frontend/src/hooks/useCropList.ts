import { useModal } from "./useModal";
import api from "../utils/api";
import { useState, useEffect} from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAuth } from "../context/AuthContext";

interface Crop {
    _id?: string;
    name: string;
    description?: string;
    image?: string;
    [key: string]: unknown;
}
export default function useCropList(){
    const MySwal = withReactContent(Swal);
    const {isOpen, openModal, closeModal} = useModal();
    const [ selectedCrop, setSelectedCrop ] = useState<Crop[]>([]);
    const [ selectedCropIds, setSelectedCropIds ] = useState<string[]>([]);
    const [ name, setName ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ image, setImage ] = useState<File | null>(null);
    const [ action, setAction ] = useState<"create" | "edit">("create");
    const [imagePreview, setImagePreview] = useState<string | null>(null); 
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [ cropId, setCropId ] = useState<string | null>(null);
    const [ data, setData ] = useState<Crop[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState({
        name: "",
        description: "",
        image: "",
        soil: "",
    });

    const { user } = useAuth();
    const [openDropdownIndex, setOpenDropdownIndex] = useState<string | null>(null);
    function toggleDropdown(index: string) {
        setOpenDropdownIndex(openDropdownIndex === index ? null : index);
    }

    function closeDropdown() {
        setOpenDropdownIndex(null);
    }

    const fetchCrops = async () => {
        try {
            const response = await api.get("/api/soil");
            setSelectedCrop(response.data.soil);
        } catch (error) {
            toast.error("Error fetching crops: " + error);
        }
    }
    const openDeleteButton = async( crop: Crop) => {
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
                    await api.delete(`/api/crop/${crop._id}`);
                    setIsLoading(false);
                    toast.success('Crop deleted successfully');
                    setData(prev => prev.filter(s => s._id !== crop._id));
                } catch (error) {
                    setIsLoading(false);
                    toast.error('Something went wrong!! '+ error);
                }
            }
        })
    }

    // edit 
    const openEditModal = async (crop: Crop) => {
        setAction("edit");
        setName(crop.name || "");
        setDescription(crop.description || "");
        setImage(null);
        setImagePreview(crop.image || null);
        setCropId(crop._id || null);
        // Set the selected soil IDs from the crop's soil_id array
        if (crop.soil_id && Array.isArray(crop.soil_id)) {
            const soilIds = crop.soil_id.map(soil => 
                typeof soil === 'string' ? soil : soil._id
            );
            setSelectedCropIds(soilIds);
        } else {
            setSelectedCropIds([]);
        }
        
        openModal();
    }
     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        setImage(file);
        
        if (file) {
            // Create preview URL for the selected file
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    function closingModal() {
        closeModal();
        setAction("create");
        setName("");
        setDescription("");
        setImage(null);
        setImagePreview(null); // Reset preview
        setSelectedCropIds([]);
        setError({
            name: "",
            description: "",
            image: "",
            soil: "",
        })
        
        if (imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }
    }

    useEffect(() => {
        api.get("/api/crop")
            .then(response => {
                const crops = response.data.crop || [];
                setData(crops.reverse());
            })
            .catch(error => {
                toast.error("Error fetching crops: " + error);
            })
            .finally(() => {
                setLoading(false);
            });

        fetchCrops();
    }, []);

   const filtered = Array.isArray(data)
    ? data.filter((u) =>
        `${u.name}`.toLowerCase().includes(searchTerm.toLowerCase())
        )
    : [];

    const resetData = () => {
        setName("");
        setDescription("");
        setImage(null);
        setSelectedCrop([]);
        setSelectedCropIds([]);
        setAction("create");
        setCropId(null);
        setError({
            name: "",
            description: "",
            image: "",
            soil: "",
        })
    };
    const handleCreate = () => { openModal(); }

    const validateField = (name: string, value: string) => {
        switch (name) {
            case 'name':
                return value.trim() === '' ? 'Name is required' : '';
            case 'description':
                return value.trim() === '' ? 'Description is required' : '';
            case 'image':
                if(action ==  "create"){
                    return !image ? 'Image is required' : '';
                }
                return '';
            default:
                return '';
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        const validationErrors = {
            name: validateField('name', name),
            description: validateField('description', description),
            image: validateField('image', image as unknown as string),
            soil: selectedCropIds.length === 0 ? "Please select at least one soil classification." : ""
        };
        if (Object.values(validationErrors).some((error) => error !== '')) {
            setError(validationErrors);
            event?.preventDefault();
            return;
        }
        setIsLoading(true);
        if (action === "create") {
            // Handle create logic
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            selectedCropIds.forEach(id => {
                formData.append("soil_id", id);
            });
            if (image) {
                formData.append("image", image);
            }
            try {
                await api.post("/api/crop/create", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                closeModal();
                const allCropsResponse = await api.get("/api/crop");
                const crops = allCropsResponse.data.crop || [];
                setData(crops.reverse());
                fetchCrops();
                setIsLoading(false);
                toast.success("Crop created successfully");
            } catch (error) {
                toast.error("Error creating crop: " + error);
                setIsLoading(false);
            }
            finally{
                resetData();
            }
        } else {
            try {
                const formData = new FormData();
                formData.append("name", name);
                formData.append("description", description);
                selectedCropIds.forEach(id => {
                    formData.append("soil_id", id);
                });
                if (image) {
                    formData.append("image", image);
                }
                event?.preventDefault(); 
                await api.patch(`/api/crop/${cropId}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                closeModal();
                const allCropsResponse = await api.get("/api/crop");
                const crops = allCropsResponse.data.crop || [];
                setData(crops.reverse());
                fetchCrops();
                setIsLoading(false);
                toast.success("Crop updated successfully");
            } catch (error) {
                toast.error("Error updating crop: " + error);
                setIsLoading(false);
            } finally {
                resetData();
            }
        }
    }
    const toggleCropId = (id: string|number, checked: boolean) => {
        const key = String(id);
        
        setSelectedCropIds(prev => {
            const newIds = checked 
                ? (prev.includes(key) ? prev : [...prev, key])
                : prev.filter(x => x !== key);
            
            return newIds;
        });
    }

    return{
        isOpen,
        openModal,
        closeModal,
        selectedCrop,
        handleCreate,
        selectedCropIds,
        toggleCropId,
        setName,
        setDescription,
        setImage,
        name,
        description,
        image,
        handleSubmit,
        filtered,
        setSearchTerm,
        searchTerm,
        action,
        openEditModal,
        openDeleteButton,
        closeDropdown,
        toggleDropdown,
        user,
        setOpenDropdownIndex,
        openDropdownIndex,
        data,
        imagePreview, 
        handleImageChange,
        closingModal,
        isLoading,
        loading,
        error
    }
}