const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try { const [rows] = await db.query('SELECT * FROM productos'); res.json(rows); } 
  catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/', async (req, res) => {
  const { nombre_producto, cantidad, precio } = req.body;
  try {
    const [result] = await db.query('INSERT INTO productos (nombre_producto, cantidad, precio) VALUES (?, ?, ?)', [nombre_producto, cantidad, precio]);
    res.json({ id: result.insertId, nombre_producto, cantidad, precio });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put('/:id', async (req, res) => {
  const { nombre_producto, cantidad, precio } = req.body;
  try {
    await db.query('UPDATE productos SET nombre_producto = ?, cantidad = ?, precio = ? WHERE id = ?', [nombre_producto, cantidad, precio, req.params.id]);
    res.json({ message: 'Producto actualizado' });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete('/:id', async (req, res) => {
  try { await db.query('DELETE FROM productos WHERE id = ?', [req.params.id]); res.json({ message: 'Producto eliminado' }); } 
  catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;