import { Server as NetServer } from "http";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export const SocketHandler = (req: any, res: NextApiResponseServerIO) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new SocketIOServer(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: process.env.NODE_ENV === "production" 
          ? process.env.APP_BASE_URL 
          : "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("New client connected:", socket.id);

      // Join order room for tracking
      socket.on("join-order", (orderId: string) => {
        socket.join(`order-${orderId}`);
        console.log(`Client ${socket.id} joined order room: order-${orderId}`);
      });

      // Join tracking room
      socket.on("join-tracking", (trackingCode: string) => {
        socket.join(`track-${trackingCode}`);
        console.log(`Client ${socket.id} joined tracking room: track-${trackingCode}`);
      });

      // Join rider room
      socket.on("join-rider", (riderId: string) => {
        socket.join(`rider-${riderId}`);
        console.log(`Client ${socket.id} joined rider room: rider-${riderId}`);
      });

      // Handle rider location updates
      socket.on("rider-location", (data: {
        riderId: string;
        orderId: string;
        lat: number;
        lng: number;
        heading?: number;
        speed?: number;
      }) => {
        // Broadcast location to order room
        socket.to(`order-${data.orderId}`).emit("rider:location", data);
        console.log(`Rider location update for order ${data.orderId}:`, data);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }
  res.end();
};
