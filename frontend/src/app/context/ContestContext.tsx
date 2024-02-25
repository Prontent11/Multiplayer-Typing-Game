// ContestContext.tsx
import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useContext,
} from "react";
import { Socket, io } from "socket.io-client";

const socket = io(`${process.env.NEXT_PUBLIC_SOCKETAPI}`);
interface ContestContextProps {
  contestData: {
    userName?: string | null;
    contestName?: string | null;
    contestCode?: string | null;
    contestTimer?: number | null;
    contestCreator?: Boolean;
  };
  socket: Socket;
  setContestData: (data: ContestData) => void;
}

interface ContestData {
  userName?: string | null;
  contestName?: string | null;
  contestCode?: string | null;
  contestTimer?: number | null;
  contestCreator?: Boolean;
}

interface ContestProviderProps {
  children: ReactNode;
}

const ContestContext = createContext<ContestContextProps | undefined>(
  undefined
);

export const ContestProvider: React.FC<ContestProviderProps> = ({
  children,
}) => {
  const [contestData, setContestDataState] = useState<ContestData>({
    userName: null,
    contestName: null,
    contestCode: null,
    contestTimer: null,
    contestCreator: false,
  });

  const setContestData = (data: ContestData) => {
    setContestDataState(data);
    localStorage.setItem("contestData", JSON.stringify(data));
  };

  useEffect(() => {
    const storedData = localStorage.getItem("contestData");
    setContestDataState(storedData ? JSON.parse(storedData) : {});
  }, []);

  return (
    <ContestContext.Provider value={{ contestData, setContestData, socket }}>
      {children}
    </ContestContext.Provider>
  );
};

export const useContest = (): ContestContextProps => {
  const context = useContext(ContestContext);
  if (!context) {
    throw new Error("useContest must be used within a ContestProvider");
  }
  return context;
};
