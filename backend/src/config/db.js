import pkg from 'pg'; 
import dotenv from 'dotenv';

// Cargamos las variables de entorno
dotenv.config();

const { Pool } = pkg;
// Creamos la instancia del Pool con la URL de Neon y seguridad SSL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Exportamos usando ES Modules por defecto
export default {
  query: (text, params) => pool.query(text, params),
};