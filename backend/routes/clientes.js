const express = require('express');
const router = express.Router();
const db = require('../db'); // Tu conexión a MariaDB

// Obtener clientes (GET)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM clientes');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear cliente (POST)
router.post('/', async (req, res) => {
  const { nombre, contacto, departamento, ciudad } = req.body;
  try {
    const [result] = await db.query('INSERT INTO clientes (nombre, contacto, departamento, ciudad) VALUES (?, ?, ?, ?)', [nombre, contacto, departamento, ciudad]);
    res.json({ id: result.insertId, nombre, contacto, departamento, ciudad });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar cliente (PUT)
router.put('/:id', async (req, res) => {
  const { nombre, contacto, departamento, ciudad } = req.body;
  try {
    await db.query('UPDATE clientes SET nombre = ?, contacto = ?, departamento = ?, ciudad = ? WHERE id = ?', [nombre, contacto, departamento, ciudad, req.params.id]);
    res.json({ message: 'Cliente actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar cliente (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM clientes WHERE id = ?', [req.params.id]);
    res.json({ message: 'Cliente eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;