import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socketInstance: Socket | null = null;

export default function useSocket(userId: string): Socket | null {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    if (!socketInstance) {
      socketInstance = io("http://localhost:3001", {
        transports: ["websocket"],
        reconnection: true,
      });

      console.log("🔌 Socket instance created");
    }

    socketInstance.emit("join", userId); // 👈 join the user's own room
    setSocket(socketInstance);

    return () => {
      socketInstance?.disconnect();
      socketInstance = null;
      console.log("❌ Socket disconnected");
    };
  }, [userId]);

  return socket;
}
