const Joi = require('joi');

const createInteractionSchema = Joi.object({
    postId: Joi.number().integer().positive().required().messages({
        "number.base": "L'ID del post deve essere un numero.",
        "number.integer": "L'ID del post deve essere un numero intero.",
        "number.positive": "L'ID del post deve essere un numero positivo."
    }),
    userId: Joi.number().integer().positive().required().messages({
        "number.base": "L'ID dell'utente deve essere un numero.",
        "number.integer": "L'ID dell'utente deve essere un numero intero.",
        "number.positive": "L'ID dell'utente deve essere un numero positivo."
    }),
    type: Joi.string().valid('like', 'comment').required().messages({
        "string.base": "Il tipo dell'interazione deve essere una stringa.",
        "string.valid": "Il tipo dell'interazione deve essere 'like' o 'comment'.",
        "any.required": "Il tipo dell'interazione é obbligatorio."
    })
});

const updateInteractionSchema = Joi.object({
    id: Joi.number().integer().positive().required().messages({
        "number.base": "L'ID dell'interazione deve essere un numero.",
        "number.integer": "L'ID dell'interazione deve essere un numero intero.",
        "number.positive": "L'ID dell'interazione deve essere un numero positivo."
    }),
    type: Joi.string().valid('like', 'comment').required().messages({
        "string.base": "Il tipo dell'interazione deve essere una stringa.",
        "string.valid": "Il tipo dell'interazione deve essere 'like' o 'comment'.",
        "any.required": "Il tipo dell'interazione é obbligatorio."
    })
});

const deleteInteractionSchema = Joi.object({
    id: Joi.number().integer().positive().required().messages({
        "number.base": "L'ID dell'interazione deve essere un numero.",
        "number.integer": "L'ID dell'interazione deve essere un numero intero.",
        "number.positive": "L'ID dell'interazione deve essere un numero positivo."
    })
});

module.exports = { createInteractionSchema, updateInteractionSchema, deleteInteractionSchema };
