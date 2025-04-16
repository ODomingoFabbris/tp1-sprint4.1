import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://Grupo-10:grupo10@cursadanodejs.ls9ii.mongodb.net/Node-js');
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.error('Error de conexión a MongoDB', error);
        process.exit(1);  // Detener el proceso si no se puede conectar
    }
};

export default connectDB;