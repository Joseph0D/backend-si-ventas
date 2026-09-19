const express = require('express');
const router = express.Router();
const db = require('../db'); // <-- Ajusta esto al nombre de tu archivo de conexión a MariaDB

// Obtener todos los usuarios (GET)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM usuarios');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un usuario (POST - El que te daba error 404)
router.post('/', async (req, res) => {
  const { nombre, email, rol } = req.body;
  try {
    const [result] = await db.query('INSERT INTO usuarios (nombre, email, rol) VALUES (?, ?, ?)', [nombre, email, rol]);
    res.json({ id: result.insertId, nombre, email, rol });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un usuario (PUT)
router.put('/:id', async (req, res) => {
  const { nombre, email, rol } = req.body;
  try {
    await db.query('UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id = ?', [nombre, email, rol, req.params.id]);
    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un usuario (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM usuarios WHERE id = ?', [req.params.id]);
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;