const Maestro = require('../models/maestros.model');
const Usuario = require('../models/usuarios.model')
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

function crearMaestro(req, res) {
    var parametros = req.body;
    var maestroModel = new Maestro();
    var usuarioModel = new Usuario();
    if (req.user.rol == 'ROL_MAESTRO') {
        if (parametros.nombre && parametros.apellido && parametros.userName && parametros.password) {
            maestroModel.nombre = parametros.nombre;
            maestroModel.apellido = parametros.apellido;

            Maestro.find({ nombre: parametros.nombre, apellido: parametros.apellido }, (err, maestroEncontrado) => {
                if (maestroEncontrado.length == 0) {

                    usuarioModel.userName = parametros.userName;
                    usuarioModel.rol = 'ROL_MAESTRO';
                    Usuario.find({ userName: usuarioModel.userName }, (err, usuarioEncontrado) => {
                        if (usuarioEncontrado.length == 0) {

                            bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {

                                usuarioModel.password = passwordEncriptada;
                                usuarioModel.save((err, usuarioGuardado) => {
                                    if (err) return res.status(500)
                                        .send({ mensaje: 'Error en la peticion' });
                                    if (!usuarioGuardado) return res.status(500)
                                        .send({ mensaje: 'Error al agregar al maestro' });
                                });
                                maestroModel.save((err, maestroGuardado) => {
                                    if (err) return res.status(500)
                                        .send({ mensaje: 'Error en la peticion' });
                                    if (!maestroGuardado) return res.status(500)
                                        .send({ mensaje: 'Error al agregar al maestro' });

                                    return res.status(200).send({ maestro: maestroGuardado });
                                });

                            });
                        } else {
                            return res.status(500)
                                .send({ mensaje: 'El userName que desea utilizar ya esta en uso' });
                        }
                    });
                } else {
                    return res.status(500)
                        .send({ mensaje: 'Este maestro ya existe' });
                }
            })
        }
    }else{
        return res.status(500).send({mensaje: 'No tiene los permisos necesarios para realizar esta accion'})
    }

}

function agregarCursos(req, res) {
    var idMaestro = req.params.idMaestro;
    var parametros = req.body;

    if (req.user.rol == 'ROL_MAESTRO') {
        Maestro.findByIdAndUpdate(idMaestro, { $push: { cursos: { nombreCurso: parametros.nombreCurso } } }, { new: true }, (err, cursoAgregado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
            if (!cursoAgregado) return res.status(404).send({ mensaje: "Error al guardar el curso" })

            return res.status(200).send({ curso: cursoAgregado })
        })
    }else{
        return res.status(500).send({ mensaje: "No tiene los permisos necesarios para realizar esta accion"})
    }

}

function editarCursos(req, res) {
    var idCurso = req.params.idCurso;
    var parametros = req.body
    if (req.user.rol == 'ROL_MAESTRO') {
        Maestro.findOneAndUpdate({ cursos: { $elemMatch: { _id: idCurso } } },
            { "cursos.$.nombreCurso": parametros.nombreCurso }, { new: true }, (err, cursoEditado) => {
                if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
                if (!cursoEditado) return res.status(404).send({ mensaje: "No tiene acceso para editar este curso" })

                return res.status(200).send({ Curso: cursoEditado })
            })
    }else{
        return res.status(500).send({ mensaje: "No tiene los permisos necesarios para realizar esta accion"})
    }

}

function eliminarCursos(req, res) {
    var idCurso = req.params.idCursos;

    if (req.user.rol == 'ROL_MAESTRO') {
        Maestro.updateMany({}, { $pull: { cursos: { _id: idCurso } } }, { multi: true }, (err, cursoEliminado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
            if (!cursoEliminado) return res.status(404).send({ mensaje: "No tiene acceso para eliminar este curso" })

            return res.status(200).send({ Curso: cursoEliminado })
        })
    }else{
        return res.status(500).send({ mensaje: "No tiene los permisos necesarios para realizar esta accion"})
    }

}

function obtenerCursos(req, res) {
    var idMaestro = req.params.maestroId
    if(req.user.rol == 'ROL_MAESTRO') {
        Maestro.find({ _id: idMaestro }, (err, cursosEncontrados) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
            if (!cursosEncontrados) return res.status(404).send({ mensaje: "Error al obtener los cursos" })
    
            return res.status(200).send({ Cursos: cursosEncontrados })
        })
    }else{
        return res.status(500).send({ mensaje: "No tiene los permisos necesarios para realizar esta accion"})
    }
    
}

module.exports = {
    crearMaestro,
    agregarCursos,
    editarCursos,
    eliminarCursos,
    obtenerCursos
}