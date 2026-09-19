import { useState, useEffect } from 'react';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [formData, setFormData] = useState({ id_cliente: '', fecha: '', total: '', estado: 'Completada' });
  const [editId, setEditId] = useState(null);
  const API_URL = 'http://localhost:3000/ventas';

  useEffect(() => { fetchVentas(); }, []);
  const fetchVentas = async () => {
    const response = await fetch(API_URL);
    setVentas(await response.json());
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API_URL}/${editId}` : API_URL;
    
    // Formatear la fecha a YYYY-MM-DD para MariaDB antes de enviar
    const dataToSend = { ...formData, fecha: new Date(formData.fecha).toISOString().split('T')[0] };

    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dataToSend) });
    setEditId(null); setFormData({ id_cliente: '', fecha: '', total: '', estado: 'Completada' }); fetchVentas();
  };

  const handleEdit = (v) => { 
    // Extraer solo la parte YYYY-MM-DD para el input type="date"
    const fechaFormat = v.fecha ? v.fecha.split('T')[0] : '';
    setFormData({ id_cliente: v.id_cliente, fecha: fechaFormat, total: v.total, estado: v.estado }); 
    setEditId(v.id); 
  };
  const handleDelete = async (id) => { if (window.confirm('¿Eliminar venta?')) { await fetch(`${API_URL}/${id}`, { method: 'DELETE' }); fetchVentas(); } };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Gestión de Ventas</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input type="number" name="id_cliente" placeholder="ID Cliente" value={formData.id_cliente} onChange={handleChange} required />
        <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required />
        <input type="number" step="0.01" name="total" placeholder="Total $" value={formData.total} onChange={handleChange} required />
        <select name="estado" value={formData.estado} onChange={handleChange}>
          <option value="Completada">Completada</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Cancelada">Cancelada</option>
        </select>
        <button type="submit">{editId ? 'Actualizar' : 'Agregar'}</button>
      </form>
      <table border="1" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead><tr><th>ID Venta</th><th>ID Cliente</th><th>Fecha</th><th>Total</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody>
          {ventas.map(v => (
            <tr key={v.id}><td>{v.id}</td><td>{v.id_cliente}</td><td>{v.fecha ? v.fecha.split('T')[0] : ''}</td><td>${v.total}</td><td>{v.estado}</td>
            <td><button onClick={() => handleEdit(v)}>Editar</button> <button onClick={() => handleDelete(v.id)}>Eliminar</button></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Ventas;