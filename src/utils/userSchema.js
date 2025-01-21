const Joi = require('joi');

const createUserSchema = Joi.object({
    nickname: Joi.string().min(3).max(255).required(),
    age: Joi.number().integer().positive().required(),
    city: Joi.string().min(3).max(255).required()
});

const getUserFromIdSchema = Joi.object({
    id: Joi.number().integer().positive().required()
});

const updateUserSchema = Joi.object({
    nickname: Joi.string().optional(),
    age: Joi.number().integer().min(0).optional(),
    city: Joi.string().optional(),
}).or('nickname', 'age', 'city');

const deleteUserSchema = Joi.object({
    id: Joi.number().integer().positive().required()
});

module.exports = { createUserSchema, getUserFromIdSchema, updateUserSchema, deleteUserSchema };