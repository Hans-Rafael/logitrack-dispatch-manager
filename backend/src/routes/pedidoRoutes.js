import { Router } from 'express';
import { crearPedido } from '../controllers/pedidoController.js';

const router = Router();

// Endpoint POST /api/pedidos
router.post('/pedidos', crearPedido);

export default router;