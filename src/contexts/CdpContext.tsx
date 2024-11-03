import React, { createContext, useContext, useState } from 'react';
import { CdpApiService } from '../services/cdp';
import { AxiosHttpClient } from '../services/http/HttpClient';

interface CdpContextType {
  cdpService: CdpApiService | null;
  isConfigured: boolean;
  setCredentials: (keyName: string, keySecret: string) => void;
}

const CdpContext = createContext<CdpContextType>({
  cdpService: null,
  isConfigured: false,
  setCredentials: () => {},
});

export const useCdp = () => useContext(CdpContext);

export const CdpProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cdpService, setCdpService] = useState<CdpApiService | null>(null);

  const setCredentials = (keyName: string, keySecret: string) => {
    const service = new CdpApiService(new AxiosHttpClient(), keyName, keySecret);
  
    setCdpService(service);
  };

  return (
    <CdpContext.Provider value={{
      cdpService,
      isConfigured: !!cdpService,
      setCredentials,
    }}>
      {children}
    </CdpContext.Provider>
  );
};

export default CdpContext;