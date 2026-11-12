import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

//(health check)
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: 'Servidor funcionando correctamente con pnpm' });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});