const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.destinationSchema = Joi.object({
   destination: Joi.object({
      title: Joi.string().required().escapeHTML(),
      location: Joi.string().required().escapeHTML(),
      experience: Joi.string().max(500).allow('',null).escapeHTML(),
   }).required(),
//    images: Joi.string() ,
});



module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        textarea:Joi.string().max(500).allow('').required().escapeHTML(),
    }).required(),
})


module.exports.registerSchema = Joi.object({
    register: Joi.object({
        username: Joi.string().lowercase().min(3).max(30).required().escapeHTML(),
        email:Joi.string().email({ minDomainSegments: 2, tlds: { allow:true} }).required().escapeHTML(),
        password:Joi.string().min(4).required(),
    }).required(),
})



module.exports.loginSchema = Joi.object({
    login: Joi.object({
        username_email:Joi.alternatives().try(
            Joi.string()
               .lowercase()
               .email({
                   minDomainSegments: 2,
                   tlds: {
                      allow: ["com", "net", "in", "co"],
                   },
               }),
            Joi.string().lowercase().min(3).max(30)
          ).required(),
          
        password:Joi.string().required(),
    }).required(),
})


module.exports.editValidation = Joi.object({
    title: Joi.string().required().escapeHTML(),
    location: Joi.string().required().escapeHTML(),
    deleteImgs: Joi.array().items(Joi.string())
})

