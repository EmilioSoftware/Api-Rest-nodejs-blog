const validator = require('validator')

const validateArticle = (data) => {

    let validate_title = !validator.isEmpty(data.title) &&
        validator.isLength(data.title, { min: 5, max: undefined });
    let validate_content = !validator.isEmpty(data.content);

    if (!validate_title || !validate_content) {
        throw new Error("No se ha validado la información!!")
    }
}

module.exports = {
    validateArticle
}