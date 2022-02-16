const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuarioSchema = Schema({
    userName: String,
    password: String,
    rol: String
});

module.exports = mongoose.model('Usuarios', UsuarioSchema);