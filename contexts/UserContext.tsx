import { createContext, ReactNode, useState, useContext } from "react";
import { Recipe } from "../src/API";

export type userType = {
    isLoggedIn: boolean,
    userId: string,
    username: string,
    email: string,
    name: string,
    recipes: Recipe[]
  }
  
  const initState: userType = {
    isLoggedIn: false,
    userId: '',
    username: '',
    email: '',
    name: '',
    recipes: []
  }
  
  export const UserContext = createContext<any>(null);
  
  export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<userType>(initState);
  
    return (
      <UserContext.Provider value = {{ user, setUser}}>
        { children }
      </UserContext.Provider>
    );
  }
  
  export const useUser = (): { user: userType; setUser: React.Dispatch<React.SetStateAction<userType>> } => {
    const context = useContext(UserContext);
    if (!context) {
      throw new Error("useUser must be used within a UserProvider");
    }
    return context;
  };
  