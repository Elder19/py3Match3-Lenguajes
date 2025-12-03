import { createContext } from "react";

export type ContextType = {
  socket: any | null;
  username: string;
  setUsername: (name: string) => void;
};

export const Context = createContext<ContextType>({
  socket: null,
  username: "",
  setUsername: () => {},
});

