const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const optimizeImages = async (req, res, next) => {

  try {

    if (!req.files || req.files.length === 0) {
      return next();
    }

    // ======================
    // CARPETA DESTINO
    // ======================

    const uploadDir = path.join(
      __dirname,
      "../uploads/properties"
    );

    // crear carpeta si no existe
    if (!fs.existsSync(uploadDir)) {

      fs.mkdirSync(uploadDir, {
        recursive: true
      });

    }

    const optimizedImages = [];

    // ======================
    // OPTIMIZAR
    // ======================

    for (const file of req.files) {

      const newFilename =
        "opt_" +
        Date.now() +
        "_" +
        Math.round(Math.random() * 1E9) +
        ".webp";

      const newPath = path.join(
        uploadDir,
        newFilename
      );

      await sharp(file.path)
        .resize(1200)
        .webp({ quality: 75 })
        .toFile(newPath);

      // borrar original
      fs.unlinkSync(file.path);

      optimizedImages.push(
        `uploads/properties/${newFilename}`
      );

    }

    req.optimizedImages = optimizedImages;

    next();

  } catch (error) {

    console.error("🔥 ERROR OPTIMIZANDO:", error);

    return res.status(500).json({
      error: "Error procesando imágenes"
    });

  }

};

module.exports = optimizeImages;