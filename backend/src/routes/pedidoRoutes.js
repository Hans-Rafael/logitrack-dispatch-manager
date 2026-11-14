import { Router } from 'express';
import { 
  crearPedido, 
  obtenerPedidos, 
  obtenerPedidoPorId, 
  actualizarPedido, 
  eliminarPedido 
} from '../controllers/pedidosController.js';

const router = Router();

router.post('/', crearPedido);
router.get('/', obtenerPedidos);
router.get('/:id', obtenerPedidoPorId);
router.patch('/:id', actualizarPedido);
router.delete('/:id', eliminarPedido);

export default router;