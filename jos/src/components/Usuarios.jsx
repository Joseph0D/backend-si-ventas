import { useState, useEffect } from 'react';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({ nombre: '', email: '', rol: 'usuario' });
  const [editId, setEditId] = useState(null);

  // URL de tu backend (ajusta el puerto si tu backend no usa el 3000)
  const API_URL = 'http://localhost:3000/users';

  // Leer: Obtener los usuarios al cargar la página
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Crear o Actualizar
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Actualizar (PUT)
        await fetch(`${API_URL}/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        setEditId(null);
      } else {
        // Crear (POST)
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      setFormData({ nombre: '', email: '', rol: 'usuario' }); // Limpiar formulario
      fetchUsuarios(); // Recargar la lista
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
    }
  };

  // Preparar formulario para Editar
  const handleEdit = (usuario) => {
    setFormData({ nombre: usuario.nombre, email: usuario.email, rol: usuario.rol });
    setEditId(usuario.id);
  };

  // Eliminar
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
        });
        fetchUsuarios(); // Recargar la lista después de borrar
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Gestión de Usuarios</h2>
      
      {/* Formulario para Crear / Editar */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          name="nombre" 
          placeholder="Nombre" 
          value={formData.nombre} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="email" 
          name="email" 
          placeholder="Correo Electrónico" 
          value={formData.email} 
          onChange={handleChange} 
          required 
        />
        <select name="rol" value={formData.rol} onChange={handleChange}>
          <option value="usuario">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
        <button type="submit">
          {editId ? 'Actualizar Usuario' : 'Agregar Usuario'}
        </button>
        {editId && (
          <button type="button" onClick={() => { setEditId(null); setFormData({ nombre: '', email: '', rol: 'usuario' }); }}>
            Cancelar
          </button>
        )}
      </form>

      {/* Tabla para Leer y Eliminar */}
      <table border="1" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '8px' }}>ID</th>
            <th style={{ padding: '8px' }}>Nombre</th>
            <th style={{ padding: '8px' }}>Email</th>
            <th style={{ padding: '8px' }}>Rol</th>
            <th style={{ padding: '8px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length > 0 ? (
            usuarios.map((user) => (
              <tr key={user.id}>
                <td style={{ padding: '8px' }}>{user.id}</td>
                <td style={{ padding: '8px' }}>{user.nombre}</td>
                <td style={{ padding: '8px' }}>{user.email}</td>
                <td style={{ padding: '8px' }}>{user.rol}</td>
                <td style={{ padding: '8px' }}>
                  <button onClick={() => handleEdit(user)} style={{ marginRight: '5px' }}>Editar</button>
                  <button onClick={() => handleDelete(user.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ padding: '8px', textAlign: 'center' }}>No hay usuarios registrados.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Usuarios;