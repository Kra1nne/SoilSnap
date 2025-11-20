import { useAuth } from '../context/AuthContext';

/**
 * Custom hook for role-based access control
 */
export function useRole() {
  const { user, isAuthenticated } = useAuth();

  const hasRole = (requiredRole: string): boolean => {
    return isAuthenticated && user?.role === requiredRole;
  };

  const hasAnyRole = (requiredRoles: string[]): boolean => {
    return isAuthenticated && user?.role ? requiredRoles.includes(user.role) : false;
  };

  const isAdmin = (): boolean => {
    return hasRole('admin');
  };

  const isUser = (): boolean => {
    return hasRole('User');
  };

  const isSoilExpert = (): boolean => {
    return hasRole('Soil Expert');
  };

  const isRegularUser = (): boolean => {
    // Both 'User' and 'Soil Expert' are considered regular users for now
    return hasAnyRole(['User', 'Soil Expert']);
  };
  

  const canAccess = (requiredRoles: string[]): boolean => {
    return hasAnyRole(requiredRoles);
  };

  return {
    user,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    isAdmin,
    isUser,
    isSoilExpert,
    isRegularUser,
    canAccess,
    currentRole: user?.role || null
  };
}
