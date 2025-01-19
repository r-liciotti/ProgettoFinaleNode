const validatePostInput = (req, res, next) => {
    const { title, nickname, userid } = { ...req.body, ...req.query }; // Merge tra body e query

    // Controllo sul titolo
    if (!title || typeof title !== 'string') {
        return res.status(400).json({ error: 'Title is required and must be a string' });
    }

    // Controllo su nickname e userid
    if (!nickname && !userid) {
        return res.status(400).json({ error: 'Nickname or UserID is required' });
    }

    // Controllo sul tipo di userid
    if (userid && isNaN(Number(userid))) {
        return res.status(400).json({ error: 'UserID must be a valid number' });
    }

    next(); // Passa al controller successivo
};

const validatePostDateInput = (req, res, next) => {
    console.log("validatePostDateInput");

    const { startDate, endDate } = { ...req.body, ...req.query }; // Merge tra body e query

    // Controllo su startDate
    if (startDate) {
        if (typeof startDate !== 'string' || isNaN(new Date(startDate).getTime())) {
            return res.status(400).json({ error: 'startDate must be a valid date string' });
        }
    }

    // Controllo su endDate
    if (endDate) {
        if (typeof endDate !== 'string' || isNaN(new Date(endDate).getTime())) {
            return res.status(400).json({ error: 'endDate must be a valid date string' });
        }
    }

    next(); // Passa al controller successivo
};

module.exports = { validatePostInput, validatePostDateInput };
