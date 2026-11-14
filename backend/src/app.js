// src/app.js
import express from "express";
import cors from "cors";
import pedidosRoutes from "./routes/pedidoRoutes.js";

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Servidor funcionando correctamente con pnpm",
  });
});

// Rutas de la API
app.use("/api/pedidos", pedidosRoutes);

export default app;