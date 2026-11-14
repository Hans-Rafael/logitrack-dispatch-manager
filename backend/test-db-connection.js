import {db} from "./src/config/db.js";

async function testConnection() {
  try {
    const result = await db.query("SELECT NOW()");
    console.log(
      "=============================================\n¡Conexión exitosa a Neon! Hora actual en BD: ",
      result.rows[0].now,
      "\n=============================================",
    );
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
  } finally {
    await db.end();
  }
}

testConnection();
