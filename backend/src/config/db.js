import pkg from 'pg'; 
import dotenv from 'dotenv';


dotenv.config();

const { Pool } = pkg;

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  //para conex seguras
  ssl: {
    rejectUnauthorized: false
  }
});
