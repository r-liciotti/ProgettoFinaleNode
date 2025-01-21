const pool = require('../models/db');
const { getInteractionByIdSchema, createInteractionSchema, updateInteractionSchema, deleteInteractionSchema } = require('../utils/interactionSchema');


exports.getInteractionById = async (req, res) => {
    try {
        const { error, value } = getInteractionByIdSchema.validate(req.params, { abortEarly: false });
        if (error) {
            return res.error(400, { errors: error.details.map((err) => err.message) });
        }
        const { id } = req.params;
        const [rows] = await pool.execute('SELECT * FROM interactions WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.error(404, { error: 'Interaction not found' });
        }
        res.success(rows[0]);
    } catch (error) {
        res.error(500, { error: 'Failed to fetch interaction' });
    }
}

exports.getAllInteractions = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM interactions');
        res.success(rows);
    } catch (error) {
        res.error(500, { error: 'Failed to fetch interactions' });
    }
};

exports.createInteraction = async (req, res) => {
    try {
        const { error, value } = createInteractionSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.error(400, { errors: error.details.map((err) => err.message) });
        }
        const { type, postId, userId } = value;


        const [result] = await pool.execute(
            'INSERT INTO interactions (type, post_id, user_id) VALUES (?, ?, ?)',
            [type, postId, userId]
        );

        res.success({
            message: 'Interaction created successfully',
            interactionId: result.insertId, // Restituisce l'ID dell'interazione creata
        });
    } catch (error) {
        res.error(500, { error: 'Failed to create interaction' });
    }
};

exports.updateInteraction = async (req, res) => {
    try {
        const { error, value } = updateInteractionSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.error(400, { errors: error.details.map((err) => err.message) });
        }

        const { id, type } = req.body;

        const [result] = await pool.execute(
            'UPDATE interactions SET type = ? WHERE id = ?',
            [type, id]
        );

        if (result.affectedRows === 0) {
            return res.error(404, { error: 'Interaction not found' });
        }

        res.success();
    } catch (error) {
        res.error(500, { error: 'Failed to update interaction' });
    }
};

exports.deleteInteraction = async (req, res) => {
    try {
        const { error, value } = deleteInteractionSchema.validate(req.query, { abortEarly: false });
        if (error) {
            return res.error(400, { errors: error.details.map((err) => err.message) });
        }

        const { id } = req.body;

        const [result] = await pool.execute('DELETE FROM interactions WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.error(404, { error: 'Interaction not found' });
        }

        res.success();
    } catch (error) {
        res.error(500, { error: 'Failed to delete interaction' });
    }
};
