import { Router } from "express";
import { crearPedido } from "../controllers/pedidosController.js";

const router = Router();

// Endpoint POST /api/pedidos-> validando geolocalización y clima
router.post("/", crearPedido);

export default router;
