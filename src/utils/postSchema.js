const Joi = require('joi');

// Schema per la creazione di un post
const createPostSchema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    nickname: Joi.string().optional(),
    userid: Joi.number().integer().positive().optional(),
});

const allPostSchema = Joi.object({
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
    city: Joi.string().optional(),
});

// Schema per la ricerca di un post
const searchPostSchema = Joi.object({
    title: Joi.string().min(3).max(255).optional(),
    userId: Joi.number().integer().positive().optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
});

const getPostByIdSchema = Joi.object({
    id: Joi.number().integer().positive().required()
});

const updatePostSchema = Joi.object({
    id: Joi.number().integer().positive().required(),
    title: Joi.string().min(3).max(255).required()
});
module.exports = { createPostSchema, searchPostSchema, getPostByIdSchema, updatePostSchema, allPostSchema };
