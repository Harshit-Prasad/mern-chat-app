import React, { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

export default function SocketProvider({ children }) {
  const ENDPOINT = "https://converse-api.onrender.com";
  const socket = useMemo(
    () =>
      io(ENDPOINT, {
        withCredentials: true,
      }),
    []
  );

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
