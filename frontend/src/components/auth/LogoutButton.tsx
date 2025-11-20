import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router';

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  className = "bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors", 
  children = "Logout" 
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

  return (
    <button 
      onClick={handleLogout}
      className={className}
    >
      {children}
    </button>
  );
};

export default LogoutButton;
