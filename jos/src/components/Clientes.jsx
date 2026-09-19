import { useState, useEffect } from 'react';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({ nombre: '', contacto: '', departamento: '', ciudad: '' });
  const [editId, setEditId] = useState(null);

  const API_URL = 'http://localhost:3000/clientes'; // Asegúrate de que esta ruta coincida con tu backend

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await fetch(`${API_URL}/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        setEditId(null);
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      setFormData({ nombre: '', contacto: '', departamento: '', ciudad: '' });
      fetchClientes();
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const handleEdit = (cliente) => {
    setFormData({ nombre: cliente.nombre, contacto: cliente.contacto, departamento: cliente.departamento, ciudad: cliente.ciudad });
    setEditId(cliente.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar cliente?')) {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchClientes();
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Gestión de Clientes</h2>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
        <input type="text" name="contacto" placeholder="Contacto" value={formData.contacto} onChange={handleChange} required />
        <input type="text" name="departamento" placeholder="Departamento" value={formData.departamento} onChange={handleChange} required />
        <input type="text" name="ciudad" placeholder="Ciudad" value={formData.ciudad} onChange={handleChange} required />
        <button type="submit">{editId ? 'Actualizar' : 'Agregar'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setFormData({ nombre: '', contacto: '', departamento: '', ciudad: '' }); }}>Cancelar</button>}
      </form>

      <table border="1" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th><th>Nombre</th><th>Contacto</th><th>Departamento</th><th>Ciudad</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.length > 0 ? clientes.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td><td>{c.nombre}</td><td>{c.contacto}</td><td>{c.departamento}</td><td>{c.ciudad}</td>
              <td>
                <button onClick={() => handleEdit(c)}>Editar</button>
                <button onClick={() => handleDelete(c.id)}>Eliminar</button>
              </td>
            </tr>
          )) : <tr><td colSpan="6">No hay clientes.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default Clientes;
