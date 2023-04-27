const fs = require('fs');
const path = require('path');
const { validateArticle } = require('../helpers/validate');
const Article = require('../models/Article');


const test = (req, res) => {
    return res.status(200).json({
        message: "Soy una acción de prueba en mi controlador de articulos"
    });
}

const curso = (req, res) => {
    return res.status(200).json([
        {
            curso: "Master en React",
            autor: "Victor Robles WEB",
            url: "victorroblesweb.es/master-react"
        },
        {
            curso: "Master en React",
            autor: "Victor Robles WEB",
            url: "victorroblesweb.es/master-react"
        }
    ])
}

const createArticle = (req, res) => {

    // Recoger los parametros por post a guadar
    let parameters = req.body;

    // Validar datos
    try {
        validateArticle(parameters)
    } catch (error) {
        return res.status(400).json({
            status: "Error",
            message: "Faltan datos por enviar",
        })
    }

    // Crear el objeto a guardar
    const article = new Article(parameters) // forma Automatica

    //Asignar valores a objeto basado en el modelo (manual o automatico)
    // ( Forma Manual ) - article.title = parameters.title;

    // Guardar el articulo en la base de datos
    article.save()
        .then((savedArticle) => {
            return res.status(200).json({
                status: "success",
                article: savedArticle,
                message: "Articulo creado con exito!!",
            });
        }
        )
        .catch(function (err) {
            if (err) {
                return res.status(400).json({
                    status: "Error",
                    message: "No se ha guardado el articulo",
                });
            }
        })
}

const getArticles = (req, res) => {
    let consulta = Article.find({})

    if (req.params.ultimos) {
        consulta.limit(3)
    }

    consulta.sort({ date: -1 })
        .then((articles) => {
            if (!articles) {
                return res.status(404).json({
                    status: "Error",
                    message: "No se han encontrado articulos!!",
                });
            }
            return res.status(200).json({
                status: "Success",
                parametro: req.params.ultimos,
                contador: articles.length,
                articles,
            });
        })
}

const getArticleById = (req, res) => {
    // Recoger un id por la url
    let id = req.params.id;

    // Buscar el articulo
    Article.findById(id).then((article) => {
        // Si no existe devolver un error
        if (!article) {
            return res.status(404).json({
                status: "Error",
                message: "No se han encontrado el articulo!!",
            });
        }

        // Devolver resultado
        return res.status(200).json({
            status: "Success",
            article,
        });
    })



}

const deleteArticleById = (req, res) => {
    // Recoger el id de la url
    let articleid = req.params.id;

    // Buscar y eliminar el articulo
    Article.findOneAndDelete({ _id: articleid }).then((articleDeleted) => {
        if (!articleDeleted) {
            return res.status(404).json({
                status: "Error",
                message: "No se han encontrado el articulo!!",
            });
        }
        return res.status(200).json({
            status: "Success",
            articleDeleted,
        });
    });

}

const updateArticle = (req, res) => {
    // Recoger id del articulo a editar
    let articleId = req.params.id;

    // Recoger datos del body
    let body = req.body;

    // Validar datos
    try {
        validateArticle(body)
    } catch (error) {
        return res.status(400).json({
            status: "Error",
            message: "Faltan datos por enviar",
        })
    }

    // Buscar y actualizar articulo
    Article.findOneAndUpdate({ _id: articleId }, body, { new: true }).then((articleUpdated) => {
        if (!articleUpdated) {
            return res.status(500).json({
                status: "Error",
                message: "No se ha encontrado el articulo!!",
            });
        }
        return res.status(200).json({
            status: "Success",
            articleUpdated,
        });
    })

    // Devolver respuesta
}

const uploadImage = (req, res) => {

    // Configurar multer (En el archivo de las rutas)

    // Recoger el fichero de imagen subido
    if (!req.file && !req.files) {
        return res.status(400).json({
            status: "Error",
            file: req.file,
            message: "No has mandado ningun archivo"
        })
    }

    // Nombre del archivo
    let filename = req.file.originalname

    // Extension del archivo
    let extension = filename.split("\.")[1]

    // Comprobar extension
    if (extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif") {

        // Borrar archivo y dar respuesta
        fs.unlink(req.file.path, (error) => {
            return res.status(400).json({
                status: "Error",
                message: "Archivo invalido"
            })
        })
    } else {
        // Recoger id del articulo a editar
        let articleId = req.params.id;

        // Buscar y actualizar articulo
        Article.findOneAndUpdate({ _id: articleId }, { image: req.file.filename }, { new: true }).then((articleUpdated) => {
            if (!articleUpdated) {
                return res.status(500).json({
                    status: "Error",
                    message: "Error al actualizar!!",
                });
            }
            return res.status(200).json({
                status: "Success",
                articleUpdated,
                fichero: req.file
            });
        });

    }

}

const image = (req, res) => {
    let file = req.params.file;
    let filepath = "./images/articles/"+file

    fs.stat(filepath, (error, exist) => {
        if(exist){
            return res.sendFile(path.resolve(filepath));
        }
        return res.status(404).json({
            status: "Error",
            message: "La imagen no existe!!",
        });
    })
}

const search = (req, res) => {
    // Sacar el String de búsqueda
    let busqueda = req.params.searchString;

    // Find con OR
    Article.find({ "$or": [
        { title: {"$regex": busqueda, "$options": "i"}},
        { content: {"$regex": busqueda, "$options": "i"}}
    ]})
    .sort({date: -1}).then((articlesFound) => {
        if(!articlesFound || articlesFound.length == 0){
            return res.status(404).json({
                status: "Error",
                message: "No se encontraron resultados"
            })
        }
        return res.status(200).json({
            status: "Success",
            articlesFound
        })
    })

    // Orden

    // Ejecutar consulta

    // Devolver resultado
}

module.exports = {
    test,
    curso,
    createArticle,
    getArticles,
    getArticleById,
    deleteArticleById,
    updateArticle,
    uploadImage,
    image,
    search
}