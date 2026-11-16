const pool = require('../db');

async function requireUser(req, res, next) {
  const rawId = req.get('X-User-Id');
  const id = Number(rawId);
  if (!rawId || !Number.isInteger(id) || id < 1) {
    return res.status(401).json({ error: 'Identificação do usuário ausente ou inválida.' });
  }
  try {
    const result = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [id]);
    if (!result.rows[0]) return res.status(401).json({ error: 'Usuário não encontrado.' });
    req.user = result.rows[0];
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = { requireUser };
