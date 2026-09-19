import { useState, useEffect } from 'react';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({ nombre_producto: '', cantidad: '', precio: '' });
  const [editId, setEditId] = useState(null);
  const API_URL = 'http://localhost:3000/productos';

  useEffect(() => { fetchProductos(); }, []);
  const fetchProductos = async () => {
    const response = await fetch(API_URL);
    setProductos(await response.json());
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API_URL}/${editId}` : API_URL;
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    setEditId(null); setFormData({ nombre_producto: '', cantidad: '', precio: '' }); fetchProductos();
  };

  const handleEdit = (p) => { setFormData({ nombre_producto: p.nombre_producto, cantidad: p.cantidad, precio: p.precio }); setEditId(p.id); };
  const handleDelete = async (id) => { if (window.confirm('¿Eliminar producto?')) { await fetch(`${API_URL}/${id}`, { method: 'DELETE' }); fetchProductos(); } };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Gestión de Productos</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input type="text" name="nombre_producto" placeholder="Nombre" value={formData.nombre_producto} onChange={handleChange} required />
        <input type="number" name="cantidad" placeholder="Cantidad" value={formData.cantidad} onChange={handleChange} required />
        <input type="number" step="0.01" name="precio" placeholder="Precio" value={formData.precio} onChange={handleChange} required />
        <button type="submit">{editId ? 'Actualizar' : 'Agregar'}</button>
      </form>
      <table border="1" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead><tr><th>ID</th><th>Nombre</th><th>Cantidad</th><th>Precio</th><th>Acciones</th></tr></thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id}><td>{p.id}</td><td>{p.nombre_producto}</td><td>{p.cantidad}</td><td>${p.precio}</td>
            <td><button onClick={() => handleEdit(p)}>Editar</button> <button onClick={() => handleDelete(p.id)}>Eliminar</button></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Productos;