const express = require('express');
const maestroControlador = require('../controllers/maestros.controller');
const md_autenticacion = require('../middleware/autenticacion');

const api = express.Router();

api.post('/registrarMaestros', md_autenticacion.Auth, maestroControlador.crearMaestro);
api.put('/agregarCursos/:idMaestro', md_autenticacion.Auth, maestroControlador.agregarCursos);
api.put('/editarCursos/:idCurso', md_autenticacion.Auth, maestroControlador.editarCursos);
api.delete('/eliminarCursos/:idCursos', md_autenticacion.Auth, maestroControlador.eliminarCursos);
api.get('/obtenerCursos/:maestroId',md_autenticacion.Auth, maestroControlador.obtenerCursos)


module.exports = api;