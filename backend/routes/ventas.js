const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try { const [rows] = await db.query('SELECT * FROM ventas'); res.json(rows); } 
  catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/', async (req, res) => {
  const { id_cliente, fecha, total, estado } = req.body;
  try {
    const [result] = await db.query('INSERT INTO ventas (id_cliente, fecha, total, estado) VALUES (?, ?, ?, ?)', [id_cliente, fecha, total, estado]);
    res.json({ id: result.insertId, id_cliente, fecha, total, estado });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put('/:id', async (req, res) => {
  const { id_cliente, fecha, total, estado } = req.body;
  try {
    await db.query('UPDATE ventas SET id_cliente = ?, fecha = ?, total = ?, estado = ? WHERE id = ?', [id_cliente, fecha, total, estado, req.params.id]);
    res.json({ message: 'Venta actualizada' });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete('/:id', async (req, res) => {
  try { await db.query('DELETE FROM ventas WHERE id = ?', [req.params.id]); res.json({ message: 'Venta eliminada' }); } 
  catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;