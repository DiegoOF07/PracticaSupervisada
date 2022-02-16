const express = require('express');
const alumnoControlador = require('../controllers/alumnos.controller');
const md_autenticacion = require('../middleware/autenticacion');

const api = express.Router();

api.post('/registrarAlumnos', alumnoControlador.crearAlumno);
api.put('/agregarCursosAlumnos/:idAlumno', md_autenticacion.Auth, alumnoControlador.agregarCursos);
api.put('/editarPerfilAlumnos/:alumnoId', md_autenticacion.Auth, alumnoControlador.editarPerfil);
api.delete('/eliminarPerfilAlumnos/:alumnosId', md_autenticacion.Auth, alumnoControlador.eliminarPerfil);
api.get('/obtenerCursosAlumno/:idAlumnos',md_autenticacion.Auth, alumnoControlador.obtenerCursos);


module.exports = api;