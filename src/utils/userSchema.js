const Joi = require('joi');

const createUserSchema = Joi.object({
    nickname: Joi.string().min(3).max(255).required(),
    age: Joi.number().integer().positive().required(),
    city: Joi.string().min(3).max(255).required()
});

module.exports = { createUserSchema };