const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
require('dotenv').config();
const { getPool } = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());
// Configuración Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Nova Salud',
      version: '1.0.0',
      description: 'Documentación de la API de Nova Salud',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Servidor local' },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.get('/api-docs', (req, res) => res.redirect('/api-docs/'));

const productosRoutes = require('./routes/productos.routes');

app.use('/api/productos', productosRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'API Nova Salud v1.0', docs: '/api-docs' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ mensaje: 'Error interno del servidor', error: err.message });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;

async function iniciar() {
  try {
    await getPool();
    console.log('Base de datos conectada correctamente');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

iniciar();
