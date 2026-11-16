const express = require('express');
const pool = require('../db');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Informe email e password como texto.' });
    }
    const result = await pool.query('SELECT id, name, email, role, password_hash FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    const { password_hash: _passwordHash, ...safeUser } = user;
    res.json({ message: 'Login realizado', user: safeUser, next: 'Use X-User-Id nas rotas protegidas neste laboratório.' });
  } catch (error) { next(error); }
});
module.exports = router;
