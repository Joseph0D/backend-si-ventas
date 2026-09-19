import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Clientes from './components/Clientes';
import Productos from './components/Productos';
import Ventas from './components/Ventas';
import Usuarios from './components/Usuarios'; // <-- Importamos el nuevo componente

function App() {
  return (
    <BrowserRouter>
      <Menu />
      <div className="container mt-4">
        <Routes>
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/usuarios" element={<Usuarios />} /> 
          <Route path="/" element={<h2>Bienvenido al Sistema de Ventas</h2>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;