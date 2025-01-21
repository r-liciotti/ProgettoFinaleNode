const Joi = require('joi');

const getInteractionByIdSchema = Joi.object({
    id: Joi.number().integer().positive().required()
});


const createInteractionSchema = Joi.object({
    postId: Joi.number().integer().positive().required(),
    userId: Joi.number().integer().positive().required(),
    type: Joi.string().valid('like', 'comment').required()
});

const updateInteractionSchema = Joi.object({
    id: Joi.number().integer().positive().required(),
    type: Joi.string().valid('like', 'comment').required()
});

const deleteInteractionSchema = Joi.object({
    id: Joi.number().integer().positive().required()
});

module.exports = { createInteractionSchema, updateInteractionSchema, deleteInteractionSchema, getInteractionByIdSchema };
