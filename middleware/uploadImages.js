const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ======================
// CREAR CARPETA UPLOADS
// ======================

const uploadsPath = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

// ======================
// STORAGE
// ======================

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    cb(null, uploadsPath);

  },

  filename: function (req, file, cb) {

    const uniqueName =
      Date.now() + '-' + Math.round(Math.random() * 1E9);

    cb(
      null,
      uniqueName + path.extname(file.originalname)
    );

  }

});

// ======================
// FILTRO IMAGENES
// ======================

const fileFilter = (req, file, cb) => {

  const allowedTypes = /jpeg|jpg|png|webp/;

  const ext = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mime = allowedTypes.test(file.mimetype);

  if (ext && mime) {

    cb(null, true);

  } else {

    cb(new Error("Solo se permiten imágenes"));

  }

};

// ======================
// MULTER
// ======================

const upload = multer({

  storage,

  limits: {
    fileSize: 5 * 1024 * 1024
  },

  fileFilter

});

module.exports = upload;