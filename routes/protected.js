const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/profile', (req, res) => {
  const authHeader = req.headers.authorization;

  if(!authHeader){
    return res.status(401).json({ error: "Token requerido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ message: "Acceso permitido", user: decoded });
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
});

module.exports = router;