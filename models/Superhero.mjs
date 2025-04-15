import mongoose from 'mongoose';

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

const superhero = mongoose.model('Node-js', superheroSchema, 'Grupo-10');

export default superhero;
