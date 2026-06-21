const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Заполните все поля' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      `INSERT INTO users (name, email, password_hash, status) 
       VALUES ($1, $2, $3, 'unverified') RETURNING id, name, email, status`,
      [name, email, passwordHash]
    );

    setTimeout(() => {
      console.log(`[Email Service] Письмо подтверждения отправлено на ${email}`);
    }, 1000);

    return res.status(201).json({
      message: 'Регистрация успешна! Проверьте почту.',
      user: newUser.rows[0]
    });

  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Пользователь с таким Email уже зарегистрирован!' });
    }
    console.error(error);
    return res.status(500).json({ message: 'Ошибка сервера при регистрации' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Неверный email или password' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'Ваш аккаунт заблокирован' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный email или password' });
    }

    await pool.query('UPDATE users SET last_login_time = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

    if (user.status === 'unverified') {
      await pool.query("UPDATE users SET status = 'active' WHERE id = $1", [user.id]);
    }

    const token = jwt.sign(
  { id: user.id, email: user.email }, 
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, status: 'active' }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Ошибка сервера при авторизации' });
  }
});

module.exports = router;