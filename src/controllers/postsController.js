const pool = require('../models/db');
const { createPostSchema, searchPostSchema } = require('../utils/postSchema');

// Ottieni post con filtri di ricerca
exports.getPostsBySearch = async (req, res) => {
    try {
        const { error, value } = searchPostSchema.validate(req.query, { abortEarly: false });
        if (error) {
            return res.error(400, { errors: error.details.map((err) => err.message) });
        }

        const queryParams = [];
        let query = `
        SELECT 
            posts.id,
            posts.title,
            posts.created_at,
            posts.user_id,
            users.nickname,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'type', interactions.type,
                    'count', interactions.count
                )
            ) AS interactions,
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'type', interactions.type,
                        'user_id', interactions.user_id,
                        'nickname', users.nickname,
                        'city', users.city,
                        'interaction_date', interactions.created_at
                    )
                )
                FROM interactions
                LEFT JOIN users ON interactions.user_id = users.id
                WHERE interactions.post_id = posts.id
            ) AS detailed_interactions
        FROM posts
        LEFT JOIN users ON posts.user_id = users.id
        LEFT JOIN (
            SELECT 
                post_id,
                type,
                COUNT(*) AS count
            FROM interactions
            GROUP BY post_id, type
        ) AS interactions ON posts.id = interactions.post_id
    `;
        query = getWhere_date_interval(query, queryParams, req);
        query = getWhere_byUser(query, queryParams, req);
        query = getWhere_likeTitle(query, queryParams, req);
        query += ' GROUP BY posts.id ORDER BY posts.created_at DESC';

        const [rows] = await pool.execute(query, queryParams);
        res.success(rows);

    } catch (error) {

        res.error(500, 'Failed to search posts', { internalError: error.message });
    }
};

// Ottieni tutti i post con eventuali intervalli di data
exports.getAllPosts = async (req, res) => {
    try {
        // Validazione input con schema di ricerca
        const { error, value } = searchPostSchema.validate(req.query, { abortEarly: false });
        if (error) {
            return res.error(400, { errors: error.details.map((err) => err.message) });
        }


        const queryParams = [];
        let query = `
        SELECT 
            posts.id,
            posts.title,
            posts.created_at,
            posts.user_id,
            users.nickname,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'type', interactions.type,
                    'count', interactions.count
                )
            ) AS interactions,
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'type', interactions.type,
                        'user_id', interactions.user_id,
                        'nickname', users.nickname,
                        'city', users.city,
                        'interaction_date', interactions.created_at
                    )
                )
                FROM interactions
                LEFT JOIN users ON interactions.user_id = users.id
                WHERE interactions.post_id = posts.id
            ) AS detailed_interactions
        FROM posts
        LEFT JOIN (
            SELECT 
                post_id,
                type,
                COUNT(*) AS count
            FROM interactions
            GROUP BY post_id, type
        ) AS interactions ON posts.id = interactions.post_id
        LEFT JOIN users ON posts.user_id = users.id
    `;
        query = getWhere_date_interval(query, queryParams, req);
        query = getWhere_city(query, queryParams, req);

        query += ' GROUP BY posts.id ORDER BY posts.created_at DESC';

        const [rows] = await pool.execute(query, queryParams);
        res.success(rows);
    } catch (error) {
        res.error(500, 'Failed to fetch posts', { internalError: error.message });
    }
};

// Ottieni un singolo post per ID
exports.getPostById = async (req, res) => {
    try {
        // Validazione input con schema di ricerca
        const { error, value } = getPostByIdSchema.validate(req.query, { abortEarly: false });
        if (error) {
            return res.error(400, { errors: error.details.map((err) => err.message) });
        }

        const { id } = value;

        const [rows] = await pool.execute('SELECT id, title, created_at FROM posts WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.error(404, 'Post not found');
        }
        res.success(rows[0]);
    } catch (error) {
        res.error(500, 'Failed to fetch post', { internalError: error.message });
    }
};

// Crea un nuovo post
exports.createPost = async (req, res) => {
    try {
        // Validazione dell'input utente
        const { error, value } = createPostSchema.validate(req.body, { abortEarly: false });

        if (error) {
            // Restituisci gli errori in modo leggibile
            return res.error(400, { errors: error.details.map((err) => err.message) });
        }
        const { title, nickname, userid } = value;

        //const { title, nickname, userid } = req.query;


        if (!nickname && !userid) {
            return res.error(400, 'Nickname or userid are required');
        }

        let tmp_userid = userid;
        if (!userid) {
            const [userRows] = await pool.execute('SELECT id FROM users WHERE nickname = ?', [nickname]);
            if (userRows.length === 0) {
                return res.error(404, 'User not found');
            }
            tmp_userid = userRows[0].id;
        }

        const [rows] = await pool.execute('INSERT INTO posts (title, user_id) VALUES (?, ?)', [title, tmp_userid]);
        res.success({ id: rows.insertId, title });
    } catch (error) {
        res.error(500, 'Failed to create post', { internalError: error.message });
    }
};

// Aggiorna un post
exports.updatePost = async (req, res) => {
    try {
        // Validazione input con schema di ricerca
        const { error, value } = updatePostSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.error(400, { errors: error.details.map((err) => err.message) });
        }

        const { id } = req.params;
        const { title } = req.body;


        const [rows] = await pool.execute('UPDATE posts SET title = ? WHERE id = ?', [title, id]);
        if (rows.affectedRows === 0) {
            return res.error(404, 'Post not found');
        }
        res.success({ success: true });
    } catch (error) {
        res.error(500, 'Failed to update post', { internalError: error.message });
    }
};

// Elimina un post
exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.execute('DELETE FROM posts WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.error(404, 'Post not found');
        }
        res.success({ success: true });
    } catch (error) {
        res.error(500, 'Failed to delete post', { internalError: error.message });
    }
};

// Helpers rimangono invariati
function getWhere_date_interval(query, queryParams, req) {
    const { startDate, endDate } = req.query;
    if (startDate) {
        query = addWhereClause(query, 'posts.created_at >= ?', startDate, queryParams);
    }
    if (endDate) {
        query = addWhereClause(query, 'posts.created_at <= ?', endDate, queryParams);
    }
    return query;
}

function getWhere_city(query, queryParams, req) {
    const { city } = req.query;
    if (city) {
        query = addWhereClause(query, 'users.city = ?', city, queryParams);
    }
    return query;
}

function getWhere_byUser(query, queryParams, req) {
    const { userId, nickname } = req.query;

    if (userId) {
        query = addWhereClause(query, 'posts.user_id = ?', userId, queryParams);
    }
    if (nickname) {
        query = addWhereClause(query, 'users.nickname = ?', nickname, queryParams);
    }

    return query;
}

function getWhere_likeTitle(query, queryParams, req) {
    const { title } = req.query;
    if (title) {
        query = addWhereClause(query, 'posts.title LIKE ?', `${title}%`, queryParams);
    }
    return query;
}

function addWhereClause(query, condition, param, queryParams) {
    if (!query.toLowerCase().includes('where')) {
        query += ' WHERE ' + condition;
    } else {
        query += ' AND ' + condition;
    }
    if (param !== undefined) {
        queryParams.push(param);
    }
    return query;
}
