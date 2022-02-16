const Alumno = require('../models/alumnos.model')
const Usuario = require('../models/usuarios.model')
const bcrypt = require('bcrypt-nodejs');

function crearAlumno(req, res) {
    var parametros = req.body;
    var alumnoModel = new Alumno();
    var usuarioModel = new Usuario();

    if (parametros.nombre && parametros.apellido && parametros.userName && parametros.password) {
        alumnoModel.nombre = parametros.nombre;
        alumnoModel.apellido = parametros.apellido;

        Alumno.find({ nombre: parametros.nombre, apellido: parametros.apellido }, (err, alumnoEncontrado) => {
            if (alumnoEncontrado.length == 0) {

                usuarioModel.userName = parametros.userName;
                usuarioModel.rol = 'ROL_ALUMNNO';
                Usuario.find({ userName: usuarioModel.userName }, (err, usuarioEncontrado) => {
                    if (usuarioEncontrado.length == 0) {

                        bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {

                            usuarioModel.password = passwordEncriptada;
                            usuarioModel.save((err, usuarioGuardado) => {
                                if (err) return res.status(500)
                                    .send({ mensaje: 'Error en la peticion' });
                                if (!usuarioGuardado) return res.status(500)
                                    .send({ mensaje: 'Error al agregar al alumno' });

                            });
                            alumnoModel.save((err, alumnoGuardado) => {
                                if (err) return res.status(500)
                                    .send({ mensaje: 'Error en la peticion' });
                                if (!alumnoGuardado) return res.status(500)
                                    .send({ mensaje: 'Error al agregar al alumno' });

                                return res.status(200).send({ alumno: alumnoGuardado });
                            });
                        });
                    } else {
                        return res.status(500)
                            .send({ mensaje: 'El userName que desea utilizar ya esta en uso' });
                    }
                });
            } else {
                return res.status(500)
                    .send({ mensaje: 'Este alumno ya existe' });
            }
        })
    }
}

function agregarCursos(req, res) {
    var idAlumno = req.params.idAlumno;
    var parametros = req.body;

    Alumno.find({ cursos: { $size: 3 } }, { _id: idAlumno }, (err, alumnoEncontrado) => {

        if (alumnoEncontrado.length == 0) {

            Alumno.findOne({ cursos: { $elemMatch: { nombreCurso: parametros.nombreCurso } }, _id: idAlumno }, (err, cursoRepetido) => {

                if (!cursoRepetido) {

                    Alumno.findByIdAndUpdate(idAlumno, { $push: { cursos: { nombreCurso: parametros.nombreCurso, idMaestroCurso: req.user.sub } } }, { new: true }, (err, cursoAgregado) => {
                        if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
                        if (!cursoAgregado) return res.status(404).send({ mensaje: "Error al asignar el curso" })

                        return res.status(200).send({ curso: cursoAgregado })
                    })
                } else {
                    return res.status(500).send({ mensaje: "El alumno no puede asignarse dos veces a un mismo curso" })
                }
            })
        } else {
            return res.status(500).send({ mensaje: "El alumno no puede poseer mas de 3 cursos al mismo tiempo" })
        }
    })
}

function obtenerCursos(req, res) {
    var idAlumno = req.params.idAlumnos;
    Alumno.find({ _id: idAlumno }, (err, cursosEncontrados) => {
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
        if (!cursosEncontrados) return res.status(404).send({ mensaje: "Error al obtener los cursos" })

        return res.status(200).send({ Cursos: cursosEncontrados })
    })
}

function editarPerfil(req, res) {
    var idAlumno = req.params.alumnoId;
    var parametros = req.body

    Alumno.findByIdAndUpdate(idAlumno, parametros, { new: true },
        (err, usuarioActualizado) => {
            if (err) return res.status(500)
                .send({ mensaje: 'Error en la peticion' });
            if (!usuarioActualizado) return res.status(500)
                .send({ mensaje: 'Error al editar el Usuario' });
        })
    Alumno.findOneAndUpdate({ cursos: { $elemMatch: { _id: parametros.idCurso } } },
        { "cursos.$.nombreCurso": parametros.nombreCurso }, { new: true }, (err, cursoEditado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
            if (!cursoEditado) return res.status(404).send({ mensaje: "No tiene acceso para editar este curso" })

            return res.status(200).send({ Curso: cursoEditado })
        })

}

function eliminarPerfil(req, res) {
    var idAlumno = req.params.alumnosId;

    Alumno.findByIdAndDelete(idAlumno, (err, alumnoEliminado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!alumnoEliminado) return res.status(404).send({ mensaje: 'Error al eliminar el Perfil' });

        return res.status(200).send({ Alumno: alumnoEliminado });
    })
}


module.exports = {
    crearAlumno,
    agregarCursos,
    obtenerCursos,
    editarPerfil,
    eliminarPerfil
}