require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

// =====================
// 🔐 SEGURIDAD
// =====================
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// =====================
// BASE DE DATOS
// =====================
const sequelize = require('./config/database');

// =====================
// MODELOS
// =====================
require('./models');

const app = express();

// =====================
// 🔥 NECESARIO PARA RENDER
// =====================
app.set('trust proxy', 1);

// =====================
// 🔐 HELMET
// =====================
app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

// =====================
// 🚫 RATE LIMIT
// =====================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'development' ? 1000 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Demasiadas solicitudes, intenta más tarde'
  }
});

app.use('/api', limiter);

// =====================
// 📁 UPLOADS
// =====================
const uploadsPath = path.join(
  __dirname,
  'uploads'
);

if (!fs.existsSync(uploadsPath)) {

  fs.mkdirSync(uploadsPath, {
    recursive: true
  });

  console.log('📁 Carpeta uploads creada');
}

// =====================
// 🌐 CORS
// =====================
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// =====================
// 🧩 MIDDLEWARE
// =====================
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// =====================
// 🖼️ ARCHIVOS ESTÁTICOS
// =====================
app.use(
  express.static(
    path.join(__dirname, 'public')
  )
);

app.use(
  '/uploads',
  express.static(uploadsPath)
);

// =====================
// ROUTERS API
// =====================
const authRouter = require('./routes/auth');
const propertiesRouter = require('./routes/properties');
const protectedRouter = require('./routes/protected');

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/properties', propertiesRouter);
app.use('/api/v1/protected', protectedRouter);

// =====================
// ❤️ HEALTH CHECK
// =====================
app.get('/health', (req, res) => {

  res.json({
    status: 'ok',
    message: 'API funcionando 🚀'
  });

});

// =====================
// 🔍 DEBUG UPLOADS
// =====================
app.get('/debug/uploads', (req, res) => {

  const propertiesDir = path.join(
    __dirname,
    'uploads',
    'properties'
  );

  if (!fs.existsSync(propertiesDir)) {

    return res.json({
      exists: false,
      message: 'La carpeta uploads/properties no existe'
    });

  }

  const files =
    fs.readdirSync(propertiesDir);

  res.json({
    exists: true,
    total: files.length,
    files
  });

});

// =====================
// ❌ 404 SOLO API
// =====================
app.use('/api', (req, res) => {

  res.status(404).json({
    error: 'Ruta API no encontrada'
  });

});

// =====================
// 🔥 ERROR GLOBAL
// =====================
app.use((err, req, res, next) => {

  console.error(
    '🔥 Error global:',
    err
  );

  res.status(
    err.status || 500
  ).json({

    success: false,

    error:
      err.message ||
      'Error interno del servidor'

  });

});

// =====================
// 🚀 SERVER
// =====================
const PORT =
  process.env.PORT || 3001;

async function startServer() {

  try {

    console.log(
      '🔌 Conectando a PostgreSQL...'
    );

    await sequelize.authenticate();

    console.log(
      '✅ PostgreSQL conectado correctamente'
    );

    await sequelize.sync({
      alter: true
    });

    console.log(
      '📦 Tablas sincronizadas'
    );

    app.listen(PORT, () => {

      console.log(
        `🚀 Server running at http://localhost:${PORT}`
      );

      console.log(
        `🌐 Frontend: http://localhost:${PORT}/login.html`
      );

    });

  } catch (error) {

    console.error(
      '❌ Error inicializando DB:',
      error
    );

    process.exit(1);

  }

}

startServer();