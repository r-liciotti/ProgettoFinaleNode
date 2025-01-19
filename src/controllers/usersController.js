const pool = require('../models/db');
const { createUserSchema } = require('../utils/userSchema');
// Creazione di un nuovo utente
exports.createUser = async (req, res) => {
    try {
        //console.log(req.query);
        console.log(req.body);

        const { error, value } = createUserSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.error({ errors: error.details.map((err) => err.message) });
        }
        const { nickname, age, city } = req.body; // Usa req.body

        const [existingUser] = await pool.execute('SELECT id FROM users WHERE nickname = ?', [nickname]);
        if (existingUser.length > 0) {
            return res.error(400, { error: 'Nickname already exists' });
        }

        const [result] = await pool.execute(
            'INSERT INTO users (nickname, age, city) VALUES (?, ?, ?)',
            [nickname, age, city]
        );


        res.success({ id: rows.insertId, title });

    } catch (error) {
        res.error(500, 'Failed to fetch posts', { internalError: error.message });

    }
};

// Recupera tutti gli utenti
exports.getAllUsers = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM users');
        res.success(rows);
    } catch (error) {
        res.error(500, { error: 'Failed to fetch users' });
    }
};

// Recupera un utente specifico per ID
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.success(rows[0]);
    } catch (error) {
        res.error(500, { error: 'Failed to fetch user' });
    }
};

// Aggiorna un utente
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { nickname, age, city } = req.body;

        if (!nickname && !age && !city) {
            return res.error(400, { error: 'At least one field (nickname, age, or city) is required to update' });
        }

        const updates = [];
        const params = [];

        if (nickname) {
            updates.push('nickname = ?');
            params.push(nickname);
        }
        if (age) {
            if (isNaN(age) || age <= 0) {
                return res.error(400, { error: 'Age must be a positive number' });
            }
            updates.push('age = ?');
            params.push(age);
        }
        if (city) {
            updates.push('city = ?');
            params.push(city);
        }

        params.push(id); // Aggiungi l'ID alla fine

        const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;

        const [result] = await pool.execute(query, params);
        if (result.affectedRows === 0) {
            return res.error(400, { error: 'User not found' });
        }

        res.success({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.error(500, { error: 'Failed to update user' });
    }
};

// Elimina un utente
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};
