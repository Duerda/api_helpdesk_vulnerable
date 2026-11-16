const express = require('express');
const pool = require('../db');
const { requireUser } = require('../middleware/auth');
const router = express.Router();

router.use(requireUser);

function visibility(req) {
  return req.user.role === 'support'
    ? { clause: '', params: [] }
    : { clause: ' WHERE requester_id = $1', params: [req.user.id] };
}

router.get('/', async (req, res, next) => {
  try {
    const access = visibility(req);
    const result = await pool.query(
      `SELECT id, title, status, requester_id, created_at FROM tickets${access.clause} ORDER BY id`,
      access.params
    );
    res.json(result.rows);
  } catch (error) { next(error); }
});

router.get('/search', async (req, res, next) => {
  try {
    const term = String(req.query.term || '').trim();
    if (term.length > 100) return res.status(400).json({ error: 'Termo de pesquisa muito longo.' });
    const access = visibility(req);
    const offset = access.params.length;
    const where = access.clause ? `${access.clause} AND title ILIKE $${offset + 1}` : ' WHERE title ILIKE $1';
    const result = await pool.query(
      `SELECT id, title, status, requester_id FROM tickets${where} ORDER BY id`,
      [...access.params, `%${term}%`]
    );
    res.json(result.rows);
  } catch (error) { next(error); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: 'ID inválido' });
    const access = visibility(req);
    const ownerClause = access.params.length ? ' AND requester_id = $2' : '';
    const result = await pool.query(
      `SELECT id, title, description, status, requester_id, created_at FROM tickets WHERE id = $1${ownerClause}`,
      [id, ...access.params]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Chamado não encontrado' });
    res.json(result.rows[0]);
  } catch (error) { next(error); }
});
module.exports = router;
