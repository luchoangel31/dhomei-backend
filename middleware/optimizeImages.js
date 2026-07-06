const sharp = require("sharp");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");

const optimizeImages = async (req, res, next) => {
  try {

    if (!req.files || req.files.length === 0) {
      return next();
    }

    const optimizedImages = [];

    for (const file of req.files) {

      // Optimizar la imagen en memoria
      const optimizedBuffer = await sharp(file.path)
        .resize({
          width: 1200,
          withoutEnlargement: true
        })
        .webp({
          quality: 75
        })
        .toBuffer();

      // Subir a Cloudinary
      const result = await new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "properties",
            resource_type: "image"
          },
          (error, result) => {

            if (error) {
              return reject(error);
            }

            resolve(result);

          }
        );

        stream.end(optimizedBuffer);

      });

      // DEBUG CLOUDINARY
      console.log("✅ Imagen subida a Cloudinary:");
      console.log(result.secure_url);

      // Eliminar archivo temporal
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      // Guardar URL
      optimizedImages.push(result.secure_url);

    }

    console.log("📸 URLs finales:");
    console.log(optimizedImages);

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