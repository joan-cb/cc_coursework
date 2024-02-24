const joi = require('joi')

const register_validation = (data) => {
    const schema_validation = joi.object({
        user_name:joi.string().required().min(3).max(256),
        email:joi.string().required().min(6).max(256).email(),
        password:joi.string().required().min(6).max(1024) })
    return schema_validation.validate(data)
}

const login_validation = (data) => {
    const schema_validation = joi.object({
        email:joi.string().required().min(6).max(256).email(),
        password:joi.string().required().min(6).max(1024)        
    })
    return schema_validation.validate(data)
}

const post_validation = (data) => {
    const schema_validation = joi.object({
        post_title:joi.string().required().min(6).max(256),
        post_owner:joi.string().required().min(6).max(256),
        post_description:joi.string().required().min(6).max(256),
        // post_timestamp:joi.string().isoDate().required()
    })
    return schema_validation.validate(data)
}

module.exports.register_validation = register_validation;
module.exports.login_validation = login_validation;
module.exports.post_validation = post_validation;