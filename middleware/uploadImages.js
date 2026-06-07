const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ======================
// 📁 CARPETA UPLOADS
// ======================

const uploadDir = path.join(
  __dirname,
  '../uploads'
);

// Crear carpeta si no existe
fs.mkdirSync(uploadDir, {
  recursive: true
});

// ======================
// 📦 STORAGE
// ======================

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    cb(null, uploadDir);

  },

  filename: function (req, file, cb) {

    const uniqueName =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1E9);

    cb(
      null,
      uniqueName +
      path.extname(file.originalname)
    );

  }

});

// ======================
// 🖼️ FILTRO IMÁGENES
// ======================

const fileFilter = (req, file, cb) => {

  const allowedTypes =
    /jpeg|jpg|png|webp/;

  const ext =
    allowedTypes.test(
      path.extname(
        file.originalname
      ).toLowerCase()
    );

  const mime =
    allowedTypes.test(
      file.mimetype
    );

  if (ext && mime) {

    cb(null, true);

  } else {

    cb(
      new Error(
        'Solo se permiten imágenes JPG, PNG o WEBP'
      )
    );

  }

};

// ======================
// 🚀 MULTER
// ======================

const upload = multer({

  storage,

  limits: {

    fileSize:
      5 * 1024 * 1024 // 5MB

  },

  fileFilter

});

module.exports = upload;