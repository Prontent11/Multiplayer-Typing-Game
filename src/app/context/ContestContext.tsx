// ContestContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { io } from "socket.io-client";

// Define types
const socket = io("http://localhost:3002");
interface ContestContextProps {
  userName: string | null;
  setUserName: (name: string | null) => void;
  contestId: string | null;
  setContest: (id: string | null) => void;
  socket: any;
}

interface ContestProviderProps {
  children: ReactNode;
}

// Create the context
const ContestContext = createContext<ContestContextProps | undefined>(
  undefined
);

// Create a provider component
export const ContestProvider: React.FC<ContestProviderProps> = ({
  children,
}) => {
  const [contestId, setContestId] = useState<string | null>(null);
  const [userName, setName] = useState<string | null>(null);
  const setUserName = (name: string | null) => {
    setName(name);
    localStorage.setItem("userDetails", JSON.stringify(name));
  };
  useEffect(() => {
    const data = localStorage.getItem("userDetails");
    let value = JSON.parse(data!);
    setName(value);
    const id = localStorage.getItem("contestId");
    let val = JSON.parse(id!);
    setContest(val);
  }, []);
  const setContest = (id: string | null) => {
    setContestId(id);
    if (id == null) localStorage.removeItem("contestId");
    else localStorage.setItem("contestId", JSON.stringify(id));
  };

  return (
    <ContestContext.Provider
      value={{ contestId, setContest, userName, setUserName, socket }}
    >
      {children}
    </ContestContext.Provider>
  );
};

// Create a custom hook to use the context
export const useContest = (): ContestContextProps => {
  const context = useContext(ContestContext);
  if (!context) {
    throw new Error("useContest must be used within a ContestProvider");
  }
  return context;
};
