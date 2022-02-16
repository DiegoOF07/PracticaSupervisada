const mongoose = require('mongoose');
const app = require('./app');

mongoose.Promise = global.Promise;  

//Base de datos pendiente
mongoose.connect('mongodb://localhost:27017/ControldeEmpresas', { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("Conexion a la base de datos exitosa.");

    app.listen(3000, function () {
        console.log("Corriendo en el puerto 3000")
    })

}).catch(error => console.log(error));