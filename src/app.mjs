import conectarDB from './dbConfig.mjs';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';
import expressLayouts from 'express-ejs-layouts';
import { body, validationResult } from 'express-validator';
import Superhero from './models/Superhero.mjs';

await conectarDB();
const app = express();
const port = 3000;

const heroes = [];

// Necesario para usar __dirname con módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración del motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Rutas principales
app.get('/', (req, res) => {
  res.render('index', { title: 'Página Principal' });
});


app.get('/add-hero', async (req, res) => {
  const body = await ejs.renderFile(path.join(__dirname, 'views/addHero.ejs'), {
    title: 'Agregar Superhéroe',
    errors: [],
    old: {} 
  });
  res.render('layout', { body, title: 'Agregar Superhéroe' });
});

app.post(
  '/add-hero',
  [
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('power').notEmpty().withMessage('El poder es obligatorio')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const body = await ejs.renderFile(path.join(__dirname, 'views/addHero.ejs'), {
        title: 'Agregar Superhéroe',
        errors: errors.array(),
        old: req.body
      });
      return res.render('layout', { body, title: 'Agregar Superhéroe' });
    }

    const { name, power } = req.body;
    await Superhero.create({ name, power });
    res.redirect('/heroes');
  }
);

/*
// En la ruta de index:
app.get('/', async (req, res) => {
    const body = await ejs.renderFile(path.join(__dirname, 'views/index.ejs'));
    res.render('layout', { body, title: 'Página Principal' });
  });
*/
app.get('/heroes', async (req, res) => {
  const heroes = await Superhero.find();
  const body = await ejs.renderFile(path.join(__dirname, 'views/heroes.ejs'), {
    heroes
  });
  res.render('layout', { body, title: 'Lista de Superhéroes' });
});

app.use(expressLayouts);
app.set('layout', 'layout'); // Usa views/layout.ejs como layout base

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
