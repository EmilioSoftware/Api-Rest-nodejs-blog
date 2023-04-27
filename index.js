const { connection } = require("./database/connection");
const express = require('express');
const cors = require('cors');

// Inicializar App
console.log("App de node Arrancada");

// Conectar a la base de datos
connection();

// Crear Servidor Node
const app = express();
const port = 3900;

// Configurar cors
app.use(cors());

// Convertir body a objeto js
app.use(express.json()); // recibir datos con content-type app/json
app.use(express.urlencoded({extended: true})); // form-urlencoded

// RUTAS
const article_routes = require('./routes/Articulo');

// Cargo las rutas
app.use("/api", article_routes);

// Rutas prueba
app.get("/", (req, res) => {
    res.send(`
        <h1>Empezando a crear un api rest con node</h1>
    `)
})


// Crear servidor y escuchar peticiones http
app.listen(port, () => {
    console.log("Servidor corriendo en el puerto " + port)
})
