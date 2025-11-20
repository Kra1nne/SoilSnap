import { createPortal } from 'react-dom';

const SpinnerOverlay = () => {
  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-700 bg-opacity-50">
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-success-500"><span className="sr-only">Loading...</span></div>
      </div>
    </div>,
    document.body
  );
};

export default SpinnerOverlay;
