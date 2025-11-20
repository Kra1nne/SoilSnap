import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { ThemeToggleButton } from '../common/ThemeToggleButton';
import UserDropdown from './UserDropdown';
import { useAuth } from '../../context/AuthContext';
import { useRole } from '../../hooks/useRole';

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const { isAdmin } = useRole();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation(); 

  // Navigation items array
  const navigationItems = [
    { name: 'Home', url: '/home', authRequired: false },
    { name: 'Soil Location', url: '/soil-map', authRequired: false },
    { name: 'About Soil', url: '/about-soil', authRequired: false },
    { name: 'Contact', url: '/contact', authRequired: false },
  ];

  // Function to check if current path is active
  const isActiveLink = (url) => {
    return location.pathname === url;
  };

  return (
    <>
      <header className='sticky py-3 left-0 right-0 top-0 z-99 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800 flex items-center justify-between px-2 sm:px-4 lg:px-6 shadow-md'>
        {/* Logo Section */}
        <div className='flex items-center min-w-0 mt-1'>
          <Link to="/dashboard" className='text-lg sm:text-2xl font-semibold dark:text-success-500 hover:text-success-500 dark:hover:text-success-500 transition-colors truncate text-success-700'>
            <img className='dark:hidden' src="/images/logo/SoilSnap.png" alt="Logo" width={40} />
            <img
              className="hidden dark:block"
              src="/images/logo/Logo.png"
              alt="Logo"
              width={40}
            />
          </Link>
        </div>

        <nav className='hidden md:flex items-center gap-4 lg:gap-6 ml-4 lg:ml-8'>
          {navigationItems.map((item) => (
            <Link 
              key={item.url}
              to={item.url} 
              className={`px-2 lg:px-3 py-2 text-sm font-small transition-colors whitespace-nowrap rounded-lg ${
                isActiveLink(item.url)
                  ? 'text-success-500 bg-success-50 dark:bg-success-900/30 dark:text-success-400'
                  : 'text-dark-700 dark:text-gray-300 hover:text-success-500 dark:hover:text-success-500 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        
        {/* Right Side - Theme Toggle and Auth */}
        <div className='flex items-center gap-1 sm:gap-2 lg:gap-4 min-w-0'>
          <div className='hidden sm:block'>
            <ThemeToggleButton />
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className='md:hidden p-1.5 sm:p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0'
          >
            <svg className='w-5 h-5 sm:w-6 sm:h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16' />
            </svg>
          </button>

          {isAuthenticated ? (
            <div className='flex items-center'> 
              <UserDropdown />
            </div>
          ) : (
            <div className='flex items-center gap-1 sm:gap-2'>
              <Link to="/signin" className='px-2 sm:px-4 py-1.5 sm:py-2 bg-success-500 rounded-lg sm:rounded-xl text-white hover:bg-success-600 transition-colors text-xs sm:text-sm whitespace-nowrap'>
                Sign in
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className='md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800'>
          <nav className='px-2 sm:px-4 py-3 sm:py-4 space-y-1 sm:space-y-2'>
            {/* Show theme toggle in mobile menu for very small screens */}
            <div className='sm:hidden pb-2 border-b border-gray-200 dark:border-gray-700 mb-2'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300 ml-2'>Theme</span>
                <ThemeToggleButton />
              </div>
            </div>
            
            {navigationItems.map((item) => (
              <Link 
                key={`mobile-${item.url}`}
                to={item.url} 
                className={`block px-2 sm:px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActiveLink(item.url)
                    ? 'text-success-500 bg-success-50 dark:bg-success-900/30 dark:text-success-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-success-500 dark:hover:text-success-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}