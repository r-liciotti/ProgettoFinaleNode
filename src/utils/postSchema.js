const Joi = require('joi');

// Schema per la creazione di un post
const createPostSchema = Joi.object({
    title: Joi.string().min(3).max(255).required().messages({
        "string.base": "Il titolo deve essere una stringa.",
        "string.empty": "Il titolo non può essere vuoto.",
        "string.min": "Il titolo deve contenere almeno 3 caratteri.",
        "string.max": "Il titolo non può superare i 255 caratteri.",
        "any.required": "Il titolo è obbligatorio."
    }),
    nickname: Joi.string().optional(),
    userid: Joi.number().integer().positive().optional(),
});

// Schema per la ricerca di un post
const searchPostSchema = Joi.object({
    title: Joi.string().min(3).max(255).optional().messages({
        "string.base": "Il titolo deve essere una stringa.",
        "string.min": "Il titolo deve contenere almeno 3 caratteri.",
        "string.max": "Il titolo non può superare i 255 caratteri."
    }),
    userId: Joi.number().integer().positive().optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
});

const getPostByIdSchema = Joi.object({
    id: Joi.number().integer().positive().required().messages({
        "number.base": "L'ID deve essere un numero.",
        "number.integer": "L'ID deve essere un numero intero.",
        "number.positive": "L'ID deve essere un numero positivo."
    })
});

const updatePostSchema = Joi.object({
    id: Joi.number().integer().positive().required().messages({
        "number.base": "L'ID deve essere un numero.",
        "number.integer": "L'ID deve essere un numero intero.",
        "number.positive": "L'ID deve essere un numero positivo."
    }),
    title: Joi.string().min(3).max(255).required().messages({
        "string.base": "Il titolo deve essere una stringa.",
        "string.empty": "Il titolo non può essere vuoto.",
        "string.min": "Il titolo deve contenere almeno 3 caratteri.",
        "string.max": "Il titolo non può superare i 255 caratteri.",
        "any.required": "Il titoloè obbligatorio."
    })
});
module.exports = { createPostSchema, searchPostSchema, getPostByIdSchema, updatePostSchema };
