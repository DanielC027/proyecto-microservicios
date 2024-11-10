const express = require('express');
const { Pool } = require('pg'); // Importar Pool de pg para gestionar conexiones
const cors = require('cors');

const app = express();
app.use(cors({
  origin: '*',
}));
app.use(express.json());

// Conexión a PostgreSQL
const pool = new Pool({
  user: 'postgres',         // Usuario de PostgreSQL
  host: 'postgres',         // Nombre del servicio de PostgreSQL
  database: 'todos',        // Nombre de la base de datos
  password: 'password',     // Contraseña de la base de datos
  port: 5432,               // Puerto por defecto de PostgreSQL
});

// Crear un nuevo "todo"
app.post('/todos', async (req, res) => {
  const { text } = req.body;
  try {
    const result = await pool.query('INSERT INTO todos (text) VALUES ($1) RETURNING *', [text]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar el todo' });
  }
});

// Obtener todos los "todos"
app.get('/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los datos' });
  }
});

// Iniciar el servidor
app.listen(3000, () => console.log('Backend escuchando en el puerto 3000'));

