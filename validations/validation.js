const joi = require('joi')

const registerValidation = (data) => {
    const schemaValidation = joi.object({
        username:joi.string().required().min(3).max(256),
        email:joi.string().required().min(6).max(256).email(),
        password:joi.string().required().min(6).max(1024)        
    })
    return schemaValidation.validate(data)
}

const loginValidation = (data) => {
    const schemaValidation = joi.object({
        email:joi.string().required().min(6).max(256).email(),
        password:joi.string().required().min(6).max(1024)        
    })
    return schemaValidation.validate(data)
}

const filmValidation = (data) => {
    const schemaValidation = joi.object({
        film_name:joi.string().required().min(6).max(256),
        film_type:joi.string().required().min(6).max(256),
        film_year:joi.string().required().min(4).max(41),
        film_link:joi.string().required().min(6).max(256),
    })
    return schemaValidation.validate(data)
}


const postValidation = (data) => {
    const schemaValidation = joi.object({
        post_title:joi.string().required().min(6).max(256),
        post_owner:joi.string().required().min(6).max(256),
        post_description:joi.string().required().min(6).max(256),
        // post_timestamp:joi.string().isoDate().required()
    })
    return schemaValidation.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.filmValidation = filmValidation
module.exports.postValidation = postValidation