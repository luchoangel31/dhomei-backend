const express = require('express');
const router = express.Router();

const { Property, PropertyImage } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadImages');
const optimizeImages = require('../middleware/optimizeImages');

const { Op } = require('sequelize');

console.log("🏠 PROPERTIES ROUTER CARGADO");


// ===============================
// 🌎 PROPIEDADES PUBLICAS + BUSCADOR
// GET /api/properties
// ===============================
router.get('/', async (req, res) => {
  try {

    const {
      city,
      district,
      propertyType,
      operationType,
      minPrice,
      maxPrice
    } = req.query;

    const where = {};

    if (city) where.city = city;
    if (district) where.district = district;
    if (propertyType) where.propertyType = propertyType;
    if (operationType) where.operationType = operationType;

    if (minPrice || maxPrice) {

      where.price = {};

      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;

    }

    const properties = await Property.findAll({

      where,

      attributes: [
        'id',
        'title',
        'address',
        'price',
        'description',
        'operationType',
        'propertyType',
        'country',
        'city',
        'district',
        'views',
        'isFeatured'
      ],

      include: [
        {
          model: PropertyImage,
          as: "images",
          attributes: ["imageUrl"]
        }
      ],

      order: [['createdAt', 'DESC']]

    });

    res.json(properties);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error obteniendo propiedades"
    });

  }
});


// ===============================
// ⭐ PROPIEDADES DESTACADAS
// ===============================
router.get('/featured', async (req, res) => {
  try {

    const properties = await Property.findAll({

      where: { isFeatured: true },

      include: [
        {
          model: PropertyImage,
          as: "images",
          attributes: ["imageUrl"]
        }
      ],

      limit: 10,
      order: [['createdAt', 'DESC']]

    });

    res.json(properties);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error obteniendo propiedades destacadas"
    });

  }
});


// ===============================
// 👀 PROPIEDADES MÁS VISITADAS
// ===============================
router.get('/most-viewed', async (req, res) => {
  try {

    const properties = await Property.findAll({

      include: [
        {
          model: PropertyImage,
          as: "images",
          attributes: ["imageUrl"]
        }
      ],

      limit: 10,
      order: [['views', 'DESC']]

    });

    res.json(properties);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error obteniendo propiedades más visitadas"
    });

  }
});


// ===============================
// 👤 MIS PROPIEDADES
// ===============================
router.get('/my-properties', authMiddleware, async (req, res) => {
  try {

    const properties = await Property.findAll({

      where: { userId: req.user.id },

      include: [
        {
          model: PropertyImage,
          as: "images",
          attributes: ["imageUrl"]
        }
      ]

    });

    res.json(properties);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error obteniendo propiedades"
    });

  }
});


// ===============================
// ➕ CREAR PROPIEDAD + IMAGENES
// ===============================
router.post(
  '/',
  authMiddleware,
  upload.array('images', 5),
  optimizeImages,
  async (req, res) => {

    try {

      if (!req.optimizedImages || req.optimizedImages.length < 3) {

        return res.status(400).json({
          error: "Debe subir mínimo 3 imágenes"
        });

      }

      const property = await Property.create({

        title: req.body.title,
        description: req.body.description,
        price: req.body.price,

        operationType: req.body.operationType,
        propertyType: req.body.propertyType,
        country: req.body.country,

        address: req.body.address,
        city: req.body.city,
        district: req.body.district,

        bedrooms: req.body.bedrooms,
        bathrooms: req.body.bathrooms,
        area: req.body.area,

        views: 0,
        isFeatured: false,

        userId: req.user.id

      });

      const images = req.optimizedImages.map(filename => ({

        imageUrl: filename,
        propertyId: property.id

      }));

      await PropertyImage.bulkCreate(images);

      res.status(201).json({

        message: "Propiedad creada con imágenes optimizadas",
        property,
        images

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error: "Error creando propiedad"
      });

    }

});


// ===============================
// 🔎 VER PROPIEDAD
// ===============================
router.get('/:id', async (req, res) => {
  try {

    const property = await Property.findByPk(req.params.id, {

      include: [
        {
          model: PropertyImage,
          as: "images",
          attributes: ["imageUrl"]
        }
      ]

    });

    if (!property) {
      return res.status(404).json({
        error: "Propiedad no encontrada"
      });
    }

    property.views += 1;
    await property.save();

    res.json(property);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error obteniendo propiedad"
    });

  }
});


// ===============================
// ✏️ EDITAR PROPIEDAD
// ===============================
router.put('/:id', authMiddleware, async (req, res) => {
  try {

    const property = await Property.findOne({

      where: {
        id: req.params.id,
        userId: req.user.id
      }

    });

    if (!property) {

      return res.status(404).json({
        error: "Propiedad no encontrada"
      });

    }

    await property.update(req.body);

    res.json(property);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error actualizando propiedad"
    });

  }
});


// ===============================
// 🗑️ ELIMINAR PROPIEDAD
// ===============================
router.delete('/:id', authMiddleware, async (req, res) => {
  try {

    const property = await Property.findOne({

      where: {
        id: req.params.id,
        userId: req.user.id
      }

    });

    if (!property) {

      return res.status(404).json({
        error: "Propiedad no encontrada"
      });

    }

    await property.destroy();

    res.json({
      message: "Propiedad eliminada"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error eliminando propiedad"
    });

  }
});

module.exports = router;