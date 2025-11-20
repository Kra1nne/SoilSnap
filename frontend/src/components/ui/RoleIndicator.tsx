import React from 'react';
import { useRole } from '../../hooks/useRole';

const RoleIndicator: React.FC = () => {
  const { currentRole, user } = useRole();

  if (!user || !currentRole) return null;

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'soil expert':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'user':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role.toLowerCase()) {
      case 'soil expert':
        return 'Soil Expert';
      case 'admin':
        return 'Admin';
      case 'user':
        return 'User';
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(currentRole)}`}>
      <span className="w-2 h-2 rounded-full bg-current mr-1"></span>
      {getRoleDisplayName(currentRole)}
    </div>
  );
};

export default RoleIndicator;
