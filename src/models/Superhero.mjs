import mongoose from 'mongoose';

/* 
const superheroSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  power: {
    type: String,
    required: true
  }
});
 */
const superheroSchema = new mongoose.Schema({
  nombreSuperHeroe: { type: String, required: true },
  nombreReal: { type: String, required: true },
  edad: { type: Number, required: true },
  planetaOrigen: { type: String, required: true },
  debilidad: { type: String, required: true },
  poderes: [{ type: String }],   // array
  aliados: [{ type: String }],   // array
  enemigos: [{ type: String }]   // array
});

const superhero = mongoose.model('Node-js', superheroSchema, 'Grupo-10');

export default superhero;
