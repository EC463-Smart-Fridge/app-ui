import { createContext, ReactNode, useState, useContext } from "react";

export const RefreshContext = createContext<any>(null);

export const RefreshProvider = ({ children }: { children: ReactNode }) => {
  const [refresh, setRefresh] = useState(false);
  const [expRefresh, setExpRefresh] = useState(false);

  return (
    // <RefreshContext.Provider value = {{ refresh, setRefresh}}>
    <RefreshContext.Provider value = {{ refresh, setRefresh, expRefresh, setExpRefresh}}>
      { children }
    </RefreshContext.Provider>
  );
}

export const useRefresh = () => {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error("That ain't it, chief")
  }
  return context;
}