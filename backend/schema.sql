-- Esquema de la tabla pedidos (PostgreSQL / Neon)
CREATE TABLE IF NOT EXISTS pedidos (
  id                SERIAL PRIMARY KEY,
  cliente_nombre    VARCHAR(100) NOT NULL,
  direccion_destino VARCHAR(255) NOT NULL,
  localidad         VARCHAR(100) NOT NULL,
  provincia         VARCHAR(100) NOT NULL,
  latitud           NUMERIC(10,8),
  longitud          NUMERIC(11,8),
  temperatura_clima NUMERIC(5,2),
  velocidad_viento  NUMERIC(5,2),
  estado            VARCHAR(50) DEFAULT 'Pendiente',
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  producto          VARCHAR(100)
);
