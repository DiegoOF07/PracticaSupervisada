const Usuario = require('../models/usuarios.model')
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

function CrearPrimerUser(req, res) {
    var usuarioModel = new Usuario();
    Usuario.find({ userName: 'MAESTRO' }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (usuarioEncontrado.length == 0) {
            usuarioModel.userName = 'MAESTRO'
            usuarioModel.rol = 'ROL_MAESTRO'
            usuarioModel.password = bcrypt.hash('123456', null, null, (err, passwordEncriptada) => {
                usuarioModel.password = passwordEncriptada;
                usuarioModel.save((err, usuarioGuardado) => {
                    if (err) return res.status(500)
                        .send({ mensaje: 'Error en la peticion' });
                    if (!usuarioGuardado) return res.status(500)
                        .send({ mensaje: 'Error al agregar el Usuario' });
    
                    return res.status(200).send({ usuario: usuarioGuardado });
                });
            });
        }else{
            return res.status(500).send({mensaje: "el usuario maestro ya existe"})
        }
    })
    
}

function Login(req, res) {
    var parametros = req.body;
    Usuario.findOne({ userName: parametros.userName }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (usuarioEncontrado) {
            bcrypt.compare(parametros.password, usuarioEncontrado.password,
                (err, verificacionPassword) => {//TRUE OR FALSE
                    if (verificacionPassword) {
                        // SI EL PARAMETRO OBTENERTOKEN ES TRUE, CREA EL TOKEN
                        if (parametros.obtenerToken === 'true') {
                            return res.status(200)
                                .send({ token: jwt.crearToken(usuarioEncontrado) })
                        } else {
                            usuarioEncontrado.password = undefined;
                            return res.status(200)
                                .send({ usuario: "No se ha podido iniciar sesion" })
                        }
                    } else {
                        return res.status(500)
                            .send({ mensaje: 'Las contrasena no coincide' });
                    }
                })

        } else {
            return res.status(500)
                .send({ mensaje: 'Error, el usuario no se encuentra registrado.' })
        }
    })
}


module.exports = {
    CrearPrimerUser,
    Login
}