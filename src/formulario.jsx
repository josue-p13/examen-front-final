import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const Formulario = () => {
  const [articulos, setArticulos] = useState([]);
  const [nombreArticulo, setNombreArticulo] = useState('');
  const [turno1, setTurno1] = useState(0);
  const [turno2, setTurno2] = useState(0);
  const [turno3, setTurno3] = useState(0);
  const [articuloMayor, setArticuloMayor] = useState(null); 

  useEffect(() => {
    axios.get('http://localhost:3000/api/produccion/listar')
      .then((response) => {
        setArticulos(response.data);
        calcularArticuloMayor(response.data);  
      })
      .catch((error) => {
        console.error('Error al obtener los artículos:', error);
      });
  }, []);   

  const calcularArticuloMayor = (articulos) => {
    if (articulos.length === 0) return;
    let mayorProduccion = 0;
    let articuloConMayorProduccion = null;

    articulos.forEach((articulo) => {
      if (articulo.produccionTotal > mayorProduccion) {
        mayorProduccion = articulo.produccionTotal;
        articuloConMayorProduccion = articulo;
      }
    });

    setArticuloMayor(articuloConMayorProduccion);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const produccionTotal = parseInt(turno1) + parseInt(turno2) + parseInt(turno3);
    const articulo = { nombreArticulo, turno1, turno2, turno3, produccionTotal };

    axios.post('http://localhost:3000/api/produccion/guardar', articulo)
      .then((response) => {
        console.log(response.data);
        const nuevosArticulos = [...articulos, articulo];
        setArticulos(nuevosArticulos);
        calcularArticuloMayor(nuevosArticulos);
        setNombreArticulo('');
        setTurno1(0);
        setTurno2(0);
        setTurno3(0);
      })
      .catch((error) => {
        console.error('Error al guardar los datos:', error);
      });
  };

  return (
    <div>
      <h1>Reporte diario de producción</h1>
      <form onSubmit={handleSubmit}>
        <label>Artículo: </label>
        <input
          type="text"
          placeholder="Nombre del Artículo"
          value={nombreArticulo}
          onChange={(e) => setNombreArticulo(e.target.value)}
          required
        />
        <label>Turno 1: </label>
        <input
          type="number"
          placeholder="Producción del Turno 1"
          value={turno1}
          onChange={(e) => setTurno1(e.target.value)}
          required
        />
        <label>Turno 2: </label>
        <input
          type="number"
          placeholder="Producción del Turno 2"
          value={turno2}
          onChange={(e) => setTurno2(e.target.value)}
          required
        />
        <label>Turno 3: </label>
        <input
          type="number"
          placeholder="Producción del Turno 3"
          value={turno3}
          onChange={(e) => setTurno3(e.target.value)}
          required
        />
        <button type="submit">Agregar Artículo</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Artículo</th>
            <th>Turno 1</th>
            <th>Turno 2</th>
            <th>Turno 3</th>
            <th>Tot.Prod.</th>
          </tr>
        </thead>
        <tbody>
          {articulos.map((articulo, index) => (
            <tr key={index}>
              <td>{articulo.nombreArticulo}</td>
              <td>{articulo.turno1}</td>
              <td>{articulo.turno2}</td>
              <td>{articulo.turno3}</td>
              <td>{articulo.produccionTotal}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {articuloMayor && (
        <div>
          <h2>Estadisticabb</h2>
          <p><strong>Articulo con mayor produccion:</strong> {articuloMayor.nombreArticulo}</p>
          <p><strong>Producción del articulo mayor:</strong> {articuloMayor.produccionTotal}</p>
        </div>
      )}
    </div>
  );
};

export default Formulario;
