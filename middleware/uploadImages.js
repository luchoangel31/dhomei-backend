const multer = require('multer');
const path = require('path');

// configuración de almacenamiento
const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    cb(null, 'uploads/');

  },

  filename: function (req, file, cb) {

    const uniqueName =
      Date.now() + '-' + Math.round(Math.random() * 1E9);

    cb(null, uniqueName + path.extname(file.originalname));

  }

});

// filtro para permitir solo imágenes
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

const upload = multer({

  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter

});

module.exports = upload;