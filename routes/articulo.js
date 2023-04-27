const express = require("express")
const multer = require('multer');

const router = express.Router();

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images/articles/')
    },
    filename: (req, file, cb) => {
        cb(null, "article" + Date.now() + file.originalname)
    }
})

const uploads = multer({storage: imageStorage})

const ArticleController = require("../controllers/Article")

// Rutas de pruebas
router.get("/test-route", ArticleController.test);
router.get('/curso', ArticleController.curso);

router.post('/crear', ArticleController.createArticle);
router.get('/articulos/:ultimos?', ArticleController.getArticles)
router.get('/articulo/:id', ArticleController.getArticleById)
router.delete('/articulo/:id', ArticleController.deleteArticleById)
router.put('/articulo/:id', ArticleController.updateArticle)

router.post('/subir-imagen/:id', [uploads.single("file")], ArticleController.uploadImage)
router.get('/imagen/:file', ArticleController.image);
router.get('/buscar/:searchString', ArticleController.search);

module.exports = router;
