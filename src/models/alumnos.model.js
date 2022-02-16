const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const AlumnoSchema=Schema({
    nombre: String,
    apellido: String,
    cursos: [{
        nombreCurso: String, //max 3
        idMaestroCurso:{type: Schema.Types.ObjectId, ref: 'Maestros'}
    }]
})

module.exports=mongoose.model('Alumnos', AlumnoSchema);