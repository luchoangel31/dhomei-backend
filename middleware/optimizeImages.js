const sharp = require("sharp")
const path = require("path")
const fs = require("fs")

const optimizeImages = async (req, res, next) => {

  if (!req.files) return next()

  const optimizedImages = []

  for (const file of req.files) {

    const newFilename = "opt_" + Date.now() + ".webp"
    const newPath = path.join("uploads/properties", newFilename)

    await sharp(file.path)
      .resize(1200) // tamaño máximo
      .webp({ quality: 75 }) // compresión
      .toFile(newPath)

    fs.unlinkSync(file.path) // borra imagen original

    optimizedImages.push(newFilename)
  }

  req.optimizedImages = optimizedImages

  next()
}

module.exports = optimizeImages