const express = require('express');
const usuarioControlador = require('../controllers/usuarios.controller');
const md_autenticacion = require('../middleware/autenticacion');

const api = express.Router();

api.post('/iniciar', usuarioControlador.CrearPrimerUser)
api.post('/login', usuarioControlador.Login);



module.exports = api;