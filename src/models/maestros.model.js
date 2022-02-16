const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const MaestroSchema=Schema({
    nombre: String,
    apellido: String,
    cursos: [{
        nombreCurso: String,
    }]
})

module.exports=mongoose.model('Maestros', MaestroSchema);