'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ToastPortalProps {
  children: React.ReactNode;
}

export const ToastPortal: React.FC<ToastPortalProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted ? createPortal(
    children,
    document.body
  ) : null;
};