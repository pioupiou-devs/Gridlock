import React, { useState, useEffect, createContext } from 'react';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';

export interface SignalRContextType {
  connection: HubConnection | null;
  isConnected: boolean;
}

export const SignalRContext = createContext<SignalRContextType | undefined>(undefined);


export const SignalRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const backendUrl = (import.meta.env.VITE_BACKEND_URL as string | undefined) ?? "http://localhost:5281";
    const hubUrl = `${backendUrl.replace(/\/$/, "")}/gridhub`;

    // Étape A : Configuration du constructeur officiel de Microsoft
    const newConnection = new HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (!connection) return;

    // Étape B : Ouverture asynchrone du tunnel WebSocket
    connection.start()
      .then(() => {
        setIsConnected(true);
        console.log("[SignalR] Connecté au serveur .NET !");

        // Étape C : Branchement de l'écouteur du Hello World
        connection.on("ReceiveSimulationState", (data: { currentTick: number }) => {
            console.debug("turn number is " + data.currentTick);
        });
      })
      .catch(err => console.error("[SignalR] Erreur de connexion :", err));

    // Étape D : Nettoyage à la fermeture ou rechargement du composant
    return () => {
      connection.off("ReceiveMessage");
      connection.stop();
    };
  }, [connection]);

  return (
    <SignalRContext.Provider value={{ connection, isConnected }}>
      {children}
    </SignalRContext.Provider>
  );
};