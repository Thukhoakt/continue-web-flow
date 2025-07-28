import { useState, useEffect } from 'react';

interface UseDeviceDetectionReturn {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

export const useDeviceDetection = (): UseDeviceDetectionReturn => {
  const [deviceInfo, setDeviceInfo] = useState<UseDeviceDetectionReturn>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouchDevice: false,
    deviceType: 'desktop'
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;
      
      let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
      if (isMobile) deviceType = 'mobile';
      else if (isTablet) deviceType = 'tablet';
      
      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        isTouchDevice,
        deviceType
      });
    };

    updateDeviceInfo();
    window.addEventListener('resize', updateDeviceInfo);
    
    return () => window.removeEventListener('resize', updateDeviceInfo);
  }, []);

  return deviceInfo;
};