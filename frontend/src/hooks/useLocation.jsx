import { useState, useEffect } from 'react';
import api from '../utils/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useModal } from "./useModal";
import { toast } from 'react-toastify';



export default function useLocation() {
  const [location, setLocation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const MySwal = withReactContent(Swal);
  const { isOpen, openModal, closeModal } = useModal();

  const handleDelete = async (id) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this location',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/api/location/${id}`);
          setLocation((prev) => prev.filter((loc) => loc._id !== id));
          toast.success("Location deleted successfully!");
        } catch (err) {
          console.error('Error deleting location:', err);
        }
      }
    });
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await api.get('/api/location');
        setLocation(response.data);
      } catch (err) {
        console.error('Error fetching location data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  const filteredLocations = location.filter((loc) => 
        `${loc.soil_classification} ${loc.number}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
);

  return { filteredLocations, loading, searchTerm, setSearchTerm, handleDelete, isOpen, openModal, closeModal, setLocation };
}