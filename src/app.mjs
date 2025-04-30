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

/* // Rutas principales
app.get('/', (req, res) => {
  res.render('index', { title: 'Página Principal' });
}); */

app.get('/', async (req, res) => {
  const body = await ejs.renderFile(path.join(__dirname, 'views/index.ejs'));
  res.render('layout', { body, title: 'Inicio' });
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
    body('nombreSuperHeroe').notEmpty().withMessage('El nombre del superhéroe es obligatorio'),
    body('nombreReal').notEmpty().withMessage('El nombre real es obligatorio'),
    body('edad')
      .notEmpty().withMessage('La edad es obligatoria')
      .isNumeric().withMessage('La edad debe ser un número'),
    body('planetaOrigen').notEmpty().withMessage('El planeta de origen es obligatorio'),
    body('debilidad').notEmpty().withMessage('La debilidad es obligatoria'),
    body('poderes').notEmpty().withMessage('Debe ingresar al menos un poder'),
    body('aliados').notEmpty().withMessage('Debe ingresar al menos un aliado'),
    body('enemigos').notEmpty().withMessage('Debe ingresar al menos un enemigo')
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

    const {
      nombreSuperHeroe,
      nombreReal,
      edad,
      planetaOrigen,
      debilidad,
      poderes,
      aliados,
      enemigos
    } = req.body;

    await Superhero.create({
      nombreSuperHeroe,
      nombreReal,
      edad,
      planetaOrigen,
      debilidad,
      poderes: poderes.split(',').map(p => p.trim()),
      aliados: aliados.split(',').map(a => a.trim()),
      enemigos: enemigos.split(',').map(e => e.trim())
    });

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

app.get('/about', async (req, res) => {
  const body = await ejs.renderFile(path.join(__dirname, 'views/about.ejs'));
  res.render('layout', { body, title: 'Acerca de' });
});

app.get('/contact', async (req, res) => {
  const body = await ejs.renderFile(path.join(__dirname, 'views/contact.ejs'));
  res.render('layout', { body, title: 'Contacto' });
});


app.use(expressLayouts);
app.set('layout', 'layout'); // Usa views/layout.ejs como layout base

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor se levanto en el puerto http://localhost:${port}`);
});
