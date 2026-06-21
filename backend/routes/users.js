const express = require('express');
const router = express.Router();
const pool = require('../db');
const { checkUserStatus } = require('../middleware/auth'); 


router.use(checkUserStatus);

router.get('/', async (req, res) => {
  try {
    const users = await pool.query(
      'SELECT id, name, email, status, registration_time, last_login_time FROM users ORDER BY last_login_time DESC'
    );
    res.json(users.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка получения списка пользователей' });
  }
});

router.post('/block', async (req, res) => {
  const { userIds } = req.body; 
  if (!userIds || !Array.isArray(userIds)) {
    return res.status(400).json({ message: 'Неверный формат данных' });
  }
  try {
    await pool.query('UPDATE users SET status = \'blocked\' WHERE id = ANY($1)', [userIds]);
    res.json({ message: 'Пользователи успешно заблокированы' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при блокировке' });
  }
});

router.post('/unblock', async (req, res) => {
  const { userIds } = req.body;
  if (!userIds || !Array.isArray(userIds)) {
    return res.status(400).json({ message: 'Неверный формат данных' });
  }
  try {
    await pool.query('UPDATE users SET status = \'active\' WHERE id = ANY($1)', [userIds]);
    res.json({ message: 'Пользователи успешно разблокированы' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при разблокировке' });
  }
});

router.post('/delete', async (req, res) => {
  const { userIds } = req.body;
  if (!userIds || !Array.isArray(userIds)) {
    return res.status(400).json({ message: 'Неверный формат данных' });
  }
  try {
    await pool.query('DELETE FROM users WHERE id = ANY($1)', [userIds]);
    res.json({ message: 'Пользователи успешно удалены' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при удалении' });
  }
});

module.exports = router;